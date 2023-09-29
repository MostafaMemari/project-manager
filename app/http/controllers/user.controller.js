const { userModel } = require("../../models/users");

class UserController {
  getProfile(req, res, next) {
    try {
      const user = req.user;
      return res.status(200).json({
        status: 200,
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  }
  async editProfile(req, res, next) {
    try {
      let data = { ...req.body };
      const userID = req.user._id;
      let fields = ["first_name", "last_name", "skillss"];
      let badValues = ["", " ", null, undefined, 0, -1, NaN, [], {}];
      Object.entries(data).forEach(([key, value]) => {
        if (!fields.includes(key)) delete data[key];
        if (badValues.includes(value)) delete data[key];
      });

      const result = await userModel.updateOne({ _id: userID }, { $set: data });
      if (result.modifiedCount > 0)
        return res.status(200).json({
          status: 200,
          success: true,
          message: "بروزرسانی پروفایل با موفقیت انجام شد",
        });
      throw { status: 400, message: "بروزرسانی پروفایل انجام نشد" };
    } catch (error) {
      next(error);
    }
  }
  addSkills() {}
  editSkills() {}
  acceptInviteInTeam() {}
  rejectInviteInTean() {}
}
module.exports = {
  UserController: new UserController(),
};
