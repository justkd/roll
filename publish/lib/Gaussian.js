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
 */Object.defineProperty(exports,"__esModule",{value:!0}),exports.Gaussian=void 0;const Scaled_1=require("./Scaled"),Uniform_1=require("./Uniform"),Gaussian=(uniformGenerator,skew=0)=>{skew=(sk=>{const n=new Scaled_1.Scaled(Math.abs(sk));n.clip(0,1);const skewRight=()=>{sk=1-n.value()},skewLeft=()=>{n.scale(0,4),sk=n.value()},noSkew=()=>{sk=1};return 0===sk?noSkew():sk<0?skewRight():skewLeft(),sk})(skew);let u=0,v=0;if("function"==typeof uniformGenerator.random){for(;0===u;)u=uniformGenerator.random();for(;0===v;)v=uniformGenerator.random()}else console.error("must provide a valid prng generator object");const fix=Scaled_1.Scaled.floatingPointFix;let num=fix(Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v));return num=fix(num/10+.5),(num>1||num<0)&&(num=Number((0,exports.Gaussian)(new Uniform_1.Uniform,skew))),num=fix(num**skew),num};exports.Gaussian=Gaussian;