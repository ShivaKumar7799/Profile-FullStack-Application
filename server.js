const express = require("express");
const app = express();
const devUser = require("./devUserModel")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const middleWare = require("./middleWare");
const reviewModel = require("./reviewModel");
const cors = require("cors")

app.use(express.json())
app.use(cors({origin : "*"}))

mongoose.connect("mongodb+srv://shivakumar:shivakumar@shivakumar.0umpwxt.mongodb.net/profile?retryWrites=true&w=majority").then(() => console.log("db connected")).catch("db error")

app.get('/',(req,res) => {
  return res.send("Hello World")
} )

app.post("/register", async(req,res) => {
  try{
    const {fullName, email, mobile, skill, password, confirmPassword  } = req.body
    const exist = await devUser.findOne({email})
    if(exist){
      return res.status(400).send("User Already Registed")
    }
    if(password !== confirmPassword){
      return res.status(403).send("Password not matched")
    }
    let newUser = new devUser({
      fullName, email, mobile, skill, password, confirmPassword
    })
    newUser.save()
    return res.status(200).send("User registered Successfully")
  }
  catch(err){
    console.log(err)
    return res.status(500).send("Server Error")
  }
})

app.post("/login", async(req,res) => {
  try{
      const {email,password} = req.body
      const exist = await devUser.findOne({email})
      if(!exist){
        return res.status(400).send("User not exist")
      }
      console.log(exist)
      if(exist.password != password){
        return res.status(400).send("Password Invalid")
      }

      let payload = {
        user : {
          id : exist.id
        }
      }

      jwt.sign(payload, "jwtPassword", {expiresIn : 36000}, (err,token) => {
          if(err) throw err 
          return res.json({token})
      })

  }
  catch(err){
    console.log(err)
    return res.status(400).send("Server Error")
  }
})


app.get("/allProfiles", middleWare, async(req,res) => {
  try{
    let allProfiles = await devUser.find()
    return res.status(200).json(allProfiles)
  }
  catch(err){
    console.log(err)
    return res.status(500).send("server Error")
  }
} )

app.get("/myProfile", middleWare, async(req,res) => {
  try{
    let user = await devUser.findById(req.user.id)
    return res.json(user)
  }
  catch(err){
    console.log(err)
    return res.status(500).send("Server Error")
  }
} )


app.post("/addReview", middleWare, async(req,res) => {
  try{
      const {taskWorker, rating} = req.body
      const exist = await devUser.findById(req.user.id)
      const newReview = new reviewModel({
        taskProvider : exist.fullName, 
        taskWorker,
        rating
      })
      newReview.save()
      return res.status(200).send('Review updated successfully')
  }
  catch(err){
    console.log(err)
    return res.status(500).send("Internal server error")
  }
} )

app.get("/myReview", middleWare, async(req,res) => {
  try{
      let allReviews = await reviewModel.find()
      let myReviews = allReviews.filter(review => review.taskWorker === req.user.id.toString())
      return res.status(200).json(myReviews)
  }
  catch(err){
    console.log(err)
    return res.status(500).send("Internal server error")
  }
} )

app.listen(5050, () => {
  console.log("server running")
})