import { Router } from "express";
import categoryController from "../controllers/category";
import { authorize } from "../middlewares/auth";
import { createCategoryValidation } from "../validation/category";
import { uploadCategory } from "../middlewares/uploadCategoryIcon";
import validateSchema from "../middlewares/validate";

const router = Router();

router.get("/", authorize({ isAdmin: true }), categoryController.getAll);
router.post(
  "/",
  authorize({ isAdmin: true }),
  uploadCategory.single("icon"),
  validateSchema(createCategoryValidation),
  categoryController.create
);

export default router;
