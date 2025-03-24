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
const user_1 = __importDefault(require("../mongoose/schemas/user"));
const user_2 = require("../types/user");
const file_1 = require("../utils/file");
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find();
        const usersAdminExcluded = users
            .filter((user) => user.role !== user_2.UserRole.ADMIN)
            .map((u) => {
            u.avatar = `http://localhost:3000/${u.avatar}`;
            return u;
        });
        res.status(200).json({
            message: "Users fetched",
            users: usersAdminExcluded,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching users" });
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield user_1.default.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // TODO: user passwod should only be updated with forgot password. This is only temporary.
        const { avatar, name, password } = req.matchedData;
        if (name)
            user.name = name;
        if (password)
            user.password = password;
        if (avatar === "delete") {
            if (user.avatar !== "public/avatar/default-avatar.jpg") {
                (0, file_1.moveToDeleted)([user.avatar]);
            }
            user.avatar = "public/avatar/default-avatar.jpg";
        }
        if (req.file) {
            user.avatar = req.file.path.replace("\\", "/");
        }
        yield user.save();
        res.status(200).json({
            message: "User updated",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating user" });
    }
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield user_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting user" });
    }
});
const userController = {
    getAll,
    update,
    remove,
};
exports.default = userController;
