/**
 * @file Roll.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export class Roll`
 * Class representing a random number manager.
 * Includes Mersenne Twister uniform distribution, Box Mueller gaussian
 * distribution, n-sided die rolling, history of variable max size, elementary
 * statistics, and scale/clip/round convenience functions.
 */

import { History } from "./History";
import { Scaled } from "./Scaled";
import { Uniform } from "./Uniform";
import { Gaussian } from "./Gaussian";
import { Elemstats } from "./ElemStats";

/** Allowed seed types. */
export type Seed = number | number[] | Uint32Array | undefined;

/**
 * Class representing a random number manager.
 * Includes Mersenne Twister uniform distribution, Box Mueller gaussian
 * distribution, n-sided die rolling, history of variable max size, elementary
 * statistics, and scale/clip/round convenience functions.
 * @example
 * const rand = Roll.random()
 * const save = Roll.d(20)
 * @example
 * const roll = new Roll()
 * let loops = 100
 *
 * while (loops--) roll.d(20)
 * const uniformResults = [...roll.history()]
 *
 * roll.clearHistory()
 *
 * loops = 100
 * while (loops--) roll.d(20, 0)
 * const gaussianResults = [...roll.history()]
 * @example
 * const roll = new Roll()
 * let loops = 100
 * while (loops--) roll.d(100)
 *
 * const mean = roll.mean()
 * const median = roll.median()
 * const modes = roll.modes()
 * const stdDev = roll.standardDeviation()
 * @example
 * const seed = Roll.createRandomSeed()
 * const roll = new Roll({ maxHistory: 1000 })
 * roll.seed(seed)
 */
export class Roll {
  /**
   * Re-seed the manager. Automatically clears history.
   * @param {Seed} [seed] - Unsigned 32-bit integer `number`, `Uint32Array`, or
   * `number[]` of arbitrary size/values.
   * @returns {Seed} Returns the current seed.
   * @readonly
   */
  readonly seed: (seed?: Seed) => Seed;

  /**
   * Return a copy of the internal `history` object with no references.
   * @returns {number[]} Returns the current `history`.
   * @readonly
   */
  readonly history: () => number[];

  /**
   * Get or set the maximum history size.
   * @param {number} [size] - The maximum history size. If `size=undefined` is
   * this function will return the current `maxHistory`. Default `maxHistory`
   * is `Infinity`.
   * @returns {number} Returns the current `maxHistory`.
   * @readonly
   */
  readonly maxHistory: (size?: number) => number;

  /**
   * Reset `history` but retain the current `maxHistory`.
   * @readonly
   */
  readonly clearHistory: () => void;

  /**
   * Generates a 53-bit random real in the interval [0,1] with
   * uniform distribution.
   * @returns {number}
   * @readonly
   */
  readonly uniform: () => number;

  /**
   * Generates a 53-bit random real in the interval [0,1] with normal
   * distribution.
   * @param {number} [skew=0] - In the range [-1,1]. Negative values skew data
   * RIGHT, and positive values skew data LEFT. Default `skew=0`.
   * @returns {number}
   * @readonly
   */
  readonly gaussian: (skew?: number) => number;

  /**
   * Simulates a die-rolling metaphor. Generates a 53-bit random real in the
   * interval [0,1] with uniform or gaussian distribution, then scales it to a range [1,n]
   * where n is the number of sides, then rounds to whole number.
   * @param {number} sides - Number of sides to represent. Allows but ignores
   * decimals.
   * @param {number} [skew] - In the range [-1,1]. If `skew` is a number,
   * `roll.d` will use gaussian distribution instead of normal distribution.
   * Pass `0` to use gaussian distribution without skew.
   * @returns {number}
   * @readonly
   */
  readonly d: (sides: number, skew?: number) => number;

  /**
   * Convenience function. Alias for `uniform()`.
   * @returns {number}
   * @readonly
   */
  readonly random: () => number;

  /**
   * Calculate the statistical mean of a `number[]` or the current `history()`.
   * @param {number[]} [arr] - The array on which to operate.
   * Defaults to `history()` if `arr=undefined`.
   * @returns {number}
   * @readonly
   */
  readonly mean: (arr?: number[]) => number;

  /**
   * Calculate the statistical median of a `number[]` or the current
   * `history()`.
   * @param {number[]} [arr] - The array on which to operate.
   * Defaults to `history()` if `arr=undefined`.
   * @returns {number}
   * @readonly
   */
  readonly median: (arr?: number[]) => number;

  /**
   * Calculate the statistical modes of a `number[]` or the current `history()`.
   * @param {number[]} [arr] - The array on which to operate.
   * Defaults to `history()` if `arr=undefined`.
   * @returns {number[]}
   * @readonly
   */
  readonly modes: (arr?: number[]) => number[];

  /**
   * Calculate the standard deviation of a `number[]` or the current
   * `history()`.
   * @param {number[]} [arr] - The array on which to operate. Defaults to
   * `history()` if `arr=undefined`.
   * @returns {number} Standard deviation is normalized [0,1].
   * @readonly
   */
  readonly standardDeviation: (arr?: number[]) => number;

