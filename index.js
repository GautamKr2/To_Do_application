import express from 'express';
import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';
import "dotenv/config";

const app = express();
const publicPath = path.resolve("public");

app.use(express.urlencoded({extended: false}));

const dbName = "node-project";
const collection1 = "todo_list";
const client = new MongoClient(process.env.db_url);

// Function to connect databade
async function connection() {
    const connect = await client.connect();
    return await connect.db(dbName)
}

app.set('view engine' , 'ejs');
app.use(express.static(publicPath));

app.get("/", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collection1);
    const taskList = await collection.find().toArray();
    resp.render("list", {taskList})
})

app.get("/add", (req, resp) => {
    resp.render("add")
})

app.get("/update", (req, resp) => {
    resp.render("update")
})

app.post("/add", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collection1);
    const result = await collection.insertOne(req.body);
    if(result.acknowledged) {
        resp.redirect("/")
    }
    else {
        resp.redirect("/add")
    }
})

// API for delete task
app.get("/delete/:id", async (req, resp) => {
    const id = req.params.id;
    const db = await connection();
    const collection = db.collection(collection1);
    const result = await collection.deleteOne({_id: new ObjectId(id)});
    if(result.deletedCount == 1) {
        resp.redirect("/");
    }
    else {
        resp.send("<p> Some error has occured </p>");
    }
})

app.delete("/delete/:id", async (req, resp) => {
    const id = req.params.id;
    const db = await connection();
    const collection = db.collection(collection1);
    const result = await collection.deleteOne({_id: new ObjectId(id)});
    if(result.deletedCount == 1) {
        resp.json({success: true, message: "Task deleted successfully"});
    }
    else {
        resp.status(404).json({
            success: false,
            message: "Task not found"
        });
    }
})

app.post("/update", (req, resp) => {
    resp.redirect("/")
})

app.listen(3200)