import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import express from "express";
import * as yup from "yup";

const authRouter = express.Router();

// Validation schemas using Yup
const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

// Register route
authRouter.post("/register", async (req, res) => {
  try {
    await registerSchema.validate(req.body, { abortEarly: false });

    const { username, email, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Raw password:", password);
    console.log("Hashed password:", hashedPassword);
    console.log(password);

    // Check if the email already exists
    const previousUser = await User.findOne({ email });
    if (previousUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    console.log("Hashed password:", hashedPassword);

    // Create a new user
    const user = new User({
      username,
      email,
      password,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ error: err.message });
  }
});

// Login route
authRouter.post("/login", async (req, res) => {
  try {
    // Validate the input data
    await loginSchema.validate(req.body, { abortEarly: false });

    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      "your_jwt_secret", // Replace with a strong secret key in production
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful!", token });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ error: err.message });
  }
});

export default authRouter;
