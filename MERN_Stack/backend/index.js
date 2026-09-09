import express from 'express';
import cors from 'cors';
import { collectionName, connection } from './dbconfig.js';
const app = express();

app.use(express.json());
app.use(cors());

app.post("/add-task", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(req.body);
    if(result.acknowledged) {
        resp.send({success: true, message: "Data insertion successfull", result: result});
    }
    else {
        resp.send({success: false, message: "Data not inserted"});
    }
});

app.get("/tasks", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.find().toArray();
    if(result) {
        resp.send({success: true, message: "Data fetched successfully", taskList: result});
    }
    else {
        resp.send({success: false, message: "Data not fetched"});
    }
})

app.listen(3200);