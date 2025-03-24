"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDaysBetween = calculateDaysBetween;
function calculateDaysBetween(first, second) {
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
}
