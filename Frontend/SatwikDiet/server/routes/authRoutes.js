const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { jwtKey } = require("../keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

router.post("/signup", async (req, res) => {
  try {
    console.log("POST req", req.body);
    const { name, userName, password } = req.body;
    let user = new User({ name, userName, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, jwtKey);
    res.send({ token });
  } catch (err) {
    res.status(422).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { userName, password } = req.body;
  console.log("Request:",req.body)
  if (!userName || !password) {
    return res
      .status(422)
      .send({ error: "Must provide username and password" });
  }
  const user = await User.findOne({ userName });
  if (!user) {
    return res
      .status(422)
      .send({ error: "Must provide username and password" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, jwtKey);
    res.send({ token });
  } catch (err) {
    return res
      .status(422)
      .send({ error: "Must provide username and password" });
  }
});
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      res.status(400).json({ msg: "no user found" });
    }
    res.send(users);
  } catch (error) {
    console.log(error);
  }
});

router.put("/addDiet/:id", async (req, res) => {
  let temp = [];
  console.log("Request:",req.body);
  const existingUser = await User.findById(req.params.id);
  console.log("existingUser", existingUser);
  var today = new Date().toISOString().slice(0, 10);
  //console.log("lenght:",existingUser.nutritions.nutritionArray.length)
  if (existingUser.nutritions.nutritionArray.length > 0) {
    var existingDate = existingUser.nutritions.date.toISOString().slice(0, 10);
    console.log("today:",today)
    console.log("existingdate:",existingDate)
    if (today != existingDate) {
      existingUser.nutritions.nutritionArray = [];
    }
  }
  temp = [
    ...existingUser.nutritions.nutritionArray,
    ...req.body,
  ];
  existingUser.nutritions.nutritionArray = temp;
  existingUser.nutritions.date = new Date();

  let sumCal = 0,
  sumFats = 0,
  sumCarbs = 0,
  sumProteins = 0;
let arrSize = existingUser.nutritions.nutritionArray.length;
console.log("Avg:",arrSize)
if(typeof existingUser.avgNutrition.date !="undefined"){
  var existingDate = existingUser.avgNutrition.date.toISOString().slice(0, 10);
  if (today != existingDate) {
    existingUser.avgNutrition.avgCals = 0;
    existingUser.avgNutrition.avgFats = 0;
    existingUser.avgNutrition.avgCarbs = 0;
    existingUser.avgNutrition.avgProteins = 0;
  }
}
if(existingUser.nutritions.nutritionArray.length>0) {
  console.log("For loop")
  existingUser.nutritions.nutritionArray.forEach((element) => {
    sumCal += element.calories;
    sumCarbs += element.carbs;
    sumFats += element.fats;
    sumProteins += element.proteins;

    console.log("sumCal:",sumCal)
  });
  existingUser.avgNutrition.avgCals = sumCal / arrSize;
  existingUser.avgNutrition.avgCarbs = sumCarbs / arrSize;
  existingUser.avgNutrition.avgFats = sumFats / arrSize;
  existingUser.avgNutrition.avgProteins = sumProteins / arrSize;
  existingUser.avgNutrition.date = new Date();
} 


  await existingUser.save();
  res.send(existingUser);
});

router.put("/updateAvgNutritions/:id", async (req, res) => {
  console.log("update...")
  const user = await User.findById(req.params.id);
  const today = new Date().toISOString().slice(0, 10);
   // 
    let sumCal = 0,
      sumFats = 0,
      sumCarbs = 0,
      sumProteins = 0;
    let arrSize = user.nutritions.nutritionArray.length;
  console.log("Avg:",arrSize)
    if(typeof user.avgNutrition.date !="undefined"){
      var existingDate = user.avgNutrition.date.toISOString().slice(0, 10);
      if (today != existingDate) {
        user.avgNutrition.avgCals = 0;
        user.avgNutrition.avgFats = 0;
        user.avgNutrition.avgCarbs = 0;
        user.avgNutrition.avgProteins = 0;
      }
    }
    if(user.nutritions.nutritionArray.length>0) {
      console.log("For loop")
      user.nutritions.nutritionArray.forEach((element) => {
        sumCal += element.calories;
        sumCarbs += element.carbs;
        sumFats += element.fats;
        sumProteins += element.proteins;

        console.log("sumCal:",sumCal)
      });
      user.avgNutrition.avgCals = sumCal / arrSize;
      user.avgNutrition.avgCarbs = sumCarbs / arrSize;
      user.avgNutrition.avgFats = sumFats / arrSize;
      user.avgNutrition.avgProteins = sumProteins / arrSize;
      user.avgNutrition.date = new Date();
    } 
    

  await user.save();
  res.send(user);
});
module.exports = router;
