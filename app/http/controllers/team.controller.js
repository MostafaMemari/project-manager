const autoBind = require("auto-bind");
const { teamModel } = require("../../models/team");
const { userModel } = require("../../models/users");

class TeamController {
  constructor() {
    autoBind(this);
  }
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
    } catch (error) {
      next(error);
    }
  }
  async getListOfTeams(req, res, next) {
    try {
      const teams = await teamModel.find({});
      return res.status(200).json({
        status: 200,
        success: true,
        teams,
      });
    } catch (error) {}
  }
  async getTeamByID(req, res, next) {
    try {
      const teamID = req.params.id;
      const team = await teamModel.findOne({ _id: teamID });
      if (!team) throw { status: 404, message: "تیمی یافت نشد" };
      return res.status(200).json({
        status: 200,
        success: true,
        team,
      });
    } catch (error) {
      next(error);
    }
  }
  async getMyTeams(req, res, next) {
    try {
      const userID = req.user._id;

      const teams = await teamModel.aggregate([
        {
          $match: {
            $or: [{ owner: userID }, { users: userID }],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
          },
        },
        {
          $project: {
            "owner.username": 1,
            "owner.mobile": 1,
            "owner.email": 1,
          },
        },
        {
          $unwind: "$owner",
        },
      ]);
      return res.status(200).json({ status: 200, success: true, teams });
    } catch (error) {
      next(error);
    }
  }
  async removeTeamById(req, res, next) {
    try {
      const teamID = req.params.id;
      const team = await teamModel.findOne({ _id: teamID });
      if (!team) throw { status: 404, message: "تیمی یافت نشد" };

      const result = await teamModel.deleteOne({ _id: teamID });
      if (result.deletedCount == 0) throw { status: 500, message: "حذف تیم انجام نشد لطفا مجددا تلاش کنید" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "حذف تیم با موفقیت انجام شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async findUserInTeam(teamID, userID) {
    const result = await teamModel.findOne({
      $or: [{ owner: userID }, { users: userID }],
      _id: teamID,
    });
    return !!result;
  }
  async inviteUserToTeam(req, res, next) {
    try {
      const { username, teamID } = req.params;
      const userID = req.user._id;
      const team = await this.findUserInTeam(teamID, userID);

      if (!team) throw { status: 400, message: "تیمی جهت دعوت کردن افراد یافت نشد" };
      const user = await userModel.findOne({ username });
      if (!user) throw { status: 400, message: "کاربری مورد نظر جهت دعوت به تیم یافت نشد !!!" };

      const userInvited = await this.findUserInTeam(teamID, user._id);
      if (userInvited) throw { status: 400, message: "کاربر مورد نظر قبلا به تیم دعوت شده است" };

      const request = {
        caller: req.user.username,
        requestDate: new Date(),
        teamID,
        status: "pending",
      };

      const updateUserResult = await userModel.updateOne({ username }, { $push: { invitRequest: request } });
      if (updateUserResult.modifiedCount == 0) throw { status: 500, message: "ثبت درخواست دعوت با خطا مواجه شد" };
      return res.status(201).json({ status: 200, message: "ثبت درخواست با موفقیت ایجاد شد !!", success: true });
    } catch (error) {
      next(error);
    }
  }

  async updateTeam(req, res, next) {
    try {
      // const {name , description} = req.body
      const data = { ...req.body };
      Object.keys(data).forEach((key) => {
        if (!data[key]) delete data[key];
        if (["", " ", undefined, null, NaN].includes(data[key])) delete data[key];
      });
      const userID = req.user._id;
      const { teamID } = req.params;
      const team = await teamModel.findOne({ owner: userID._id, _id: teamID });
      if (!team) throw { status: 404, message: "تیمی با این مشخصات یافت نشد" };
      const teamEditResult = await teamModel.updateOne({ _id: teamID }, { $set: data });
      if (teamEditResult.modifiedCount == 0) throw { status: 500, message: "بروزرسانی مشخصات تیم انجام نشد" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "به روزرسانی با موفقیت انجام شد",
      });
    } catch (error) {
      next(error);
    }
  }
  removeUserFromTeam() {}
}
module.exports = {
  TeamController: new TeamController(),
};
