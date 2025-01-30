import { Request, Response } from "express";
import Category from "../mongoose/schemas/category";

const getAll = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    console.log("------categories------", categories);

    res.status(200).json({ message: "Get all categories" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.matchedData;

    // console.log("------name------", name);
    console.log("------description------", description);

    console.log("-----icon-------", req.file);

    res.status(200).json({ message: "Create category" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const categoryController = {
  getAll,
  create,
};

export default categoryController;
