import multer from "multer";
import fs from "fs";

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
 });

export var upload = multer({ storage: storage }).single("img");