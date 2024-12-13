import express from "express";
import Message from "../models/messages.js";

const messageRouter = express.Router();


// Fetch all messages
messageRouter.get("/", async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a message
messageRouter.post("/", async (req, res) => {
  const { sender, receiver, content, mediaUrl } = req.body;
  try {
    const message = new Message({ sender, receiver, content, mediaUrl });
    await message.save();
    res.status(201).json({ message: "Message sent!", data: message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch messages between two users
messageRouter.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default messageRouter;
