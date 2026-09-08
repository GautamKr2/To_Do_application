import express from 'express';
import { collectionName, connection } from './dbconfig.js';
const app = express();

app.use(express.json());

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

app.listen(3200);