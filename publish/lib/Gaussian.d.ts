/**
 * @file Gaussian.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export const Gaussian`
 * Generates a 53-bit random real in the interval [0, 1] with gaussian
 * distribution (Box Mueller transform) by converting random numbers
 * generated via uniform distribution (Mersenne Twister).
 */
import { Uniform } from "./Uniform";
/**
 * Generates a 53-bit random real in the interval [0, 1] with gaussian
 * distribution (Box Mueller transform).
 * @param {Uniform | Math} uniformGenerator - A uniform distribution
 * random number generator with a `.random()` method.
 * @param {number} [skew=0] - `number` in the range of -1 to 1. Negative
 * values skew data RIGHT, positive values skew data LEFT.
 * @returns
 * @example
 * const generator = new Uniform() || Math
 * const rand = Gaussian(generator, 0)
 */
export declare const Gaussian: (uniformGenerator: Uniform | Math, skew?: number) => number;
//# sourceMappingURL=Gaussian.d.ts.map