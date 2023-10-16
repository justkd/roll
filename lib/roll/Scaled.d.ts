/**
 * @file Scaled.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export class Scaled`
 * Class for mutating a number with scale/clip/round. Also includes
 * a static method that can compensate for JS floating point errors.
 * Internal transformations automatically apply a JS floating point error fix.
 */
/**
 * Class for mutating a number with scale/clip/round. Also includes
 * a static method that can compensate for JS floating point errors.
 * Internal transformations automatically apply a JS floating point error fix.
 * @example
 * // Given a number value and a known range, we can
 * // mutate the value in multiple ways.
 * const n = new Scaled(0.55, [0, 1]); // n.value = 0.55
 * n.scale(0, 10); // 5.5
 * n.clip(0, 4.5); // 4.5
 * n.round(0); // 4
 * const num: number = n.value(); // retrieve the `number` value
 * @example
 * // Static methods can be used for quick access to transformations,
 * // but may require range parameters.
 * const num = 3.75
 * const scaled = Scaled.scale(num, [0, 10], [0, 1]); // scaled == 0.37
 * const clipped = Scaled.clip(num, [0, 3]); // clipped == 3.0
 * const rounded = Scaled.round(num, 1); // rounded == 3.8
 * @example
 * // Each method returns itself so methods can be chained.
 * const n = new Scaled(100, [0, 1]);
 * n.scale(0, 10).clip(0, 999.424).round(0).value();
 * console.log(n.value() === 999) // true
 */
