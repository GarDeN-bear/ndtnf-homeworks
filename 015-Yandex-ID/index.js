const express = require("express");
const passport = require("passport");
const YandexStrategy = require("passport-yandex").Strategy;

const YANDEX_CLIENT_ID = "b14886d0b6a84b7aab617ed1a35b4e87";
const YANDEX_CLIENT_SECRET = "18a8781151e84821a86aa6baa64f48ba";

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new YandexStrategy(
    {
      clientID: YANDEX_CLIENT_ID,
      clientSecret: YANDEX_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/yandex/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        return done(null, profile);
      });
    }
  )
);

const characters = [
  {
    id: 1,
    name: "Человек-паук",
    description: "Питер Паркер",
    modified: "2020-07-21",
    thumbnail: "http://example.com/spider-man.jpg",
    comics: [{ id: 1, name: "Spider-Man #1" }],
  },
  {
    id: 2,
    name: "Железный человек",
    description: "Тони Старк",
    modified: "2020-06-15",
    thumbnail: "http://example.com/iron-man.jpg",
    comics: [{ id: 2, name: "Iron Man #1" }],
  },
];

const app = express();
app.use(require("cookie-parser")());
app.use(
  require("express-session")({
    secret: process.env.COOKIE_SECRET || "COOKIE_SECRET",
  })
);

app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get("/api/auth/yandex", passport.authenticate("yandex"));

app.get(
  "/api/auth/yandex/callback",
  passport.authenticate("yandex", { failureRedirect: "/api/" }),
  (req, res) => {
    res.redirect("/api/");
  }
);

app.get("/api/characters", isAuthenticated, (req, res) => {
  try {
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch characters" });
  }
});

app.get("/api/character", isAuthenticated, (req, res) => {
  try {
    const { id } = req.query;

    const character = characters.find((char) => char.id === parseInt(id));

    if (!character) {
      return res.status(404).json({ error: "Character not found" });
    }

    res.json(character);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch character" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server start http://localhost:${PORT}/api/`);
});
