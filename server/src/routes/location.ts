import { Router } from "express";
import locationController from "../controllers/location";

const router = Router();

// Search locations based on query
router.get("/search", locationController.searchLocations);

// Get popular locations
router.get("/popular", locationController.getPopularLocations);

export default router;
