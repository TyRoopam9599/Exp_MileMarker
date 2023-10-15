import express from "express";
import { userModel } from "../models/UserModel.js";

export const editProfile = async (req, res, next) => {
  try {
    const userProfile = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!userProfile) {
      return res.status(404).json({ error: "Travel record not found" });
    }
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
