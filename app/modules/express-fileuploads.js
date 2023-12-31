const fileUpload = require("express-fileupload");
const path = require("path");
const { createUploadPath } = require("./function");
const uploadFile = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) throw { status: 400, message: "تصویر شاخص پروژه را ارسال نمایید" };
    let image = req.files.image;
    const imagePath = path.join(createUploadPath(), Date.now() + path.extname(image.name));
    req.body.image = imagePath;
    let uploadPath = path.join(__dirname, "..", "..", imagePath);
    await image.mv(uploadPath, (err) => {
      if (err) throw { status: 500, message: "بارگزاری تصویر انجام نشد" };
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile,
};
