import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITask extends Document {
  name: string;
  description: string;
  budget: number;
  claimedBy: Types.ObjectId | null;
}

const TaskSchema = new Schema<ITask>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  claimedBy: { type: Schema.Types.ObjectId, ref: "User", default: null } // ✅ Allow null
});

export default mongoose.model<ITask>("Task", TaskSchema);
