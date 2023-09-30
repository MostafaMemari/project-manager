const { ProjectController } = require("../http/controllers/project.controller");
const { createProjectValidator } = require("../http/validations/project");
const { expressValidatorMapper } = require("../http/middlewares/checkErrors");
const { checkLogin } = require("../http/middlewares/autoLogin");

const router = require("express").Router();

router.post("/create", checkLogin, createProjectValidator(), expressValidatorMapper, ProjectController.createProject);

module.exports = {
  projectRoutes: router,
};
