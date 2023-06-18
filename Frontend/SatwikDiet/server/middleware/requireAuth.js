const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { jwtKey } = require("../keys");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: "you must logged in first" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, jwtKey, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "you must logged in first" });
    }
    const { userId } = payload;
    const user = await User.findById(userId);
  /*   var today = new Date().toISOString().slice(0, 10);
    var existingDate = user.nutritions.date.toISOString().slice(0, 10);
    if (today != existingDate) {
      user.avgNutrition.avgCals = 0;
      user.avgNutrition.avgFats = 0;
      user.avgNutrition.avgCarbs = 0;
      user.avgNutrition.avgProteins = 0;
    } */
    await user.save()
    req.user = user;
    next();
  });
};
