const { teamModel } = require("../../models/team");

class TeamController {
  async createTeam(req, res, next) {
    try {
      const { name, description, username } = req.body;
      const owner = req.user._id;
      const team = await teamModel.create({
        name,
        description,
        owner,
        username,
      });
      if (!team) throw { status: 500, message: "ایجاد تیم با مشکلی مواجه شد" };
      return res.status(201).json({
        status: 201,
        success: true,
        message: "ایجاد تیم با موفقیت انجام شد",
      });
    } catch (error) {}
  }
  async getListOfTeams(req, res) {
    try {
      const teams = await teamModel.find({});
      return res.status(200).json({
        status: 200,
        success: true,
        teams,
      });
    } catch (error) {}
  }
  inviteUserToTeam() {}
  removeTeamById() {}
  updateTeam() {}
  removeUserFromTeam() {}
}
module.exports = {
  TeamController: new TeamController(),
};
