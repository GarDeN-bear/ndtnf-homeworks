import * as express from "express";

import books from "./books";
import users from "./users";

const router = express.Router();

router.use("/api/books", books);
router.use("/api/users", users);

export default router;
