import { Router } from "express";
import validateSchema from "../middlewares/validate";
import { createListingSchema, getListingsSchema } from "../validation/listing";
import listingController from "../controllers/listing";
import { authorize } from "../middlewares/auth";
import { uploadBnb } from "../middlewares/uploadBnb";

const router = Router();

router.get("/all", validateSchema(getListingsSchema), listingController.getAll);
router.get(
  "/host",
  authorize({ isHost: true }),
  listingController.getHostListings
);
router.get(
  "/host/listing/:id",
  authorize({ isHost: true }),
  listingController.getHostListingById
);
router.get("/:id", listingController.getById);
router.post(
  "/create",
  authorize({ isHost: true }),
  uploadBnb.array("images", 100),
  validateSchema(createListingSchema),
  listingController.create
);
router.put(
  "/update/:id",
  authorize({ isHost: true }),
  uploadBnb.any(),
  validateSchema(createListingSchema),
  listingController.update
);
router.delete(
  "/delete/:id",
  authorize({ isHost: true }),
  listingController.remove
);

export default router;
