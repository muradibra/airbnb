"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_1 = __importDefault(require("../controllers/category"));
const auth_1 = require("../middlewares/auth");
const category_2 = require("../validation/category");
const uploadCategoryIcon_1 = require("../middlewares/uploadCategoryIcon");
const validate_1 = __importDefault(require("../middlewares/validate"));
const router = (0, express_1.Router)();
router.get("/all", category_1.default.getAll);
router.post("/create", (0, auth_1.authorize)({ isAdmin: true }), uploadCategoryIcon_1.uploadCategory.single("icon"), (0, validate_1.default)(category_2.createCategoryValidation), category_1.default.create);
router.get("/:id", (0, auth_1.authorize)({ isAdmin: true }), category_1.default.getById);
router.put("/:id", (0, auth_1.authorize)({ isAdmin: true }), uploadCategoryIcon_1.uploadCategory.single("icon"), (0, validate_1.default)(category_2.editCategoryValidation), category_1.default.update);
router.delete("/:id", (0, auth_1.authorize)({ isAdmin: true }), category_1.default.remove);
exports.default = router;
