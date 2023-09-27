const { body } = require("express-validator");
const { userModel } = require("../../models/users");

function registerValidator() {
  return [
    body("username").custom(async (value, ctx) => {
      if (value) {
        const userNameRegex = /^[a-z]+[a-z0-9\_\.]{2,}/gi;
        if (userNameRegex.test(value)) {
          const user = await userModel.findOne({ username: value });
          if (user) throw "نام کاربری تکراری می باشد";
          return true;
        }
        throw "نام کاربری صحیح نمی باشد";
      }
      throw "نام کاربری نمیتواند خالی باشد";
    }),
    body("email")
      .isEmail()
      .withMessage("ایمیل وارد شده صحیح نمی باشد")
      .custom(async (email) => {
        const user = await userModel.findOne({ email });
        if (user) throw "ایمیل وارد شده قبلا استفاده شده است";
        return true;
      }),
    body("mobile")
      .isMobilePhone("fa-IR")
      .withMessage("شماره موبایل وارد شده صحیح نمی باشد")
      .custom(async (mobile) => {
        const user = await userModel.findOne({ mobile });
        if (user) throw "شماره موبایل وارد شده قبلا استفاده شده است";
        return true;
      }),
    body("password")
      .isLength({ min: 6, max: 16 })
      .withMessage("رمز عبور حداقل باید 6 و حداکثر 16 نویسه باشد")
      .custom((value, ctx) => {
        if (!value) throw "رمز عبور نمیتواند خالی باشد";
        if (value !== ctx?.req?.body?.confirm_password) throw "رمز عبور با تکرار آن یکسان نمی باشد";
        return true;
      }),
  ];
}

module.exports = {
  registerValidator,
};
