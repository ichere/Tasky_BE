import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  budget: Number,
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
});

export default mongoose.model("Task", taskSchema);