  /**
   * Instantiates a new `Roll()`
   * @param {Seed} [seed] - The initial seed value. Should be an unsigned
   * integer or `Uint32Array` of arbitrary values and length. If
   * `seed=undefined`, `Roll()` will generate its own random seed using
   * `Roll.createRandomSeed()`.
   * @note `Roll` is a class representing a random number manager.
   * Includes Mersenne Twister uniform distribution, Box Mueller gaussian
   * distribution, n-sided die rolling, history of variable max size, elementary
   * statistics, and scale/clip/round convenience functions.
   */
  constructor(opts?: { seed?: Seed; maxHistory?: number }) {
    const { seed, maxHistory } = opts || {};
    /* Mersenne Twister uniform distribution random number generator. */
    const uniform = new Uniform(seed);
    /* Class extending `Array` with max size and automatic overflow handling. */
    let history = new History(maxHistory);
    /* Private functions */
    const $private = {
      seed: ($seed?: Seed) => {
        if ($seed !== undefined) {
          this.clearHistory();
          uniform.seed($seed);
        }
        const s = uniform.seed();
        const notUInt32Arr = s === undefined || typeof s === "number";
        const notArray = notUInt32Arr ? s : new Uint32Array(s);
        return Array.isArray(s) ? [...s] : notArray;
      },
      history: () => history.map((x) => x[0]),
      maxHistory: (size?: number) => history.max(size),
      clearHistory: () => {
        const max = history.max();
        history = new History();
        history.max(max);
      },
      uniform: () => {
        const rand = uniform.random();
        history.push(rand);
        return rand;
      },
      gaussian: (skew?: number) => {
        const rand = Gaussian(uniform, skew);
        history.push(rand);
        return rand;
      },
      d: (sides: number, skew?: number) => {
        if (typeof sides === "number") {
          const u = uniform;
          const r = typeof skew === "number" ? Gaussian(u, skew) : u.random();
          const n = new Scaled(r);
          n.scale(1, sides).round(0);
          const num = n.value();
          history.push(num);
          return num;
        }
        console.log(new Error("Sides must be a number."));
        return NaN;
      },
      mean: (arr?: number[]) => {
        arr = arr || this.history();
        return Elemstats.mean(arr);
      },
      median: (arr?: any) => {
        arr = arr || this.history();
        return Elemstats.median(arr);
      },
      modes: (arr?: number[]) => {
        arr = arr || this.history();
        return Elemstats.modes(arr);
      },
      stdDev: (arr?: number[]) => {
        arr = arr || this.history();
        return Elemstats.stdDev(arr);
      },
    };

    this.seed = ($seed) => $private.seed($seed);
    this.history = () => $private.history();
    this.maxHistory = (size) => $private.maxHistory(size);
    this.clearHistory = () => $private.clearHistory();
    this.uniform = () => $private.uniform();
    this.gaussian = (skew) => $private.gaussian(skew);
    this.d = (sides) => $private.d(sides);
    this.random = () => $private.uniform();
    this.mean = (arr) => $private.mean(arr);
    this.median = (arr) => $private.median(arr);
    this.modes = (arr) => $private.modes(arr);
    this.standardDeviation = (arr) => $private.stdDev(arr);

    Object.keys(this).forEach((key) => {
      Object.defineProperty(this, key, {
        value: (this as any)[key],
        writable: false,
        enumerable: true,
      });
    });
  }

  /**
   * @static Convenience function to generate a randomly seeded random number
   * normalized [0,1].
   * @returns {number}
   */
  static random(): number {
    return new Roll().random();
  }

  /**
   * @static Convenience function to generate a randomly seeded random number
   * in the range 1-sides.
   * @param {number} sides - The desired number of sides to simulate.
   * @param {number} [skew] - In the range [-1,1]. If `skew` is a number,
   * `roll.d` will use gaussian distribution instead of normal distribution.
   * Pass `0` to use gaussian distribution without skew.
   * @returns {number}
   */
  static d(sides: number, skew?: number): number {
    const roll = new Roll();
    return roll.d(sides, skew) as number;
  }

  /**
   * @static Generate a random seed array using `window.crypto`. Falls back to
   * `node.crypto` or a final fallback to using `Math.random()` to fill an
   * array.
   * @return {number[]} Randomly generated `number[]` of random size [20,623]
   * and values.
   */
  static createRandomSeed(): number[] {
    return Uniform.createRandomSeed();
  }

  /**
   * @static Scale a value from a known range to a new range.
   * @param {number} value - The initial value.
   * @param {[number, number]} r1 - The initial range [min, max].
   * @param {[number, number]} r2 - The target range [min, max].
   * @returns {number}
   */
  static scale(
    value: number,
    r1: [number, number],
    r2: [number, number],
  ): number {
    return Scaled.scale(value, r1, r2);
  }

  /**
   * @static Limit a value to a hard minimum and maximum.
   * @param {number} value - The initial value.
   * @param {[number, number]} range - Array containing the minimum and
   * maximum possible values.
   * @returns {number}
   */
  static clip(value: number, range: [number, number]): number {
    return Scaled.clip(value, range);
  }

  /**
   * @static Round a value to a specific number of places. Decimal values < 5
   * (for any given place) are rounded down.
   * @param {number} value - The initial value.
   * @param {number} [places=0] - The desired number of decimal places.
   * `0` results in a whole number. Default is `places=0`.
   * @returns {number}
   */
  static round(value: number, places: number): number {
    return Scaled.round(value, places);
  }
}
