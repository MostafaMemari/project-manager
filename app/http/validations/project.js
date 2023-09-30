const { body } = require("express-validator");

function createProjectValidator() {
  return [
    body("title").notEmpty().withMessage("عنوان پروژه نمیتواند خالی باشد"),
    body("tags").isArray({ min: 0, max: 10 }).withMessage("حداکثر استفاده از هشتک ها 10 عدد می باشد "),
    body("text").notEmpty().isLength({ min: 20 }).withMessage("توضیحات نویسه نمیتواند خالی باشد و حداقل باید 25 کاراکتر باشد"),
  ];
}

module.exports = {
  createProjectValidator,
};
