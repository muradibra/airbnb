import { Request, Response } from "express";
import User from "../mongoose/schemas/user";
import { UserRole } from "../types/user";

const makeHost = async (req: Request, res: Response) => {
  try {
    const id = req.user?._id;

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { role: UserRole.HOST },
      { new: true }
    );

    res.status(200).json({
      message: "Congratulations! You are now a host",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const roleController = {
  makeHost,
};

export default roleController;
