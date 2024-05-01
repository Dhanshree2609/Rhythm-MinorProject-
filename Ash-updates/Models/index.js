//connect to mongodb
const mongoose = require("mongoose");

//database url with  /databaseName
const url = "mongodb://127.0.0.1:27017/userDb";

//connecting to database
try {
  mongoose.connect(url);
  console.log("connected to database");
} catch (error) {
  console.log("database connection failed");
}

//making a Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your Name"],
      maxLength: [30, "username cannot exceed 10 characters"],
      minLength: [4, "username should have more than 4 characters"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your Email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your Password"],
      minLength: [8, "password should have more than 8 characters"],
      select: false,
    },
  },
  { timestamps: true }
);

//making a model
const userModel = mongoose.model("user", userSchema);

//exporting the model
module.exports = userModel;
