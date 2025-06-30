// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import app from "./app";

// dotenv.config();

// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   console.error("MONGO_URI is not defined in your environment variables.");
//   process.exit(1);
// }

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected");
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to connect to MongoDB:", err);
//     process.exit(1);
//   });

import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const SKIP_DB = process.env.SKIP_DB === "true"; 

if (SKIP_DB) {

  app.listen(PORT, () => {
    console.log(`Server running (without DB) on http://localhost:${PORT}`);
  });
} else {
  if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in your environment variables.");
    process.exit(1);
  }

  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB Connected");
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err);
      process.exit(1);
    });
}

