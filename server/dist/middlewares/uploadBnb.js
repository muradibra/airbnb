"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBnb = void 0;
const uuid_1 = require("uuid");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/bnb/");
    },
    filename: function (req, file, cb) {
        const fileExtension = file.originalname.split(".").pop();
        const uniqueSuffix = (0, uuid_1.v4)() + "." + fileExtension;
        const fileName = "bnb-" + uniqueSuffix;
        cb(null, fileName);
    },
});
exports.uploadBnb = (0, multer_1.default)({ storage: storage });
