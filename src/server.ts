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
