"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
require("./config/db");
require("./config/auth-strategy");
const auth_1 = __importDefault(require("./routes/auth"));
const category_1 = __importDefault(require("./routes/category"));
const listing_1 = __importDefault(require("./routes/listing"));
const role_1 = __importDefault(require("./routes/role"));
const review_1 = __importDefault(require("./routes/review"));
const wishlist_1 = __importDefault(require("./routes/wishlist"));
const user_1 = __importDefault(require("./routes/user"));
const calendar_1 = __importDefault(require("./routes/calendar"));
const booking_1 = __importDefault(require("./routes/booking"));
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/public", express_1.default.static("./public"));
app.use("/auth", auth_1.default);
app.use("/category", category_1.default);
app.use("/listing", listing_1.default);
app.use("/change-role", role_1.default);
app.use("/review", review_1.default);
app.use("/wishlist", wishlist_1.default);
app.use("/user", user_1.default);
app.use("/calendar", calendar_1.default);
app.use("/booking", booking_1.default);
app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});
