const { userModel } = require("../../models/users");

class UserController {
  getProfile(req, res, next) {
    try {
      const user = req.user;
      user.profileImage = `${req.protocol}://${req.get("host")}/${user.profileImage.replace(/[\\\\]/gm, "/")}`;
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
      if (!Object.keys(data).length > 0) throw { status: 400, message: "مقادیر نمی توانند خالی باشند" };
      const userID = req.user._id;
      let fields = ["first_name", "last_name", "skillss"];
      let badValues = ["", " ", null, undefined, 0, -1, NaN, [], {}];
      Object.entries(data).forEach(([key, value]) => {
        if (!fields.includes(key)) delete data[key];
        if (badValues.includes(value)) delete data[key];
      });
      const result = await userModel.updateOne({ _id: userID }, { $set: data });
      console.log(result);
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
  async uploadProfileImage(req, res, next) {
    try {
      const userID = req.user._id;
      if (Object.keys(req.file).length == 0) throw { status: 400, message: "لطفا یک تصویر را انتخاب کنید" };
      const filePath = req.file?.path.replace("\\", "/").substring(req.file?.path.indexOf("public") + 7);

      const result = await userModel.updateOne({ _id: userID }, { $set: { profileImage: filePath } });
      if (result.modifiedCount == 0) throw { status: 400, message: "بروزرسانی انجام نشد" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "بروزرسانی با موفقیت انجام شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllRequest(req, res, next) {
    try {
      const userID = req.user._id;
      const { invitRequest } = await userModel.findById(userID, { invitRequest: 1 });
      return res.json({
        request: invitRequest || [],
      });
    } catch (error) {
      next(error);
    }
  }
  async getRequestsByStatus(req, res, next) {
    try {
      const { status } = req.params;
      const userID = req.user._id;
      const requests = await userModel.aggregate([
        {
          $match: { _id: userID },
        },
        {
          $project: {
            invitRequest: 1,
            _id: 0,
            invitRequest: {
              $filter: {
                input: "$invitRequest",
                as: "request",
                cond: {
                  $eq: ["$$request.status", status],
                },
              },
            },
          },
        },
      ]);
      return res.status(200).json({
        status: 200,
        success: true,
        request: requests?.[0]?.invitRequest || [],
      });
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
