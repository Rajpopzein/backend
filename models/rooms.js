// models/Room.js
import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],

  roomId: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Room", RoomSchema);
