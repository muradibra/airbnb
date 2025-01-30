import { v4 as uuidv4 } from "uuid";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/bnb/");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    const uniqueSuffix = uuidv4() + "." + fileExtension;
    const fileName = "bnb-" + uniqueSuffix;
    cb(null, fileName);
  },
});

export const uploadBnb = multer({ storage: storage });
