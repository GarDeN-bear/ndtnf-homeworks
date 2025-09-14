import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";

import User from "../db/users.js"

const router = express.Router();

const verify = async (username, password, done) => {
  try {
    const user = await User.findOne({username});
    if (!user) {
      return done(null, false);
    }
    if (!user.verifyPassword(password)) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
      return done(error);
  }
};

const options = {
  usernameField: "username",
  passwordField: "password",
};

passport.use("local", new LocalStrategy(options, verify));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id).select("-__v");
    cb(null, user);
  } catch (error) {
      return cb(err);
  }
  }
);

router.get("/", async (req, res) => {
  res.status(200).render("users/home", { title: "Home", user: req.user });
});

router.get("/login", (req, res) => {
  res.status(200).render("users/login", { title: "Login", user: req.user });
});

router.get("/signup", (req, res) => {
  res.status(200).render("users/signup", { title: "Signup", user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/api/users/");
  });
});

router.post(
  "/login",
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect("/api/users/login");
    }
    next();
  },
  passport.authenticate("local", { failureRedirect: "/api/users/login" }),
  (req, res) => {
    res.redirect("/api/users/");
  }
);

router.get(
  "/me",
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect("/api/users/login");
    }
    next();
  },
  (req, res) => {
    res.status(200).render("users/profile", { title: "Profile", user: req.user });
  }
);

router.post("/signup", async (req, res) => {
  const { username, password } =
    req.body;

    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return res.redirect("/api/users/signup");
    }

  const newUser = new User({
    username,
    password,
  });

  try {
    await newUser.save();
    res.status(200).redirect("/api/users/");
  } catch (error) {
    res.status(404).redirect("/api/errors/404/");
  }
});

export default router;
