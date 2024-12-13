import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  content: { type: String, required: true },
  mediaUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", MessageSchema);
