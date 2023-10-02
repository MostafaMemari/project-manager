const { TeamController } = require("../http/controllers/team.controller");
const { checkLogin } = require("../http/middlewares/autoLogin");
const { expressValidatorMapper } = require("../http/middlewares/checkErrors");
const { mongoIDValidator } = require("../http/validations/public");
const { createTeamValidator } = require("../http/validations/team");

const router = require("express").Router();

router.post("/create", checkLogin, createTeamValidator(), expressValidatorMapper, TeamController.createTeam);
router.get("/list", checkLogin, TeamController.getListOfTeams);
router.get("/me", checkLogin, TeamController.getMyTeams);
router.get("/invite/:teamID/:username", checkLogin, TeamController.inviteUserToTeam);
router.put("/update/:teamID", checkLogin, TeamController.updateTeam);
router.get("/:id", checkLogin, mongoIDValidator(), expressValidatorMapper, TeamController.getTeamByID);
router.delete("/remove/:id", checkLogin, mongoIDValidator(), expressValidatorMapper, TeamController.removeTeamById);

module.exports = {
  teamRoutes: router,
};
