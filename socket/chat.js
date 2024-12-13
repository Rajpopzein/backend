import { Server } from "socket.io";
import Message from "../models/messages.js";
import Group from "../models/group.js";
import Rooms from "../models/rooms.js";

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Join a one-to-one or group chat room
    socket.on("joinRoom", ({ roomId }) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // One-to-One Chat: Join a unique room for two users
    socket.on("joinPrivateRoom", async ({ user1, user2 }) => {
      const privateRoomId = [user1, user2].sort().join("_");
      socket.join(privateRoomId);
      console.log("Joined private room", privateRoomId);
      const participants = [user1, user2];
      let room = await Rooms.findOne({ roomId: privateRoomId });
      if (!room) {
        room = new Rooms({ participants, roomId: privateRoomId });
        await room.save();
      }
      console.log(`User ${socket.id} joined private room: ${privateRoomId}`);
    });

    socket.on(
      "sendPrivateMessage",
      async ({ sender, receiver, content, mediaUrl }) => {
        try {
          const privateRoomId = [sender, receiver].sort().join("_"); // Ensure consistent room ID
          console.log("senders:", receiver);
          const message = new Message({
            room: privateRoomId,
            sender,
            receiver,
            content,
            mediaUrl,
          });
          console.log(privateRoomId);
          await message.save();

          // Emit the message to the private room
          io.to(privateRoomId).emit("receivePrivateMessage", {
            sender,
            receiver,
            content,
            mediaUrl,
            createdAt: message.createdAt,
          });
        } catch (error) {
          console.error("Error saving private message:", error);
          socket.emit("error", "Failed to send message");
        }
      }
    );

    socket.on(
      "sendGroupMessage",
      async ({ roomId, sender, content, mediaUrl }) => {
        try {
          // Save the group message to the database
          const message = new Message({
            group: roomId,
            sender,
            content,
            mediaUrl,
          });
          await message.save();

          // Emit the group message to the room
          io.to(roomId).emit("receiveGroupMessage", {
            sender,
            content,
            mediaUrl,
            createdAt: message.createdAt,
          });
        } catch (error) {
          console.error("Error saving group message:", error);
          socket.emit("error", "Failed to send group message");
        }
      }
    );
    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default initializeSocket;
