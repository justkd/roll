"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roll = void 0;
const History_1 = require("./History");
const Scaled_1 = require("./Scaled");
const Uniform_1 = require("./Uniform");
const Gaussian_1 = require("./Gaussian");
const ElemStats_1 = require("./ElemStats");
/**
 * @class
 * Class representing a random number manager.
 * Includes Mersenne Twister uniform distribution, Box Mueller gaussian
 * distribution, n-sided die rolling, history of variable max size, elementary
 * statistics, and scale/clip/round convenience functions.
 * @example
 * const rand = Roll.random()
 * const d20 = Roll.d(20)
 * @example
 * const roll = new Roll()
 * let loops = 100
 *
 * while (loops--) roll.d(20)
 * const uniformResults = roll.history()
 *
 * roll.clearHistory()
 *
 * loops = 100
 * while (loops--) roll.d(20, 0)
 * const gaussianResults = roll.history()
 * @example
 * const roll = new Roll()
 * let loops = 100
 * while (loops--) roll.d(100)
 *
 * const mean = roll.mean()
 * const median = roll.median()
 * const modes = roll.modes()
 * const stdDev = roll.stdDev()
 * @example
 * const seed = Roll.createRandomSeed()
 * const roll = new Roll({ maxHistory: 1000 })
 * roll.seed(seed)
 */
