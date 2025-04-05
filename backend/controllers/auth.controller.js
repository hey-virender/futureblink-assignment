import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ success: false, error: "All fields are required" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .send({ success: false, error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res
      .status(201)
      .send({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, error: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ success: false, error: "User not found" });
    }
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      return res
        .status(401)
        .send({ success: false, error: "Invalid Credentials" });
    }
    const token = generateToken(user._id);
    res.cookie("token", token, { httpOnly: true });
    return res.status(200).send({
      success: true,
      message: "Login Successful",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).send({ success: true, message: "Logout successful" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, error: "Internal Server Error" });
  }
};