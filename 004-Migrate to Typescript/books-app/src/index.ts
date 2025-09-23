import * as express from "express";
import * as path from "path";
import * as methodOverride from "method-override";
import * as session from "express-session";
import * as passport from "passport";
import { createServer } from "http";
import {Server} from 'socket.io';
import errorMiddleware from "./middlewares/errors";


import config from "./config/index";
import router from "./routers/index";
import connectToMongoDb from "./db/connection";
import initChatHandlers from "./server/communication";

const app = express();

app.use(session(config.auth.session));
app.use(passport.initialize());
app.use(passport.session());

const server = createServer(app);
const io = new Server(server);


app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);


app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

app.use(errorMiddleware);

initChatHandlers(io);

async function start(port, mongoUrl) {
  try {
    await connectToMongoDb(mongoUrl);
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start(config.server.port, config.mongo.url);