const { projectModel } = require("../../models/project");
const autoBind = require("auto-bind");
class ProjectController {
  constructor() {
    autoBind(this);
  }
  async findProject(projectID, owner) {
    const project = await projectModel.findOne({ owner, _id: projectID });
    if (!project) throw { status: 404, message: "پروژه یافت نشد" };

    return project;
  }
  async createProject(req, res, next) {
    try {
      const { title, text, image, tags } = req.body;
      console.log(tags);
      const owner = req.user._id;
      const result = await projectModel.create({ title, text, owner, image, tags });
      if (!result) throw { status: 400, message: "افزودن پروژه با مشکل مواجه شد" };
      return res.status(201).json({
        status: 201,
        success: true,
        message: "پروژه با موفقیت ایجاد شد",
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllProject(req, res, next) {
    try {
      const owner = req.user._id;
      const projects = await projectModel.find({ owner });
      return res.status(200).json({
        status: 200,
        success: true,
        projects,
      });
    } catch (error) {
      next(error);
    }
  }
  async getProjectById(req, res, next) {
    try {
      const owner = req.user._id;
      const projectID = req.params.id;
      const project = await this.findProject(projectID, owner);

      return res.status(200).json({
        status: 200,
        success: true,
        project,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllProjectOfTeam(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
  async getProjectOfUser(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
  async updateProject(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
  async removeProject(req, res, next) {
    try {
      const owner = req.user._id;
      const projectID = req.params.id;
      const project = await this.findProject(projectID, owner);
      const deleteProjectResult = await projectModel.deleteOne({ _id: projectID });
      if (deleteProjectResult.deletedCount == 0) throw { status: 400, message: "پروژه حذف نشد" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "پروژه با موفقیت حذف شد",
        project,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  ProjectController: new ProjectController(),
};
