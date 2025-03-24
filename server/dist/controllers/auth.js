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
const crypto_1 = __importDefault(require("crypto"));
const user_1 = __importDefault(require("../mongoose/schemas/user"));
const bcrypt_1 = require("../utils/bcrypt");
const mail_1 = require("../utils/mail");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, phoneNumber } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: "Please fill in all fields!" });
            return;
        }
        const alreadyExists = yield user_1.default.findOne({
            $or: [{ email }, { phoneNumber }],
        });
        if (alreadyExists) {
            res.status(400).json({
                message: "User with this email or phone number already exists",
            });
            return;
        }
        const user = new user_1.default({
            email,
            password: (0, bcrypt_1.hashPassword)(password),
            name,
            phoneNumber,
        });
        yield user.save();
        res.send({ message: "User registered successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.send({ message: "User logged in successfully.", user });
});
const currentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user === null || user === void 0 ? void 0 : user.avatar)
        user.avatar = `${process.env.BASE_URL}/${user.avatar}`;
    res.json({ user });
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.logout(function (err) {
        if (err) {
            res.status(500).json({ message: "Internal server error!" });
        }
        res.send({ message: "User logged out successfully." });
    });
});
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found!" });
            return;
        }
        const token = crypto_1.default.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordTokenExpires = new Date(Date.now() + 1000 * 60 * 15);
        yield user.save();
        yield mail_1.transporter.sendMail({
            from: '"Passport Auth 👻" <muradni@code.edu.az>',
            to: email,
            subject: "Reset Your Password",
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              overflow: hidden;
            }
            .email-header {
              background-color: #007bff;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 24px;
            }
            .email-body {
              padding: 20px;
              color: #333333;
            }
            .email-body p {
              line-height: 1.6;
            }
            .reset-button {
              display: inline-block;
              margin: 20px auto;
              padding: 10px 20px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              text-align: center;
            }
            .email-footer {
              padding: 10px;
              text-align: center;
              font-size: 12px;
              color: #777777;
              background-color: #f4f4f4;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              Reset Your Password
            </div>
            <div class="email-body">
              <p>Hello, ${user.name}.</p>
              <p>We received a request to reset your password. Please click the button below to reset your password:</p>
              <a href="${process.env.CLIENT_URL}/reset-password/${token}" class="reset-button">
                Reset Password
              </a>
              <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
              <p>Thank you,<br>Passport Auth Team</p>
            </div>
            <div class="email-footer">
              &copy; 2024 Passport Auth. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `,
        });
        res.json({ message: "Password reset email sent successfully." });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        const user = yield user_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpires: { $gt: Date.now() },
        });
        if (!user) {
            res.status(400).json({ message: "Invalid or expired token!" });
            return;
        }
        user.password = (0, bcrypt_1.hashPassword)(password);
        user.resetPasswordToken = "";
        user.resetPasswordTokenExpires = new Date(0);
        yield user.save();
        res.json({ message: "Password reset succesfully." });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error!" });
    }
});
const authController = {
    register,
    login,
    currentUser,
    logout,
    forgotPassword,
    resetPassword,
};
exports.default = authController;
