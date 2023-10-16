"use strict";
/**
 * @file History.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export class History`
 * Class extending `Array` with max size management.
 */Object.defineProperty(exports,"__esModule",{value:!0}),exports.History=void 0;class History extends Array{max;push;constructor(maxHistory){super();let max=maxHistory??1/0;this.max=size=>(void 0!==size&&(Number.isSafeInteger(size)?max=size:console.log("maxHistory(size) must be a safe integer")),max),this.push=(...items)=>{let count=items.length;for(;count--;)this.length>=max&&this.shift();return super.push(items),this.length}}}exports.History=History;