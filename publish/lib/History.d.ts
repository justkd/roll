/**
 * @file History.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export class History`
 * Class extending `Array` with max size management.
 */
/**
 * @class Extends `Array` with max size and automatic overflow handling.
 * @extends
 */
export declare class History extends Array {
    /**
     * Get/Set the maximum allowed size of the array.
     * @param {number} [size] - If empty, return the current max size.
     * Else set the new max size and return the value. Default is `Infinity`.
     * @return {number}
     */
    max: (size?: number) => number;
    /**
     * @override
     * If `length >= max`, remove the first element of the array
     * before adding the new element.
     * @param {any[]} items
     * @returns {number} new array length
     */
    push: (...items: any[]) => number;
    /**
     * Returns an array of the last items removed due to overflow when pushing.
     * @note This value changes every time `.push` is successful.
     * @returns {any[]}
     */
    lastRemoved: () => any[];
    /**
     * Empties the `History` array. Returns itself.
     */
    clear: () => History;
    /**
     * Class extending `Array` with max size and automatic overflow handling.
     * @extends
     */
    constructor(maxHistory?: number);
}
//# sourceMappingURL=History.d.ts.map