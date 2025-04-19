import mongoose from "mongoose";
import Joi from "joi";
import { ISkill } from "../types/ISkill";

const skillSchema = new mongoose.Schema({
  userId: Number,
  title: String,
});

export const validateSkill = (skill: ISkill) => {
  const schema = Joi.object({
    userId: Joi.number().required(),
    title: Joi.string().required(),
  });
  return schema.validate(skill);
};

export const Skill = mongoose.model("Skill", skillSchema);
