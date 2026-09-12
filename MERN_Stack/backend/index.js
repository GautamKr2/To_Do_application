import express from 'express';
import cors from 'cors';
import { collectionName, connection } from './dbconfig.js';
import { ObjectId } from 'mongodb';
const app = express();

app.use(express.json());
app.use(cors());

// API to add task
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
})

// API to fetch all tasks
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

//API to delete task
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

// API to get one task for edit
app.get("/update-task/:id", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collectionName);
    let data = await collection.findOne({_id: new ObjectId(req.params.id)});
    if(data) {
        resp.send({success: true, message: "Data fetched successfully", task: data});
    }
    else {
        resp.send({success: false, message: "Data not fetched"});
    }
})

// API to update task
app.put("/update-task/:id", async (req, resp) => {
    const id = req.params.id;

    const { _id, ...taskData } = req.body;
    
    const db = await connection();
    const collection = db.collection(collectionName);
    const response = await collection.replaceOne({_id: new ObjectId(id)}, {_id: new ObjectId(id), ...taskData});
    if(response.modifiedCount > 0) {
        resp.send({success: true, message: "Data updated successfully"});
    }
    else {
        resp.send({success: false, message: "Data not updated"});
    }
})

// API to delete multiple tasks
app.delete("/multi-delete", async (req, resp) => {
    const ids = req.body;
    const selectedTasksIds = ids.map((id) => new ObjectId(id));
    const db = await connection();
    const collection = db.collection(collectionName);
    const response = await collection.deleteMany({_id: {$in: selectedTasksIds}});
    console.log(response)
    if(response.deletedCount > 0) {
        resp.send({success: true, message: "Data deleted successfully", response});
    }
    else {
        resp.send({success: false, message: "Data not deleted"});
    }
})

app.listen(3200);