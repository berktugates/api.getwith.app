import Joi from "joi";
import mongoose, {Document} from "mongoose";
import jwt from "jsonwebtoken";
import { IUser } from "../types/IUser";
import dotenv from "dotenv";

dotenv.config();

interface IUserDocument extends IUser, Document{
  createAuthToken():string;
}

const userSchema = new mongoose.Schema<IUserDocument>({
  name: String,
  surname: String,
  birth: Date,
  email: String,
  password: String,
});

export const validateUser = (user: IUser) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    birth: Joi.date().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(user);
};

export const validateAuth = (user: IUser) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
};

userSchema.methods.createAuthToken = function () {
  if (!process.env.JWT_TOKEN_KEY) {
    throw new Error("jsonwebtoken is not defined in environment variables");
  }
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_TOKEN_KEY,
    { expiresIn: "1h" }
  );
};

export const User = mongoose.model("User", userSchema);
