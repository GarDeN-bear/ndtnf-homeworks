import * as multer from "multer";
import * as path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, "../public"));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()} - ${file.originalname}`);
  },
});

const uploader = multer({ storage });

export default uploader;
