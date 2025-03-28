"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const location_1 = __importDefault(require("../controllers/location"));
const router = (0, express_1.Router)();
// Search locations based on query
router.get("/search", location_1.default.searchLocations);
// Get popular locations
router.get("/popular", location_1.default.getPopularLocations);
exports.default = router;
