import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import cors from "cors";

import "./config/db";
import "./config/auth-strategy";

import authRoutes from "./routes/auth";
import categoryRoutes from "./routes/category";

const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/public", express.static("./public"));
app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
