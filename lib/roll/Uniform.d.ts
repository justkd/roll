/**
 * @file Uniform.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export class Uniform`
 * Class implementing Mersenne Twister random number generator.
 */
/** Allowed seed types. */
type Seed = number | number[] | Uint32Array | undefined;
/**
 * Mersenne Twister uniform distribution random number generator.
 * Generates a random seed using `window.crypto` or `node.crypto` if one
 * isn't provided.
 */
export declare class Uniform {
    /**
     * Generates a 53-bit random real in the interval [0,1] with
     * normal distribution.
     * @returns {number}
     */
    random: () => number;
    /**
     * If `seed` is `null`, return the current seed. Otherwise, initialize the
     * instance with a new seed. Creates a random seed if one isn't provided.
     * @param {Seed} [seed] - Unsigned 32-bit `Integer`, `Uint32Array`, or
     * `number[]` of arbitrary size and values.
     * @returns {Seed} The actual seed after initialization.
     */
    seed: (seed?: Seed) => Seed;
    /**
     * Mersenne Twister uniform distribution random number generator.
     * Generates a random seed using `window.crypto` or `node.crypto`if
     * one isn't provided.
     * @param {Seed} [seed=null] - The initial seed value. Should be an unsigned
     * 32-bit `Integer`, `Uint32Array`, or `number[]` of arbitrary values and
     * length. If `null`, `KDRoll()` will generate a random seed.
     */
    constructor(seed?: Seed);
    /**
     * Generate a random seed array using `window.crypto`. Fallback to
     * `node.crypto`. Fallback to array filled via `Math.random()`.
     * @returns {number[]}
     */
    static createRandomSeed(): number[];
}
export {};
//# sourceMappingURL=Uniform.d.ts.map