import multer from "multer";
import path from "path";

export default multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 1000000, // 1mb
  },
  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return cb(new Error("file type is not supported"));
    }

    const fileSize = file.size;
    if (fileSize > 1000000) {
      return cb(new Error("file max 1 mb"));
    }
    cb(null, true);
  },
});
