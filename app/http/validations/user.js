const { body } = require("express-validator");
const path = require("path");

function imageValidator() {
  return [
    body("image").custom((value, ctx) => {
      // if (Object.keys(ctx.req.file).length == 0) throw "لطفا یک تصویر را انتخاب کنید";
      const ext = path.extname(ctx.req.file.originalname);
      const exts = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
      if (!exts.includes(ext)) throw "فرمت ارسال شده صحیح نمی باشد";

      const maxSize = 2 * 1024 * 1024;
      if (ctx.req.file.size > maxSize) throw "حجم فایل نمی تواند بیشتر از 2 مگابایت باشد";

      return true;
    }),
  ];
}

module.exports = {
  imageValidator,
};
