import { Router } from "express";
import reviewController from "../controllers/review";
import { authorize } from "../middlewares/auth";

const router = Router();

router.get("/", reviewController.getAll);
router.post("/", authorize(), reviewController.create);
router.put("/:id", authorize(), reviewController.update);
router.delete("/:id", authorize(), reviewController.remove);

export default router;
