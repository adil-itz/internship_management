import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, "../../.env") });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "placeholder_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_client_secret",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || null;

        if (!email) {
          return done(
            new Error("Google account does not provide an email."),
            null,
          );
        }

        const avatar = profile.photos?.[0]?.value || "";

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email,
            avatar,
            role: "student",
            isVerified: true,
            approvalStatus: "approved",
          });
        } else {
          if (user.isBlocked) {
            return done(new Error("Your account is blocked."), null);
          }

          user.googleId = profile.id;
          user.name = profile.displayName;
          user.avatar = avatar;
          user.isVerified = true;

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");

    if (user?.isBlocked) {
      return done(new Error("Your account is blocked."), null);
    }

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
