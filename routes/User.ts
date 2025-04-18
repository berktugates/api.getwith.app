import express, { Request, Router, Response } from "express";
import { sendErrorResponse } from "../helpers/sendErrorResponse";
import { User, validateUser } from "../model/User";
import bcrypt from "bcrypt";

const router: Router = express.Router();

router.put("/api/users/:id", async (req: Request, res: Response) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      sendErrorResponse(res, 404, "User not found.");
      return
    }
    const { error } = validateUser(req.body);
    if(error){
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
});

router.post("/api/users", async (req: Request, res: Response) => {
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
      .header("token", token)
      .header("Access-Control-Expose-Headers", "token")
      .send(newUser);
  } catch (err) {
    sendErrorResponse(res, 500, "Internal server error.");
    return;
  }
});

router.get("/api/users/:id", async (req: Request, res: Response) => {
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
});

router.delete("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const users = await User.findByIdAndDelete(req.params.id);
    res.status(200).send(users);
    return;
  } catch (err) {
    sendErrorResponse(res, 500, "Internal server error.");
    return;
  }
});

router.get("/api/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    if (!users) {
      sendErrorResponse(res, 404, "Users not found");
      return;
    }
    res.status(200).send(users);
    return;
  } catch (err) {
    sendErrorResponse(res, 500, "Internal server error.");
    return;
  }
});

export default router;
