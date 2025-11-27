/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";

import { Strategy as LocalStrategy } from "passport-local";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/usre.interface";
import bcryptjs from "bcryptjs";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done("User dos not exist");
        }
        const isGoogleAuthenticated = user.auths?.some(
          (providerObject) => providerObject.provider === "google"
        );
        if (isGoogleAuthenticated) {
          return done(null, false, {
            message:
              "You signed up using Google authentication, so you cannot log in with credentials. If you want to log in using email and password, please set a password first.",
          });
        }
        const isPasswrdMatch = await bcryptjs.compare(
          password,
          user.password as string
        );
        if (!isPasswrdMatch) {
          return done("Password dose not match");
        }
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile?.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No email found" });
        }
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, user);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    done(error);
  }
});
