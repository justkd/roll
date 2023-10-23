"use strict";
/**
 * @file ElemStats.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export const ElemStats`
 * Functions for calculating mean, median, modes, and
 * standard deviation of a `number[]`.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elemstats = void 0;
/* eslint-disable no-bitwise */
const Scaled_1 = require("./Scaled");
/**
 * Holds functions for calculating mean, median, mode, and standard
 * deviation of an array of numbers.
 */
exports.Elemstats = {
    /**
     * Calculate the statistical mean of an `Array<number>`.
     * @param {number[]} arr - The array on which to operate.
     * @returns {number}
     */
    mean: (arr) => {
        const sum = arr.reduce((previous, current) => (current += previous));
        return Scaled_1.Scaled.floatingPointFix(sum / arr.length);
    },
    /**
     * Calculate the statistical median of an `Array<number>`.
     * @param {number[]} arr - The array on which to operate.
     * @returns {number}
     */
    median: (arr) => {
        arr.sort((a, b) => a - b);
        const median = (arr[(arr.length - 1) >> 1] + arr[arr.length >> 1]) / 2;
        return Scaled_1.Scaled.floatingPointFix(median);
    },
    /**
     * Calculate the statistical modes of an `Array<number>`.
     * @param {number[]} arr - The array on which to operate.
     * @returns {number}
     */
    modes: (arr) => {
        const modes = [];
        const counts = [];
        let max = 0;
        arr.forEach((number) => {
            counts[number] = (counts[number] || 0) + 1;
            if (counts[number] > max)
                max = counts[number];
        });
        counts.forEach((count, index) => {
            if (count === max)
                modes.push(Scaled_1.Scaled.floatingPointFix(index));
        });
        return modes;
    },
    /**
     * Calculate the standard deviation of an `Array<number>`.
     * @param {number[]} arr - The array on which to operate.
     * @returns {number} Return is normalized (0-1).
     */
    stdDev: (arr) => {
        const fix = Scaled_1.Scaled.floatingPointFix;
        const avg = exports.Elemstats.mean(arr);
        const sqDiffs = arr.map((value) => {
            const diff = fix(value - avg);
            return fix(diff * diff);
        });
        const avgSqRt = fix(Math.sqrt(exports.Elemstats.mean(sqDiffs)));
        const stdDev = Scaled_1.Scaled.scale(avgSqRt, [0, Math.max(...arr)], [0, 1]);
        return stdDev;
    },
};
//# sourceMappingURL=ElemStats.js.map