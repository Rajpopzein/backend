import express from "express";
import authRouter from "./auth.js";
import messageRouter from "./message.js";
import userRouter from "./useRoute.js";
import group from "./group.js";

const indxeRoute = express.Router();

indxeRoute.use("/message", messageRouter);
indxeRoute.use("/auth", authRouter);
indxeRoute.use("/user", userRouter);
indxeRoute.use("/group", group);

export default indxeRoute;
