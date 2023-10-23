"use strict";
/**
 * @file ElemStats.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export const ElemStats`
 * Functions for calculating mean, median, modes, and
 * standard deviation of a `number[]`.
 */Object.defineProperty(exports,"__esModule",{value:!0}),exports.Elemstats=void 0;const Scaled_1=require("./Scaled");exports.Elemstats={mean:arr=>{const sum=arr.reduce(((previous,current)=>current+previous));return Scaled_1.Scaled.floatingPointFix(sum/arr.length)},median:arr=>{arr.sort(((a,b)=>a-b));const median=(arr[arr.length-1>>1]+arr[arr.length>>1])/2;return Scaled_1.Scaled.floatingPointFix(median)},modes:arr=>{const modes=[],counts=[];let max=0;return arr.forEach((number=>{counts[number]=(counts[number]||0)+1,counts[number]>max&&(max=counts[number])})),counts.forEach(((count,index)=>{count===max&&modes.push(Scaled_1.Scaled.floatingPointFix(index))})),modes},stdDev:arr=>{const fix=Scaled_1.Scaled.floatingPointFix,avg=exports.Elemstats.mean(arr),sqDiffs=arr.map((value=>{const diff=fix(value-avg);return fix(diff*diff)})),avgSqRt=fix(Math.sqrt(exports.Elemstats.mean(sqDiffs)));return Scaled_1.Scaled.scale(avgSqRt,[0,Math.max(...arr)],[0,1])}};