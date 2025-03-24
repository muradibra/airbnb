"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const user_1 = __importDefault(require("../controllers/user"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const user_2 = require("../validation/user");
const uploadAvatar_1 = require("../middlewares/uploadAvatar");
const router = (0, express_1.Router)();
router.get("/all", (0, auth_1.authorize)({ isAdmin: true }), user_1.default.getAll);
router.delete("/:id", (0, auth_1.authorize)({ isAdmin: true }), user_1.default.remove);
router.put("/", (0, auth_1.authorize)({}), uploadAvatar_1.uploadAvatar.single("avatar"), (0, validate_1.default)(user_2.editUserSchema), user_1.default.update);
exports.default = router;
