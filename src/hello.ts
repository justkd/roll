/**
 * @file hello.ts
 * @version 0.0.1
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export const makeHello`
 * Describe it here.
 */

/**
 * Use this function to create a greeting string with the given name
 * @param name The name to greet
 */
export const makeHello = (name?: string): string => `Hello ${name || "world"}`;
