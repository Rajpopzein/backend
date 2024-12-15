import express from "express";
import user from "../models/user.js";
import upload from "../config/Multer.js";

const userRouter = express.Router();

userRouter.get("/list-all-user/:id", async (req, res) => {
  try {
    const users = await user.find({_id:{$ne:req.params.id}});
    const output = [];

    for (let i = 0; i < users.length; i++) {
      const filterJson = {};
      filterJson.userid = users[i]._id;
      filterJson.username = users[i].username;
      filterJson.email = users[i].email;
      filterJson.role = users[i].role;

      output.push(filterJson);
    }

    res.status(200).json({ message: "User fetched Successful", data: output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

userRouter.post("/upload-document", upload.single("document"), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      file: {
        path: `/uploads/documents/${file.filename}`, // Public URL for the file
        name: file.filename,
        size: file.size,
      },
    });
  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default userRouter;
