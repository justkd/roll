/**
 * @file ElemStats.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export const ElemStats`
 * Functions for calculating mean, median, modes, and
 * standard deviation of a `number[]`.
 */

/* eslint-disable no-bitwise */

import { Scaled } from "./Scaled";

/**
 * Holds functions for calculating mean, median, mode, and standard
 * deviation of an array of numbers.
 */
export const Elemstats = {
  /**
   * Calculate the statistical mean of an `Array<number>`.
   * @param {number[]} arr - The array on which to operate.
   * @returns {number}
   */
  mean: (arr: number[]): number => {
    const sum = arr.reduce((previous, current) => (current += previous));
    return Scaled.floatingPointFix(sum / arr.length);
  },

  /**
   * Calculate the statistical median of an `Array<number>`.
   * @param {number[]} arr - The array on which to operate.
   * @returns {number}
   */
  median: (arr: number[]): number => {
    arr.sort((a, b) => a - b);
    const median = (arr[(arr.length - 1) >> 1] + arr[arr.length >> 1]) / 2;
    return Scaled.floatingPointFix(median);
  },

  /**
   * Calculate the statistical modes of an `Array<number>`.
   * @param {number[]} arr - The array on which to operate.
   * @returns {number}
   */
  modes: (arr: number[]): number[] => {
    const modes: number[] = [];
    const counts: number[] = [];
    let max = 0;
    arr.forEach((number) => {
      counts[number] = (counts[number] || 0) + 1;
      if (counts[number] > max) max = counts[number];
    });
    counts.forEach((count, index) => {
      if (count === max) modes.push(Scaled.floatingPointFix(index));
    });
    return modes;
  },

  /**
   * Calculate the standard deviation of an `Array<number>`.
   * @param {number[]} arr - The array on which to operate.
   * @returns {number} Return is normalized (0-1).
   */
  stdDev: (arr: number[]): number => {
    const fix = Scaled.floatingPointFix;
    const avg = Elemstats.mean(arr);
    const sqDiffs = arr.map((value) => {
      const diff = fix(value - avg);
      return fix(diff * diff);
    });
    const avgSqRt = fix(Math.sqrt(Elemstats.mean(sqDiffs)));
    const stdDev = Scaled.scale(avgSqRt, [0, Math.max(...arr)], [0, 1]);
    return stdDev;
  },
};
