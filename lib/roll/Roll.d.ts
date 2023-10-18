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
/**
 * Allowed seed types.
 * A `number`, `number[]`, `Uint32Array`, or `undefined` representing a seed value.
 * @typedef {( number | number[] | Uint32Array | undefined )} Seed
 */
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
export declare class Roll {
    /**
     * Set the seed or get the current seed if no param is given. Automatically
     * clears `history` when setting a new seed.
     * @param {Seed} [seed] - Unsigned 32-bit integer or number array of arbitrary size/values.
     * @returns {Seed} Returns the current seed.
     * @readonly
     */
    readonly seed: (seed?: Seed) => Seed;
    /**
     * Retrieve a copy of the internal history array with no references.
     * @returns {number[]} Returns the current `history`.
     * @readonly
     */
    readonly history: () => number[];
    /**
     * Set the maximum `history` size or get the current size if no param is given.
     * Default on instance creation is `Infinity`.
     * @param {number} [size] - The desired maximum history size.
     * @returns {number} Returns the current `maxHistory`.
     * @readonly
     */
    readonly maxHistory: (size?: number) => number;
    /**
     * Reset the internal `history` array. Does not change current `maxHistory`.
     * @readonly
     */
    readonly clearHistory: () => void;
    /**
     * Generates a 53-bit random real in the interval [0, 1] with uniform distribution.
     * @returns {number}
     * @readonly
     */
    readonly uniform: () => number;
    /**
     * Generates a 53-bit random real in the interval [0, 1] with gaussian distribution.
     * @param {number} [skew=0] - In the range [-1,1]. Negative values skew data RIGHT,
     * and positive values skew data LEFT.
     * @returns {number}
     * @readonly
     */
    readonly gaussian: (skew?: number) => number;
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
    readonly d: (sides: number, skew?: number) => number;
    /**
     * Convenience function. Same as `.gaussian` if `skew` is a `number`, same as
     * `.uniform` if `skew` is `undefined`.
     * @param {number} [skew] - In the range [-1, 1]. Negative values skew data RIGHT,
     * positive values skew data LEFT.
     * @note Pass `0` to use gaussian distribution without skew.
     * @returns {number}
     * @readonly
     */
    readonly random: (skew?: number) => number;
    /**
     * Calculate the statistical mean of a given `number[]` or the current `history`.
     * @param {number[]} [arr] - Target array on which to operate.
     * Defaults to the current `history` if `arr` is `undefined`.
     * @returns {number}
     * @readonly
     */
    readonly mean: (arr?: number[]) => number;
    /**
     * Calculate the statistical median of a given `number[]` or the current `history`.
     * @param {number[]} [arr] -  Target array on which to operate.
     * Defaults to the current `history` if `arr` is `undefined`.
     * @returns {number}
     * @readonly
     */
    readonly median: (arr?: number[]) => number;
    /**
     * Calculate the statistical modes of a given `number[]` or the current `history`.
     * @param {number[]} [arr] - Target array on which to operate.
     * Defaults to the current `history` if `arr` is `undefined`.
     * @returns {number[]}
     * @readonly
     */
    readonly modes: (arr?: number[]) => number[];
    /**
     * Calculate the standard deviation of a given `number[]` or the current `history`.
     * @param {number[]} [arr] - Target array on which to operate.
     * Defaults to the current `history` if `arr` is `undefined`.
     * @returns {number} Standard deviation normalized [0, 1].
     * @readonly
     */
    readonly stdDev: (arr?: number[]) => number;
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
    constructor(opts?: {
        seed?: Seed;
        maxHistory?: number;
    });
    /**
     * Convenience function. Same as `.gaussian` if `skew` is a `number`,
     * same as `.uniform` if `skew` is `undefined`.
     * @param {number} [skew] - In the range [-1, 1]. Negative values skew data RIGHT,
     * positive values skew data LEFT.
     * @note Pass `0` to use gaussian distribution without skew.
     * @returns {number}
     * @static
     */
    static random(skew?: number): number;
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
    static d(sides: number, skew?: number): number;
    /**
     * Generate a random seed array using `window.crypto`. Falls back to `node.crypto`
     * or a final fallback to using `Math.random()` to fill an array.
     * @return {number[]} Randomly generated `number[]` of random size [20,623] and values.
     * @static
     */
    static createRandomSeed(): number[];
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
    static scale(value: number, r1: [number, number], r2?: [number, number]): number;
    /**
     * Limit a value to a hard minimum and maximum.
     * @param {number} value - The initial value.
     * @param {[number, number]} range - Two-element array containing
     * the minimum and maximum possible values.
     * @returns {number}
     * @static
     */
    static clip(value: number, range: [number, number]): number;
    /**
     * Round a value to a specific number of places.
     * Decimal values < 5 (for any given place) are rounded down.
     * @param {number} value - The initial value.
     * @param {number} [places=0] - The desired number of decimal places.
     * `0` results in a whole number. Default is `places=0`.
     * @returns {number}
     * @static
     */
    static round(value: number, places: number): number;
}
//# sourceMappingURL=Roll.d.ts.map