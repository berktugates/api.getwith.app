import express, { Router } from "express";
import UserController from "../controller/UserController";

const router: Router = express.Router();

router.post("/api/users/logout", UserController.logout);
router.post("/api/users/auth", UserController.auth);
router.delete("/api/users/:id", UserController.delete);
router.put("/api/users/:id", UserController.update);
router.post("/api/users", UserController.create);
router.get("/api/users/:id", UserController.get);
router.get("/api/users", UserController.getAll);

export default router;
