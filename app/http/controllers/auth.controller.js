const { validationResult } = require("express-validator");
const { hashString } = require("../../modules/function");
const { userModel } = require("../../models/users");

class AuthController {
  async register(req, res, next) {
    try {
      const { username, password, email, mobile } = req.body;
      const hash_password = hashString(password);
      const user = await userModel
        .create({
          username,
          email,
          password: hash_password,
          mobile,
        })
        .catch((err) => {
          if (err?.code == 11000) {
            throw { status: 400, message: "نام کاربری قبلا در سیستم استفاده شده است" };
          }
        });
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }
  login() {}
  resetPassword() {}
}

module.exports = {
  AuthController: new AuthController(),
};
