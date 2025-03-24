"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = __importDefault(require("../mongoose/schemas/category"));
const listing_1 = __importDefault(require("../mongoose/schemas/listing"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_1.default.find();
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_1.default.findById(req.params.id);
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        category.icon = `${process.env.BASE_URL}/${category.icon}`;
        res.status(200).json({ message: "Category fetched", item: category });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const isCategoryExists = yield category_1.default.findOne({ name });
        if (isCategoryExists) {
            res.status(400).json({ message: "Category already exists" });
            return;
        }
        const category = yield category_1.default.create({
            name,
            description: description || "",
            icon: iconPath,
        });
        res.status(200).json({ message: "Category created", item: category });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.matchedData;
        let iconPath;
        if (req.file) {
            iconPath = req.file.path.replace(/\\/g, "/");
        }
        const category = yield category_1.default.findById(req.params.id);
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
        yield category.save();
        res.status(200).json({ message: "Category updated", item: category });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const hasListing = yield listing_1.default.find({
            category: id,
        });
        if (hasListing.length > 0) {
            res.status(400).json({ message: "Category has listings" });
            return;
        }
        const category = yield category_1.default.findByIdAndDelete(id);
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        res.status(200).json({ message: "Category removed" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const categoryController = {
    getAll,
    getById,
    create,
    update,
    remove,
};
exports.default = categoryController;
