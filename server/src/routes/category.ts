import { Router } from "express";
import categoryController from "../controllers/category";
import { authorize } from "../middlewares/auth";
import {
  createCategoryValidation,
  editCategoryValidation,
} from "../validation/category";
import { uploadCategory } from "../middlewares/uploadCategoryIcon";
import validateSchema from "../middlewares/validate";

const router = Router();

router.get("/all", categoryController.getAll);
router.post(
  "/create",
  authorize({ isAdmin: true }),
  uploadCategory.single("icon"),
  validateSchema(createCategoryValidation),
  categoryController.create
);
router.get("/:id", authorize({ isAdmin: true }), categoryController.getById);
router.put(
  "/:id",
  authorize({ isAdmin: true }),
  uploadCategory.single("icon"),
  validateSchema(editCategoryValidation),
  categoryController.update
);
router.delete("/:id", authorize({ isAdmin: true }), categoryController.remove);

export default router;
