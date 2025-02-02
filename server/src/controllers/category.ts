import { Request, Response } from "express";
import Category from "../mongoose/schemas/category";

const getAll = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ message: "Get all categories", items: categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.matchedData;
    let iconPath;
    if (req.file) {
      iconPath = req.file.path.replace(/\\/g, "/");
    }

    if (!name) {
      res.status(400).json({ message: "Name is required" });
      return;
    }

    if (!iconPath) {
      res.status(400).json({ message: "Icon is required" });
      return;
    }
    const isCategoryExists = await Category.findOne({ name });

    if (isCategoryExists) {
      res.status(400).json({ message: "Category already exists" });
      return;
    }

    const category = await Category.create({
      name,
      description: description || "",
      icon: iconPath,
    });

    res.status(200).json({ message: "Category created", item: category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.matchedData;
    let iconPath;
    if (req.file) {
      iconPath = req.file.path.replace(/\\/g, "/");
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    if (name) {
      category.name = name;
    }

    if (description) {
      category.description = description;
    }

    if (iconPath) {
      category.icon = iconPath;
    }

    await category.save();

    res.status(200).json({ message: "Category updated", item: category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json({ message: "Category removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const categoryController = {
  getAll,
  create,
  update,
  remove,
};

export default categoryController;
