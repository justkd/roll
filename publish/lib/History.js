"use strict";
/**
 * @file History.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export class History`
 * Class extending `Array` with max size management.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.History = void 0;
/**
 * @class Extends `Array` with max size and automatic overflow handling.
 * @extends
 */
class History extends Array {
    /**
     * Get/Set the maximum allowed size of the array.
     * @param {number} [size] - If empty, return the current max size.
     * Else set the new max size and return the value. Default is `Infinity`.
     * @return {number}
     */
    max;
    /**
     * @override
     * If `length >= max`, remove the first element of the array
     * before adding the new element.
     * @param {any[]} items
     * @returns {number} new array length
     */
    push;
    /**
     * Returns an array of the last items removed due to overflow when pushing.
     * @note This value changes every time `.push` is successful.
     * @returns {any[]}
     */
    lastRemoved;
    /**
     * Empties the `History` array. Returns itself.
     */
    clear;
    /**
     * Class extending `Array` with max size and automatic overflow handling.
     * @extends
     */
    constructor(maxHistory) {
        super();
        let max = maxHistory ?? Infinity;
        const removed = [];
        this.max = (size) => {
            if (size !== undefined) {
                if (Number.isSafeInteger(size)) {
                    max = size;
                }
                else {
                    console.log("maxHistory(size) must be a safe integer");
                }
            }
            return max;
        };
        this.push = (...items) => {
            removed.splice(0, removed.length);
            let count = items.length;
            /* eslint-disable-next-line no-plusplus */
            while (count--)
                if (this.length >= max)
                    this.shift();
            super.push(items);
            return this.length;
        };
        this.clear = () => {
            removed.splice(0, removed.length);
            this.splice(0, this.length);
            return this;
        };
        this.lastRemoved = () => [...removed];
    }
}
exports.History = History;
//# sourceMappingURL=History.js.map