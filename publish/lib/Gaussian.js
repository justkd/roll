"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gaussian = void 0;
const Scaled_1 = require("./Scaled");
const Uniform_1 = require("./Uniform");
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
const Gaussian = (uniformGenerator, skew = 0) => {
    /**
     * Convert skew percentage values (skew right) [-1, 0] to [0, 1]
     * and (skew left) [0, 1] to [0, 4].
     * @param {number} sk - Skew value.
     * @returns {number}
     */
    const scaleSkew = (sk) => {
        const n = new Scaled_1.Scaled(Math.abs(sk));
        n.clip(0, 1);
        /* sk < 0 */
        const skewRight = () => {
            sk = 1 - n.value();
        };
        /* sk > 0 */
        const skewLeft = () => {
            n.scale(0, 4);
            sk = n.value();
        };
        /* sk = 0 */
        const noSkew = () => {
            sk = 1;
        };
        if (sk === 0)
            noSkew();
        else if (sk < 0)
            skewRight();
        else
            skewLeft();
        return sk;
    };
    skew = scaleSkew(skew);
    let u = 0;
    let v = 0;
    if (typeof uniformGenerator.random === "function") {
        while (u === 0)
            u = uniformGenerator.random();
        while (v === 0)
            v = uniformGenerator.random();
    }
    else {
        console.error("must provide a valid prng generator object");
    }
    const fix = Scaled_1.Scaled.floatingPointFix;
    /* apply gaussian distribution */
    let num = fix(Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v));
    /* scale back to 0-1 */
    num = fix(num / 10.0 + 0.5);
    /* resample if out of range */
    if (num > 1 || num < 0)
        num = Number((0, exports.Gaussian)(new Uniform_1.Uniform(), skew));
    /* skew */
    num = fix(num ** skew);
    return num;
};
exports.Gaussian = Gaussian;
//# sourceMappingURL=Gaussian.js.map