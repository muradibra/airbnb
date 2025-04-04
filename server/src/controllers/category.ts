import { Request, Response } from "express";
import Category from "../mongoose/schemas/category";
import Listing from "../mongoose/schemas/listing";

const getAll = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();

    const transformedCategories = categories.map((category) => ({
      _id: category._id,
      name: category.name,
      description: category.description,
      icon: `${process.env.BASE_URL}/${category.icon}`,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
    // console.log(transformedCategories);

    res.status(200).json({
      message: "Get all categories",
      items: transformedCategories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    category.icon = `${process.env.BASE_URL}/${category.icon}`;

    res.status(200).json({ message: "Category fetched", item: category });
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
    const { id } = req.params;

    const hasListing = await Listing.find({
      category: id,
    });

    if (hasListing.length > 0) {
      res.status(400).json({ message: "Category has listings" });
      return;
    }

    const category = await Category.findByIdAndDelete(id);

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
  getById,
  create,
  update,
  remove,
};

export default categoryController;
