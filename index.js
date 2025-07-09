require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const sendInfoRoute = require("./routes/sendInfo.js");
const sendDetailsZillow = require('./routes/zillow.js')
const User = require("./model/user");
const appNotFound = require("./appnotFound.js");
const cors = require("cors");


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello this is from streetEasy");
});

app.use("/", sendInfoRoute);
app.use("/", sendDetailsZillow)


mongoose.connect(process.env.MONGO_URI, {
  family: 4,
});

// wake up the server every fourteen minutes
const createDummyUser = async () => {
  try {
    const dummyUser = new User({
      userName: "Dummy User",
    });
    await dummyUser.save();
    console.log("Dummy user created:", dummyUser);
  } catch (error) {
    console.error("Error creating dummy user:", error);
  }
};

// Function to delete all users every day

const deleteAllUsers = async () => {
  try {
    await User.deleteMany({});
    console.log("All users deleted");
  } catch (error) {
    console.error("Error deleting users:", error);
  }
};

// schedule creating server every 14 minutes
setInterval(createDummyUser, 14 * 60 * 1000);

// Schedule deletion of all users every 24 hours
setInterval(deleteAllUsers, 24 * 60 * 60 * 1000);

app.use(appNotFound);

const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log("listening on port 3000");
});
