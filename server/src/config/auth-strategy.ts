import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../mongoose/schemas/user";
import { comparePassword } from "../utils/bcrypt";
import { IUser, UserRole } from "../types/user";

passport.serializeUser(function (user: IUser, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id).select(
      "-password -__v -resetPasswordToken -resetPasswordTokenExpires"
    );
    if (!user) {
      return done(null, false);
    }
    done(null, {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role as UserRole,
      phoneNumber: user.phoneNumber,
      wishlist: Array.isArray(user.wishlist)
        ? user.wishlist.map((wish: any) => wish.toString())
        : [],
      resetPasswordTokenExpires: user.resetPasswordTokenExpires?.toString(),
      createdAt: user.createdAt?.toString(),
      updatedAt: user.updatedAt?.toString(),
    });
  } catch (error) {
    done(error);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email: string, password: string, done) {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "Invalid Credentials!" });
        }

        if (!comparePassword(password, user.password as string)) {
          return done(null, false, { message: "Invalid Credentials!" });
        }

        return done(null, {
          ...(user.toObject() ?? {}),
          _id: user._id.toString(),
          role: user.role as UserRole,
          wishlist: Array.isArray(user.wishlist)
            ? user.wishlist.map((wish: any) => wish.toString())
            : [],
          password: undefined,
          resetPasswordToken: undefined,
          resetPasswordTokenExpires: undefined,

          createdAt: user.createdAt?.toString(),
          updatedAt: user.updatedAt?.toString(),
        });
      } catch (error) {
        done(error);
      }
    }
  )
);
