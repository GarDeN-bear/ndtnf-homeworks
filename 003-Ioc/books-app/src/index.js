import express from "express";
import mongoose from "mongoose";
import path from "path";
import { createServer } from "http";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";
import {Server} from 'socket.io';
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

import errorMiddleware from "./middlewares/errors.js";
import users from "./routes/users.js";
import books from "./routes/books.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const pubClient = createClient({ url: "redis://redis:6379" });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  console.log("Redis адаптер подключен");
});

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({ secret: "SECRET" }));
app.use(passport.initialize());
app.use(passport.session());

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

app.use("/api/users", users);
app.use("/api/books", books);
app.use(errorMiddleware);

io.on('connection', (socket) => {
    const {id} = socket;
    console.log(`Socket connected: ${id}`);

    socket.on('message-to-me', (msg) => {
        msg.type = 'me';
        socket.emit('message-to-me', msg);
    });

    socket.on('message-to-all', (msg) => {
        msg.type = 'all';
        io.emit('message-to-all', msg);
    });

    const {roomName} = socket.handshake.query;
    console.log(`Socket roomName: ${roomName}`);
    socket.join(roomName);
    socket.on('message-to-room', (msg) => {
        msg.type = `room: ${roomName}`;
        io.to(roomName).emit('message-to-room', msg);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${id}`);
    });
});

async function startMongoDb(port, url) {
  try {
    await mongoose.connect(url);
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
}

const port = process.env.PORT || 3000;
startMongoDb(port, process.env.ME_CONFIG_MONGODB_URL);
