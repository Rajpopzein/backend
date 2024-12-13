import express from "express";
import user from "../models/user.js";

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

export default userRouter;