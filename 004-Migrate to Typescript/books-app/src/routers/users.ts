import * as express from "express";
import * as passport from "passport";
import * as LocalStrategy from "passport-local";

import myContainer from "../containers/container";
import UsersRepository from "../repositories/users.repository";
import User from "../interfaces/user.interface";

const repo = myContainer.get(UsersRepository);

const router = express.Router();

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

    const existingUser = await repo.getUserByUsername(username);
    
    if (existingUser) {
      return res.redirect("/api/users/signup");
    }

  const newUser = {
    username,
    password
  } as User;

  try {
    await repo.createUser(newUser);
    res.status(200).redirect("/api/users/");
  } catch (error) {
    res.status(404).redirect("/api/errors/404/");
  }
});

export default router;
