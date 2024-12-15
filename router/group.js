import express from "express";
import groupSchema from "../models/group.js";
import { date } from "yup";
import userSchema from "../models/user.js";
import messageSchema from "../models/messages.js";

const grouproute = express.Router();

grouproute.get("/getGroupdata/:groupId", async (req, res) => {
  try {
    const group = await groupSchema.findById(req.params.groupId);
    if (!group) {
      return res.status(404).send({ message: "Message not found" });
    }
    const message = await messageSchema.find({
      group: { $eq: req.params.groupId },
    });

    return res.status(200).send({ message: "Group fetched", data: message });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

grouproute.get("/getAllGroups/:userId", async (req, res) => {
  try {
    const groups = await groupSchema.find({
      members: { $eq: req.params.userId },
    });

    if (groups.length > 0) {
      // Fetch users who created the groups
      const users = await Promise.all(
        groups.map(async (group) => {
          return await userSchema.findById(group.createdBy);
        })
      );

      return res.status(200).send({
        message: "Groups fetched successfully",
        data: groups,
        createdByUsers: users, // Include the user details in the response
      });
    } else {
      return res.status(404).send({ message: "No group found" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

grouproute.post("/createGroup", async (req, res) => {
  try {
    const { name, description, members, createdBy } = req.body;
    members.push(createdBy);
    const newGroup = new groupSchema({
      name,
      description,
      members,
      createdBy: createdBy,
      createdAt: new Date(),
    });
    await newGroup.save();
    res
      .status(201)
      .send({ message: "group created successfully", data: newGroup });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

export default grouproute;
