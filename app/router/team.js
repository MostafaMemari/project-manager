const { TeamController } = require("../http/controllers/team.controller");
const { checkLogin } = require("../http/middlewares/autoLogin");
const { expressValidatorMapper } = require("../http/middlewares/checkErrors");
const { createTeamValidator } = require("../http/validations/team");

const router = require("express").Router();

router.post("/create", checkLogin, createTeamValidator(), expressValidatorMapper, TeamController.createTeam);
router.get("/", checkLogin, TeamController.getListOfTeams);

module.exports = {
  teamRoutes: router,
};
