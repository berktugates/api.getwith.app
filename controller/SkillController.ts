import { Request, Response } from "express";
import { Skill, validateSkill } from "../model/Skill";
import { sendErrorResponse } from "../helpers/sendErrorResponse";

class SkillController {
  static async delete(req: Request, res: Response) {
    try {
      const skill = await Skill.findByIdAndDelete(req.params.id);
      if (!skill) {
        sendErrorResponse(res, 404, "Skill not found.");
        return;
      }
      res.status(200).send(skill);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, 500, "Internal server error.");
    }
  }

  static async update(req: Request, res: Response) {
    try {
      let skill = await Skill.findById(req.params.id);
      if (!skill) {
        sendErrorResponse(res, 404, "Skill not found.");
        return;
      }
      const { error } = validateSkill(req.body);
      if (error) {
        sendErrorResponse(res, 400, error.details[0].message);
        return;
      }

      skill.userId = req.body.userId;
      skill.title = req.body.title;

      await skill.save();
      res.status(200).send(skill);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, 500, "Internal server error.");
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { error } = validateSkill(req.body);
      if (error) {
        sendErrorResponse(res, 400, error.details[0].message);
        return;
      }
      const skill = new Skill({
        userId: req.body.userId,
        title: req.body.title,
      });
      res.status(200).send(skill);
      return;
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, 500, "Internal server error.");
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const skill = await Skill.findById(req.params.id);
      if (!skill) {
        sendErrorResponse(res, 404, "Skill not found.");
        return;
      }
      res.status(200).send(skill);
      return;
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, 500, "Internal server error.");
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const skills = await Skill.find();
      if (skills.length <= 0) {
        sendErrorResponse(res, 404, "Skills not found.");
        return;
      }
      res.status(200).send(skills);
      return;
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, 500, "Internal server error.");
    }
  }
}
export default SkillController;
