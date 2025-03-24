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
exports.authenticate = exports.authorize = void 0;
const passport_1 = __importDefault(require("passport"));
const user_1 = require("../types/user");
const authorize = (options) => {
    const isAdmin = !!(options === null || options === void 0 ? void 0 : options.isAdmin);
    const isHost = !!(options === null || options === void 0 ? void 0 : options.isHost);
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            if (!req.isAuthenticated()) {
                res.status(401).json({ message: "Unauthorized!" });
                return;
            }
            if (isAdmin && ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== user_1.UserRole.ADMIN) {
                res.status(403).json({ message: "Forbidden!" });
                return;
            }
            if (isHost && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== user_1.UserRole.HOST) {
                res.status(403).json({ message: "Forbidden!" });
                return;
            }
            next();
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error!" });
        }
    });
};
exports.authorize = authorize;
const authenticate = (req, res, next) => passport_1.default.authenticate("local", function (err, user, info) {
    if (err) {
        res.status(500).json({ message: "Internal server error!" });
        return;
    }
    if ((info === null || info === void 0 ? void 0 : info.message) || !user) {
        res.status(401).json({ message: (info === null || info === void 0 ? void 0 : info.message) || "Unauthorized!" });
        return;
    }
    req.login(user, function (err) {
        if (err) {
            res.status(500).json({ message: "Internal server error!" });
            return;
        }
        next();
    });
})(req, res, next);
exports.authenticate = authenticate;
