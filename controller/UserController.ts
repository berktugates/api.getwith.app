import { Request, Response } from "express";
import { sendErrorResponse } from "../helpers/sendErrorResponse";
import { User, validateAuth, validateUser } from "../model/User";
import bcrypt from "bcrypt";

class UserController {
  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie("token");
      res.status(200).send({
        message: "logout success",
      });
    } catch (err) {
      sendErrorResponse(res, 500, "Internal server error.");
    }
  }

  static async auth(req: Request, res: Response) {
    try {
      const { error } = validateAuth(req.body);
      if (error) {
        res.status(400).send(error.details[0].message);
      }
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        sendErrorResponse(res, 400, "Incorrect email or password.");
        return;
      }
      const isSuccess = await bcrypt.compare(req.body.password, user.password);
      if (!isSuccess) {
        sendErrorResponse(res, 400, "Incorrect email or password.");
      }
      const token = user?.createAuthToken();

      res
        .status(200)
        .header("getwith-auth-token", token)
        .header("Access-Control-Expose-Headers", "token")
        .send({
          token: token,
          id: user?._id,
        });
    } catch (err) {
      sendErrorResponse(res, 500, "Internal server error.");
      return;
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        sendErrorResponse(res, 404, "User not found.");
        return;
      }
      res.status(200).send(user);
      return;
    } catch (err) {
      sendErrorResponse(res, 500, "Internal server error.");
      return;
    }
  }

  static async update(req: Request, res: Response) {
    try {
      let user = await User.findById(req.params.id);
      if (!user) {
        sendErrorResponse(res, 404, "User not found.");
        return;
      }
      const { error } = validateUser(req.body);
      if (error) {
        res.status(400).send(error.details[0].message);
      }
      const hashedPassword = req.body.password;

      user.name = req.body.name;
      user.surname = req.body.surname;
      user.birth = req.body.birth;
      user.email = req.body.email;
      user.password = hashedPassword;

      await user.save();
      res.status(200).send(user);
    } catch (err) {
      sendErrorResponse(res, 500, "Internal server error.");
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { error } = validateUser(req.body);
      if (error) {
        res.status(400).send(error.details[0].message);
        return;
      }
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        res.status(409).send("This user already exists.");
        return;
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        name: req.body.name,
        surname: req.body.surname,
        birth: req.body.birth,
        email: req.body.email,
        password: hashedPassword,
      });

      await newUser.save();
      const token = newUser.createAuthToken();

      res
        .status(201)
        .header("getwith-auth-token", token)
        .header("Access-Control-Expose-Headers", "token")
        .send(newUser);
    } catch (err) {
      sendErrorResponse(res, 500, "Internal server error.");
      return;
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        sendErrorResponse(res, 404, "User not found.");
        return;
      }
      res.status(200).send(user);
      return;
    } catch (err) {
      sendErrorResponse(res, 500, "Internal server error.");
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const users = await User.find();
      if (users.length <= 0) {
        sendErrorResponse(res, 404, "Users not found.");
        return;
      }
      res.status(200).send(users);
      return;
    } catch (err) {
      sendErrorResponse(res, 500, "Internal server error.");
      return;
    }
  }
}
export default UserController;
