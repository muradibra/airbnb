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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_1 = __importDefault(require("../mongoose/schemas/user"));
const bcrypt_1 = require("../utils/bcrypt");
passport_1.default.serializeUser(function (user, done) {
    done(null, user._id);
});
passport_1.default.deserializeUser(function (id, done) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            const user = yield user_1.default.findById(id).select("-password -__v -resetPasswordToken -resetPasswordTokenExpires");
            if (!user) {
                return done(null, false);
            }
            done(null, Object.assign(Object.assign({}, ((_a = user.toObject()) !== null && _a !== void 0 ? _a : {})), { _id: user._id.toString(), role: user.role, wishlist: Array.isArray(user.wishlist)
                    ? user.wishlist.map((wish) => wish.toString())
                    : [], resetPasswordToken: (_b = user.resetPasswordToken) !== null && _b !== void 0 ? _b : undefined, resetPasswordTokenExpires: (_c = user.resetPasswordTokenExpires) === null || _c === void 0 ? void 0 : _c.toString(), createdAt: (_d = user.createdAt) === null || _d === void 0 ? void 0 : _d.toString(), updatedAt: (_e = user.updatedAt) === null || _e === void 0 ? void 0 : _e.toString() }));
        }
        catch (error) {
            done(error);
        }
    });
});
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
}, function (email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const user = yield user_1.default.findOne({ email });
            if (!user) {
                return done(null, false, { message: "Invalid Credentials!" });
            }
            if (!(0, bcrypt_1.comparePassword)(password, user.password)) {
                return done(null, false, { message: "Invalid Credentials!" });
            }
            return done(null, Object.assign(Object.assign({}, ((_a = user.toObject()) !== null && _a !== void 0 ? _a : {})), { _id: user._id.toString(), role: user.role, wishlist: Array.isArray(user.wishlist)
                    ? user.wishlist.map((wish) => wish.toString())
                    : [], password: undefined, resetPasswordToken: undefined, resetPasswordTokenExpires: undefined, createdAt: (_b = user.createdAt) === null || _b === void 0 ? void 0 : _b.toString(), updatedAt: (_c = user.updatedAt) === null || _c === void 0 ? void 0 : _c.toString() }));
        }
        catch (error) {
            done(error);
        }
    });
}));
