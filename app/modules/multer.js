const multer = require("multer");
const { createUploadPath } = require("./function");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, createUploadPath());
  },
  filename: (req, file, cd) => {
    const ext = path.extname(file?.originalname || "");

    const exts = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
    if (exts.includes(ext)) {
      cd(null, Date.now() + ext);
    } else {
      cd(new Error("فرمت وارد شده صحیح نمی باشد"));
    }
  },
});

const _2MB = 2 * 1024 * 1024;
const uploadMulter = multer({
  storage,
  limits: {
    fileSize: _2MB,
  },
});

module.exports = {
  uploadMulter,
};