export declare class Scaled {
    /** Get the current number value. */
    value: () => number;
    /** Set the current number value. */
    setValue: (value: number) => void;
    /** Get the current known range. */
    range: () => [number, number];
    /** Set the current known range. */
    setRange: (range: [number, number]) => void;
    /**
     * Scale the current value to a new range and update the current range.
     * Initial range is inferred from the current known range.
     * Automatically applies a JS floating point error fix.
     * @param {number} min - The minimum value of the new range.
     * @param {number} max - The maximum value of the new range.
     * @returns {Scaled} The calling instance of `Scaled`.
     * @example
     * // The initial range is inferred from the current known range.
     * const n = new Scaled(0.55, [0, 1]); // initial range is 0-1
     * n.scale(0, 10); // scale from a range of 0-1 to a range of 0-10
     * const num = n.value(); // num = 5.5
     * @example
     * // Scale a value from a range of [0, 1] to [-1, 1]
     * const n = new Scaled(0.5, [0, 1]);
     * n.scale(-1, 1);
     * const num = n.value(); // num == 0
     * @example
     * // Scale a value from a range of [0, 1] to [0, 127]
     * const n = new Scaled(0.5, [0, 1]);
     * n.scale(0, 127);
     * const num = n.value(); // num == 63.5
     */
    scale: (min: number, max: number) => Scaled;
    /**
     * Limit the current value to a hard minimum and maximum.
     * Automatically applies a JS floating point error fix.
     * @param {number} min - The minimum possible value.
     * @param {number} max - The maximum possible value.
     * @returns {Scaled} The calling instance of `Scaled`.
     * @example
     * const n = new Scaled(0.55, [0, 1]);
     * n.clip(0, 0.5);
     * const num = n.value(); // 0.5
     */
    clip: (min: number, max: number) => Scaled;
    /**
     * Round the current value to a specific number of places.
     * Digits < 5 are rounded down. Automatically applies a JS
     * floating point error fix.
     * @param {number} [places=0] - The desired number of decimal places.
     * `0` rounds to a whole number.
     * @returns {Scaled} The calling instance of `Scaled`.
     * @example
     * const n = new Scaled(3.753);
     * n.round(2); // n.value() == 3.75
     * n.round(1); // n.value() == 3.8
     * n.round(0); // n.value() == 4
     */
    round: (places: number) => Scaled;
    /**
     * Class for mutating a number with scale/clip/round. Also includes
     * a static method that can compensate for JS floating point errors.
     * Internal transformations automatically apply a JS floating point
     * error fix.
     * @example
     * // Given a number value and a known range,
     * // we can mutate the value in multiple ways.
     * const n = new Scaled(0.55, [0, 1]); // n.value = 0.55
     * n.scale(0, 10); // 5.5
     * n.clip(0, 4.5); // 4.5
     * n.round(0); // 4
     * const num: number = n.value(); // retrieve the `number` value
     * @example
     * // Static methods can be used for quick access to
     * // transformations, but may require range parameters.
     * const num = 3.75
     * const scaled = Scaled.scale(num, [0, 10], [0, 1]); // scaled == 0.37
     * const clipped = Scaled.clip(num, [0, 3]); // clipped == 3.0
     * const rounded = Scaled.round(num, 1); // rounded == 3.8
     * @example Each method returns itself so methods can be chained.
     * const n = new Scaled(100, [0, 1]);
     * const result = n
     *  .scale(0, 10)
     *  .clip(0, 999.424)
     *  .round(0)
     *  .value();
     * console.log(result === 999) // true
     */
    constructor(value: number | string | Scaled, range?: [number, number]);
    /**
     * @static
     * Scale the value from one range to another.
     * Automatically applies a JS floating point error fix.
     * @param {number} value - The original value.
     * @param {[number, number]} initialRange - Initial number range scale.
     * @param {[number, number]} targetRange - Target number range scale.
     * @returns {number} The scaled `number`.
     * @example
     * // Scale a value from a range of [0, 10] to a range of [0, 1].
     * const n: number = 3.75;
     * const scaled: number = Scaled.scale(n, [0, 10], [0, 1]); // scaled == 0.375
     * @example
     * // Scale a value from a range of [0, 1] to [-1, 1]
     * const n: number = 0.5;
     * const scaled: number = Scaled.scale(n, [0, 1], [-1, 1]); // scaled == 0
     * @example
     * // Scale a value from a range of [0, 1] to [0, 127]
     * const n: number = 0.5;
     * const scaled: number = Scaled.scale(n, [0, 1], [0, 127]); // scaled == 63.5
     */
    static scale(value: number, initialRange: [number, number], targetRange: [number, number]): number;
    /**
     * @static
     * Limit a value to a hard minimum and maximum.
     * Automatically applies a JS floating point error fix.
     * @param {number} value - The original value.
     * @param {[number, number]} range - The `[min, max]` allowed values.
     * @returns {number} The clipped `number`.
     * @example
     * const n: number = 3.75;
     * const clipped: number = Scaled.clip(n, [0, 3]); // clipped == 3.0
     */
    static clip(value: number, range: [number, number]): number;
    /**
     * @static
     * Round a value to a specific number of places.
     * Digits < 5 are rounded down.
     * Automatically applies a JS floating point error fix.
     * @param {number} value - The original value.
     * @param {number} [places=0] - The desired number of decimal places.
     * `0` rounds to a whole number.
     * @returns {number} The rounded `number`.
     * @example
     * const n = 3.753;
     * const twoPlaces = Scaled.round(n, 2); // twoPlaces == 3.75
     * const onePlace = Scaled.round(n, 1); // onePlace == 3.8
     * const wholeNumber = Scaled.round(n, 0); // wholeNumber == 4
     */
    static round(value: number, places?: number): number;
    /**
     * @static
     * Account for the floating point error found in JS math.
     * This assumes you aren't intentionally working with values that
     * require a decimal place resolution greater than the `repeat`
     * parameter. If so, increase that value or don't use this function.
     * @param {number} value - The value or arithmetic expression.
     * @param {number} [repeat=10] - The number of 0's or 9's to allow to repeat.
     * Default is `10`.
     * @returns {number} The corrected `number`.
     * @example
     * const fix = Scaled.floatingPointFix;
     *
     * let hasError = 0.2 + 0.1 // 0.30000000000000004
     * let corrected = fix(0.2 + 0.1) // 0.3
     *
     * let wrongAgain = 0.3 - 0.1 // 0.19999999999999998
     * let notWrong = fix(0.3 - 0.1) // 0.2
     */
    static floatingPointFix(value: number, repeat?: number): number;
}
//# sourceMappingURL=Scaled.d.ts.map