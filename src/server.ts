import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => console.log("Server running on http://localhost:5000"));
  })
  .catch(err => console.error(err));


// import express from 'express';
// import dotenv from 'dotenv';
// import connectDB from './config/db';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// connectDB();

// app.use(express.json());

// app.get("/", (_, res) => {
//   res.send("API is working");
// });

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