class Roll {
    /**
     * Set the seed or get the current seed if no param is given. Automatically
     * clears `history` when setting a new seed.
     * @param {Seed} [seed] - Unsigned 32-bit integer or number array of arbitrary size/values.
     * @returns {Seed} Returns the current seed.
     * @readonly
     */
    seed;
    /**
     * Retrieve a copy of the internal history array with no references.
     * @returns {number[]} Returns the current `history`.
     * @readonly
     */
    history;
    /**
     * Set the maximum `history` size or get the current size if no param is given.
     * Default on instance creation is `Infinity`.
     * @param {number} [size] - The desired maximum history size.
     * @returns {number} Returns the current `maxHistory`.
     * @readonly
     */
    maxHistory;
    /**
     * Reset the internal `history` array. Does not change current `maxHistory`.
     * @readonly
     */
    clearHistory;
    /**
     * Generates a 53-bit random real in the interval [0, 1] with uniform distribution.
     * @returns {number}
     * @readonly
     */
    uniform;
    /**
     * Generates a 53-bit random real in the interval [0, 1] with gaussian distribution.
     * @param {number} [skew=0] - In the range [-1,1]. Negative values skew data RIGHT,
     * and positive values skew data LEFT.
     * @returns {number}
     * @readonly
     */
    gaussian;
    /**
     * Simulates a die-rolling metaphor. First generates a 53-bit random real in the
     * interval [0, 1] with uniform or gaussian distribution, then scales it to a range
     * `[1, n]` where `n` is the number of sides, then rounds to whole number.
     * @param {number} sides - The number of sides the die should represent.
     * Allows but ignores decimal places.
     * @param {number} [skew] - In the range [-1, 1]. Negative values skew data RIGHT,
     * positive values skew data LEFT.
     * @note Pass `0` to use gaussian distribution without skew.
     * @returns {number}
     * @readonly
     */
    d;
    /**
     * Convenience function. Same as `.gaussian` if `skew` is a `number`, same as
     * `.uniform` if `skew` is `undefined`.
     * @param {number} [skew] - In the range [-1, 1]. Negative values skew data RIGHT,
     * positive values skew data LEFT.
     * @note Pass `0` to use gaussian distribution without skew.
     * @returns {number}
     * @readonly
     */
    random;
    /**
     * Calculate the statistical mean of a given `number[]` or the current `history`.
     * @param {number[]} [arr] - Target array on which to operate.
     * Defaults to the current `history` if `arr` is `undefined`.
     * @returns {number}
     * @readonly
     */
    mean;
    /**
     * Calculate the statistical median of a given `number[]` or the current `history`.
     * @param {number[]} [arr] -  Target array on which to operate.
     * Defaults to the current `history` if `arr` is `undefined`.
     * @returns {number}
     * @readonly
     */
    median;
    /**
     * Calculate the statistical modes of a given `number[]` or the current `history`.
     * @param {number[]} [arr] - Target array on which to operate.
     * Defaults to the current `history` if `arr` is `undefined`.
     * @returns {number[]}
     * @readonly
     */
    modes;
    /**
     * Calculate the standard deviation of a given `number[]` or the current `history`.
     * @param {number[]} [arr] - Target array on which to operate.
     * Defaults to the current `history` if `arr` is `undefined`.
     * @returns {number} Standard deviation normalized [0, 1].
     * @readonly
     */
    stdDev;
    /**
     * @constructor
     * Instantiates a new `Roll()`
     * @param {Object} [opts]
     * @param {Seed} [opts.seed] - The initial seed value. Should be an unsigned
     * integer or `Uint32Array` of arbitrary values and length. If
     * `seed=undefined`, `Roll()` will generate its own random seed using
     * `Roll.createRandomSeed()`.
     * @param {number} [opts.maxHistory] - The initial max history value.
     * Default is `Infinity`.
     * @note `Roll` is a class representing a random number manager.
     * Includes Mersenne Twister uniform distribution, Box Mueller gaussian
     * distribution, n-sided die rolling, history of variable max size, elementary
     * statistics, and scale/clip/round convenience functions.
     */
    constructor(opts) {
        const { seed, maxHistory } = opts || {};
        /* Mersenne Twister uniform distribution random number generator. */
        const uniform = new Uniform_1.Uniform(seed);
        /* Class extending `Array` with max size and automatic overflow handling. */
        let history = new History_1.History(maxHistory);
        const $private = {
            seed: ($seed) => {
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
            maxHistory: (size) => history.max(size),
            clearHistory: () => {
                const max = history.max();
                history = new History_1.History();
                history.max(max);
            },
            random: (skew) => {
                const normal = typeof skew !== "number";
                const g = $private.gaussian;
                const u = $private.uniform;
                return normal ? u() : g(skew);
            },
            uniform: () => {
                const rand = uniform.random();
                history.push(rand);
                return rand;
            },
            gaussian: (skew = 0) => {
                const rand = (0, Gaussian_1.Gaussian)(uniform, skew);
                history.push(rand);
                return rand;
            },
            d: (sides, skew) => {
                if (typeof sides === "number") {
                    const u = uniform;
                    const r = typeof skew === "number" ? (0, Gaussian_1.Gaussian)(u, skew) : u.random();
                    const n = new Scaled_1.Scaled(r);
                    n.scale(1, Math.floor(sides)).round(0);
                    const num = n.value();
                    history.push(num);
                    return num;
                }
                console.log(new Error("Sides must be a number."));
                return NaN;
            },
            mean: (arr) => {
                arr = arr || this.history();
                return ElemStats_1.Elemstats.mean(arr);
            },
            median: (arr) => {
                arr = arr || this.history();
                return ElemStats_1.Elemstats.median(arr);
            },
            modes: (arr) => {
                arr = arr || this.history();
                return ElemStats_1.Elemstats.modes(arr);
            },
            stdDev: (arr) => {
                arr = arr || this.history();
                return ElemStats_1.Elemstats.stdDev(arr);
            },
        };
        this.seed = ($seed) => $private.seed($seed);
        this.history = () => $private.history();
        this.maxHistory = (size) => $private.maxHistory(size);
        this.clearHistory = () => $private.clearHistory();
        this.d = (sides, skew) => $private.d(sides, skew);
        this.random = (skew) => $private.random(skew);
        this.uniform = () => $private.uniform();
        this.gaussian = (skew = 0) => $private.gaussian(skew);
        this.mean = (arr) => $private.mean(arr);
        this.median = (arr) => $private.median(arr);
        this.modes = (arr) => $private.modes(arr);
        this.stdDev = (arr) => $private.stdDev(arr);
        Object.keys(this).forEach((key) => {
            Object.defineProperty(this, key, {
                value: this[key],
                writable: false,
                enumerable: true,
            });
        });
    }
    /**
     * Convenience function. Same as `.gaussian` if `skew` is a `number`,
     * same as `.uniform` if `skew` is `undefined`.
     * @param {number} [skew] - In the range [-1, 1]. Negative values skew data RIGHT,
     * positive values skew data LEFT.
     * @note Pass `0` to use gaussian distribution without skew.
     * @returns {number}
     * @static
     */
    static random(skew) {
        return new Roll().random(skew);
    }
    /**
     * Convenience function to generate a randomly seeded random number
     * in the range 1-sides.
     * @param {number} sides - The desired number of sides to simulate.
     * @param {number} [skew] - In the range [-1,1]. If `skew` is a number,
     * `Roll.d` will use gaussian distribution instead of normal distribution.
     * @note Pass `0` to use gaussian distribution without skew.
     * @returns {number}
     * @static
     */
    static d(sides, skew) {
        return new Roll().d(sides, skew);
    }
    /**
     * Generate a random seed array using `window.crypto`. Falls back to `node.crypto`
     * or a final fallback to using `Math.random()` to fill an array.
     * @return {number[]} Randomly generated `number[]` of random size [20,623] and values.
     * @static
     */
    static createRandomSeed() {
        return Uniform_1.Uniform.createRandomSeed();
    }
    /**
     * Scale a value from a known range to a new range.
     * @param {number} value - The initial value.
     * @param {[number, number]} r1 - The initial range [min, max].
     * @param {[number, number]} [r2] - The target range [min, max].
     * @note Shorthand: If `r1` is not `[0, 1]` and `r2` is `undefined`,
     * the actual `r1` is assumed to be `[0, 1]` and the actual `r2`
     * is assumed to be the given `r1`.
     * @returns {number}
     * @static
     * @example
     * const n = 50
     * const scaled = Roll.scale(n, [0, 100], [0, 1]) // scaled === 0.5
     * @example
     * // we can use the shorthand when we know the input value is in the range [0, 1]
     * const n = Roll.random()
     * const scaled = Roll.scale(n, [0, 10]) // scaled === 5
     */
    static scale(value, r1, r2) {
        if (r1[0] !== 0 && r1[1] !== 1 && !r2) {
            return Scaled_1.Scaled.scale(value, [0, 1], r1);
        }
        return Scaled_1.Scaled.scale(value, r1, r2);
    }
    /**
     * Limit a value to a hard minimum and maximum.
     * @param {number} value - The initial value.
     * @param {[number, number]} range - Two-element array containing
     * the minimum and maximum possible values.
     * @returns {number}
     * @static
     */
    static clip(value, range) {
        return Scaled_1.Scaled.clip(value, range);
    }
    /**
     * Round a value to a specific number of places.
     * Decimal values < 5 (for any given place) are rounded down.
     * @param {number} value - The initial value.
     * @param {number} [places=0] - The desired number of decimal places.
     * `0` results in a whole number. Default is `places=0`.
     * @returns {number}
     * @static
     */
    static round(value, places = 0) {
        return Scaled_1.Scaled.round(value, places);
    }
}
exports.Roll = Roll;
//# sourceMappingURL=Roll.js.map