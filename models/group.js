import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Group", GroupSchema);
