import User from "../mongoose/schemas/user";

import { Request, Response } from "express";
import { UserRole } from "../types/user";

import { moveToDeleted } from "../utils/file";

const getAll = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    const usersAdminExcluded = users
      .filter((user) => user.role !== UserRole.ADMIN)
      .map((u) => {
        u.avatar = `http://localhost:3000/${u.avatar}`;
        return u;
      });

    res.status(200).json({
      message: "Users fetched",
      users: usersAdminExcluded,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.user?._id;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // TODO: user passwod should only be updated with forgot password. This is only temporary.
    const { avatar, name, password } = req.matchedData;

    if (name) user.name = name;
    if (password) user.password = password;
    if (avatar === "delete") {
      if (user.avatar !== "public/avatar/default-avatar.jpg") {
        moveToDeleted([user.avatar]);
      }
      user.avatar = "public/avatar/default-avatar.jpg";
    }

    if (req.file) {
      user.avatar = req.file.path.replace("\\", "/");
    }

    await user.save();

    res.status(200).json({
      message: "User updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

const userController = {
  getAll,
  update,
  remove,
};

export default userController;
