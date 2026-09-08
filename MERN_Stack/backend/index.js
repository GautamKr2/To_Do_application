import express from 'express';
const app = express();

app.get("/", (req, resp) => {
    resp.send({
        success: true,
        message: "Running a simple API"
    })
})

app.listen(3200);