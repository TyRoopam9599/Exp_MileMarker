import bcrypt from "bcryptjs";
import { userModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const resgiterUser = async (req, res, next) => {
  try {
    const existingUser = await userModel.findOne({
      email: req.body.email,
      username: req.body.username,
    });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;

    const newUser = new userModel(req.body);
    await newUser.save();
    res
      .status(201)
      .send({ message: "User register Successfully", success: true });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ username: req.body.username });
    if (!user) {
      res.status(400).send({ message: "User not found", status: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    res
      .status(500)
      .send({ message: `Error in Login Controller ${error.message}` });
  }
};

export const authController = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: {
          username: user.username,
          email: user.email,
        },
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Auth Error",
      success: false.error,
    });
  }
};
