"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const calendar_1 = __importDefault(require("../mongoose/schemas/calendar"));
const listing_1 = __importDefault(require("../mongoose/schemas/listing"));
const date_fns_1 = require("date-fns");
// import fs from "fs";
// const LOG_FILE = "availability_logs.txt";
// const logToFile = (message: string) => {
//   fs.appendFileSync(LOG_FILE, message + "\n", { encoding: "utf8" });
// };
const setMidnightUTC = (date) => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    const fixedDate = new Date(Date.UTC(date.getFullYear(), // Get the full year in local time
    date.getMonth(), // Get the month in local time
    date.getDate(), // Get the day in local time
    0, 0, 0, 0 // Set the time to 00:00:00 UTC
    ));
    // console.log("⏳ Fixed Date:", fixedDate.toISOString());
    return fixedDate;
};
const getAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listingId } = req.params;
        const { startDate, endDate } = req.query;
        const calendar = yield calendar_1.default.findOne({ listing: listingId });
        if (!calendar) {
            res.status(404).json({ message: "Calendar not found" });
            return;
        }
        // console.log("📅 Calendar:", calendar);
        // Filter dates within the requested range
        const availabilityInRange = startDate || endDate
            ? calendar.dates.filter((date) => date.date >= new Date(startDate) &&
                date.date <= new Date(endDate))
            : calendar.dates;
        res.status(200).json({
            message: "Availability fetched successfully",
            availability: availabilityInRange,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const updateAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { listingId } = req.params;
        let { startDate, endDate, isBlocked, customPrice, 
        //  minimumStay,
        note, } = req.body;
        const sanitizedStartDate = setMidnightUTC(new Date(startDate));
        let sanitizedEndDate = endDate ? setMidnightUTC(new Date(endDate)) : null;
        let isBlockingSingleDay = false;
        // If no endDate is provided, treat it as a single-day selection and set endDate as startDate
        if (!sanitizedEndDate) {
            sanitizedEndDate = sanitizedStartDate;
            isBlockingSingleDay = true;
        }
        if ((0, date_fns_1.isBefore)(sanitizedEndDate, sanitizedStartDate) &&
            !isBlockingSingleDay) {
            res.status(400).json({ message: "End date cannot be before start date" });
            return;
        }
        let datesInRange = [];
        let currentDate = new Date(sanitizedStartDate);
        while (currentDate <= sanitizedEndDate) {
            datesInRange.push(new Date(currentDate));
            currentDate = (0, date_fns_1.addDays)(currentDate, 1);
        }
        let calendar = yield calendar_1.default.findOne({ listing: listingId });
        if (!calendar) {
            calendar = new calendar_1.default({ listing: listingId, dates: [] });
        }
        for (const date of datesInRange) {
            const fixedDate = setMidnightUTC(date);
            const existingDateIndex = calendar.dates.findIndex((d) => d.date.getTime() === fixedDate.getTime());
            if (existingDateIndex >= 0) {
                const existingDate = calendar.dates[existingDateIndex];
                const dateData = {
                    date: fixedDate,
                    isBlocked: isBlocked !== undefined ? isBlocked : existingDate.isBlocked,
                    customPrice: customPrice !== undefined ? customPrice : existingDate.customPrice,
                    // minimumStay:
                    //   minimumStay !== undefined ? minimumStay : existingDate.minimumStay,
                    note: note !== undefined ? note : existingDate.note,
                };
                Object.assign(calendar.dates[existingDateIndex], Object.assign(Object.assign({}, dateData), { isBooked: false }));
            }
            else {
                const dateData = {
                    date: fixedDate,
                    isBlocked: isBlocked !== null && isBlocked !== void 0 ? isBlocked : false,
                    customPrice: customPrice || null,
                    // minimumStay: minimumStay || calendar.defaultMinimumStay,
                    note: note || "",
                };
                calendar.dates.push(Object.assign(Object.assign({}, dateData), { isBooked: false }));
            }
        }
        calendar.updatedAt = new Date();
        yield calendar.save();
        res.status(200).json({
            message: "Calendar updated successfully",
            calendar,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const blockDates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { listingId } = req.params;
        const { startDate, endDate, note } = req.body;
        // Verify listing ownership
        const listing = yield listing_1.default.findOne({ _id: listingId, host: userId });
        // console.log("----listing----", listing);
        if (!listing) {
            res.status(403).json({ message: "Unauthorized or listing not found" });
            return;
        }
        // Update availability with blocked dates
        const result = yield updateAvailability(Object.assign(Object.assign({}, req), { body: {
                startDate,
                endDate,
                isBlocked: true,
                note,
            } }), res);
        return result;
        // res.status(200).json({ message: "Blocked dates successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const setCustomPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { listingId } = req.params;
        const { startDate, endDate, price, note } = req.body;
        // Verify listing ownership
        const listing = yield listing_1.default.findOne({ _id: listingId, host: userId });
        if (!listing) {
            res.status(403).json({ message: "Unauthorized or listing not found" });
            return;
        }
        // Update availability with custom pricing
        const result = yield updateAvailability(Object.assign(Object.assign({}, req), { body: {
                startDate,
                endDate,
                customPrice: price,
                note,
            } }), res);
        return result;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const setMinimumStay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { listingId } = req.params;
        const { defaultMinimumStay } = req.body;
        // Verify listing ownership
        const listing = yield listing_1.default.findOne({ _id: listingId, host: userId });
        if (!listing) {
            res.status(403).json({ message: "Unauthorized or listing not found" });
            return;
        }
        let calendar = yield calendar_1.default.findOne({ listing: listingId });
        if (!calendar) {
            calendar = new calendar_1.default({ listing: listingId, dates: [] });
        }
        calendar.defaultMinimumStay = defaultMinimumStay;
        calendar.updatedAt = new Date();
        yield calendar.save();
        res.status(200).json({
            message: "Minimum stay updated successfully",
            calendar,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
const calendarController = {
    getAvailability,
    updateAvailability,
    blockDates,
    setCustomPricing,
    setMinimumStay,
};
exports.default = calendarController;
