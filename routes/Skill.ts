import express, { Router} from "express";

import { authMiddleware } from "../middleware/auth";
import SkillController from "../controller/SkillController";

const router: Router = express.Router();

router.delete("/api/skills/:id", authMiddleware, SkillController.delete);
router.put("/api/skills/:id", authMiddleware, SkillController.update);
router.post("/api/skills", authMiddleware, SkillController.create)
router.get("/api/skills/:id", authMiddleware, SkillController.get);
router.get("/api/skills", authMiddleware, SkillController.getAll);

export default router;
