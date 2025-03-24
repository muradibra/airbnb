import { Router } from "express";
import { authorize } from "../middlewares/auth";
import roleController from "../controllers/role";

const router = Router();

router.patch("/", authorize({}), roleController.makeHost);

export default router;
