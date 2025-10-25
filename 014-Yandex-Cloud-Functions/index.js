const express = require("express");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

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

app.get("/api/characters", (req, res) => {
  try {
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch characters" });
  }
});

app.get("/api/character", (req, res) => {
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

module.exports.handler = serverless(app);
