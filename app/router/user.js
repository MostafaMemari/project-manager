const { UserController } = require("../http/controllers/user.controller");
const { checkLogin } = require("../http/middlewares/autoLogin");

const router = require("express").Router();

router.route("/profile").get(checkLogin, UserController.getProfile).post(checkLogin, UserController.editProfile);

module.exports = {
  userRoutes: router,
};
