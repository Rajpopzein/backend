import express from "express";
import authRouter from "./auth.js";
import messageRouter from "./message.js";
import userRouter from "./useRoute.js";

const indxeRoute = express.Router();

indxeRoute.use("/message", messageRouter);
indxeRoute.use("/auth", authRouter);
indxeRoute.use("/user", userRouter);

export default indxeRoute;
