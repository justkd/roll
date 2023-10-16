/**
 * @file ElemStats.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export const ElemStats`
 * Functions for calculating mean, median, modes, and
 * standard deviation of a `number[]`.
 */
/**
 * Holds functions for calculating mean, median, mode, and standard
 * deviation of an array of numbers.
 */
export declare const Elemstats: {
    /**
     * Calculate the statistical mean of an `Array<number>`.
     * @param {number[]} arr - The array on which to operate.
     * @returns {number}
     */
    mean: (arr: number[]) => number;
    /**
     * Calculate the statistical median of an `Array<number>`.
     * @param {number[]} arr - The array on which to operate.
     * @returns {number}
     */
    median: (arr: number[]) => number;
    /**
     * Calculate the statistical modes of an `Array<number>`.
     * @param {number[]} arr - The array on which to operate.
     * @returns {number}
     */
    modes: (arr: number[]) => number[];
    /**
     * Calculate the standard deviation of an `Array<number>`.
     * @param {number[]} arr - The array on which to operate.
     * @returns {number} Return is normalized (0-1).
     */
    stdDev: (arr: number[]) => number;
};
//# sourceMappingURL=ElemStats.d.ts.map