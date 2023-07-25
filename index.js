
const express = require('express');

const app=express();

app.use(express.json())

const db = require('./models/index');

const {courseRouter} = require("./courses.routes");

const {studentRouter} = require('./student.routes')



app.get("/", (req,res)=>{
    return res.status(200).send({
        "msg":"Welcome to School Backend",
        "Success":true,
        "Code":200
    })
})


app.use("/student",studentRouter);

app.use("/course", courseRouter);


app.all("*", (req,res)=>{
    res.send({
        "error":"Invalid URL Detected..404 [Not Found!]"
    })
})


// connect to database

db.sequelize.sync().then(()=>{

    try {
        app.listen(3000, ()=>{
            console.log('connected to DB')
        })
        
    } catch (error) {
        console.log(error)
    }


})