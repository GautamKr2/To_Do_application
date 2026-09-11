import express from 'express';
import cors from 'cors';
import { collectionName, connection } from './dbconfig.js';
import { ObjectId } from 'mongodb';
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

app.delete("/delete-task/:id", async (req, resp) => {
    console.log("Id:", req.params.id)
    const db = await  connection();
    const collection = db.collection(collectionName);
    const response = await collection.deleteOne({_id: new ObjectId(req.params.id)});
    if(response.deletedCount > 0) {
        resp.send({success: true, message: "Data deleted successfully"});
    }
    else {
        resp.send({success: false, message: "Data not deleted"});
    }
})

app.listen(3200);