"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const role_1 = __importDefault(require("../controllers/role"));
const router = (0, express_1.Router)();
router.patch("/", (0, auth_1.authorize)({}), role_1.default.makeHost);
exports.default = router;
