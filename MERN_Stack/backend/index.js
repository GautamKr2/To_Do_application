import express from 'express';
import cors from 'cors';
import { collectionName, connection } from './dbconfig.js';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
    "http://localhost:5173",
    "https://todoapp-rose-eight.vercel.app"
];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(cookieParser());

// API to add task
app.post("/add-task", verifyJWTToken, async (req, resp) => {
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
app.get("/tasks", verifyJWTToken, async (req, resp) => {
    
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
app.delete("/delete-task/:id", verifyJWTToken, async (req, resp) => {
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
app.get("/update-task/:id", verifyJWTToken, async (req, resp) => {
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
app.put("/update-task/:id", verifyJWTToken, async (req, resp) => {
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
app.delete("/multi-delete", verifyJWTToken, async (req, resp) => {
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


const jwt_sec = process.env.jwt_secret;
// API for SignUp page
app.post("/signup", async (req, resp) => {
    const userData = req.body;
    console.log(userData)
    if(userData.name && userData.email, userData.password) {
        const db = await connection();
        const collection = db.collection('users');
        const result = await collection.insertOne(userData);
        if(result.acknowledged) {
            jwt.sign(userData, jwt_sec, {expiresIn: '5d'}, (error, token) => {
                resp.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 5 * 24 * 60 * 60 * 1000
                });
                resp.send({success: true, message: "SignIn done", token});
            })
        }
        else {
            resp.send({success: false, message: "SignIn not done"});
        }
    }
    else {
        resp.send({success: false, message: "Some input space are vacant"});
    }
})

// API for login page
app.post("/login", async (req, resp) => {
    const userData = req.body;
    if(userData.email && userData.password) {
        const db = await connection();
        const collection = db.collection("users");
        const result = await collection.findOne({email: userData.email, password: userData.password});
        if(result) {
            jwt.sign(userData, jwt_sec, {expiresIn: '5d'}, (error, token) => {
                resp.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 5 * 24 * 60 * 60 * 1000
                });
                resp.send({success: true, message: "You have login successfully", token})
            })
        }
        else {
            resp.send({success: false, message: "Login not done"});
        }
    }
    else {
        resp.send({success: false, message: "Some input space is vacant"});
    }
})


// Function to verify token
function verifyJWTToken(req, resp, next) {
    // console.log('Cookie token from function: ', req.cookies.token)
    const token = req.cookies.token;
    jwt.verify(token, jwt_sec, (error, decoded) => {
        if(error) {
            resp.send({
                success: false,
                message: "Please login first"
            })
        }
        else {
            next()
        }
    })
}

const PORT = process.env.PORT || 3200;

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});