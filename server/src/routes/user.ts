import { Router } from "express";
import { authorize } from "../middlewares/auth";

import userController from "../controllers/user";
import validateSchema from "../middlewares/validate";
import { editUserSchema } from "../validation/user";
import { uploadAvatar } from "../middlewares/uploadAvatar";

const router = Router();

router.get("/all", authorize({ isAdmin: true }), userController.getAll);
router.delete("/:id", authorize({ isAdmin: true }), userController.remove);
router.put(
  "/",
  authorize({}),
  uploadAvatar.single("avatar"),
  validateSchema(editUserSchema),
  userController.update
);

export default router;
