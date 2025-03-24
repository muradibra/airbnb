"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_1 = __importDefault(require("../controllers/review"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/", review_1.default.getAll);
router.post("/", (0, auth_1.authorize)(), review_1.default.create);
router.put("/:id", (0, auth_1.authorize)(), review_1.default.update);
router.delete("/:id", (0, auth_1.authorize)(), review_1.default.remove);
exports.default = router;
