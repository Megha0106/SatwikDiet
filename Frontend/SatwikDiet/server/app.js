const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const {mongoURL} = require('./keys')
require('./models/userSchema')
const authRoutes = require("./routes/authRoutes")
const requireAuth = require('./middleware/requireAuth')
app.use(express.json());
app.use(bodyParser.json())
app.use(authRoutes)



mongoose.connect(mongoURL,{
    useNewUrlParser:true
})
mongoose.connection.on("connected",()=>{
    console.log("Connected to db...")
})

mongoose.connection.on("error",(err)=>{
    console.log("error:",err)
})
/* app.get("/",(req,res)=>{
    res.send("Welcome to node js")
}) */

app.get("/",requireAuth,(req,res)=>{
    res.send(req.user)
})
app.listen(3000,()=>{
    console.log("Server running")
})
