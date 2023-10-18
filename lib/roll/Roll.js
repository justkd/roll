"use strict";
/**
 * @file Roll.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export class Roll`
 * Class representing a random number manager.
 * Includes Mersenne Twister uniform distribution, Box Mueller gaussian
 * distribution, n-sided die rolling, history of variable max size, elementary
 * statistics, and scale/clip/round convenience functions.
 */Object.defineProperty(exports,"__esModule",{value:!0}),exports.Roll=void 0;const History_1=require("./History"),Scaled_1=require("./Scaled"),Uniform_1=require("./Uniform"),Gaussian_1=require("./Gaussian"),ElemStats_1=require("./ElemStats");class Roll{seed;history;maxHistory;clearHistory;uniform;gaussian;d;random;mean;median;modes;stdDev;constructor(opts){const{seed:seed,maxHistory:maxHistory}=opts||{},uniform=new Uniform_1.Uniform(seed);let history=new History_1.History(maxHistory);const $private={seed:$seed=>{void 0!==$seed&&(this.clearHistory(),uniform.seed($seed));const s=uniform.seed(),notArray=void 0===s||"number"==typeof s?s:new Uint32Array(s);return Array.isArray(s)?[...s]:notArray},history:()=>history.map((x=>x[0])),maxHistory:size=>history.max(size),clearHistory:()=>{const max=history.max();history=new History_1.History,history.max(max)},random:skew=>{const normal="number"!=typeof skew,g=$private.gaussian,u=$private.uniform;return normal?u():g(skew)},uniform:()=>{const rand=uniform.random();return history.push(rand),rand},gaussian:skew=>{const rand=(0,Gaussian_1.Gaussian)(uniform,skew);return history.push(rand),rand},d:(sides,skew)=>{if("number"==typeof sides){const u=uniform,r="number"==typeof skew?(0,Gaussian_1.Gaussian)(u,skew):u.random(),n=new Scaled_1.Scaled(r);n.scale(1,Math.floor(sides)).round(0);const num=n.value();return history.push(num),num}return console.log(new Error("Sides must be a number.")),NaN},mean:arr=>(arr=arr||this.history(),ElemStats_1.Elemstats.mean(arr)),median:arr=>(arr=arr||this.history(),ElemStats_1.Elemstats.median(arr)),modes:arr=>(arr=arr||this.history(),ElemStats_1.Elemstats.modes(arr)),stdDev:arr=>(arr=arr||this.history(),ElemStats_1.Elemstats.stdDev(arr))};this.seed=$seed=>$private.seed($seed),this.history=()=>$private.history(),this.maxHistory=size=>$private.maxHistory(size),this.clearHistory=()=>$private.clearHistory(),this.d=(sides,skew)=>$private.d(sides,skew),this.random=skew=>$private.random(skew),this.uniform=()=>$private.uniform(),this.gaussian=skew=>$private.gaussian(skew),this.mean=arr=>$private.mean(arr),this.median=arr=>$private.median(arr),this.modes=arr=>$private.modes(arr),this.stdDev=arr=>$private.stdDev(arr),Object.keys(this).forEach((key=>{Object.defineProperty(this,key,{value:this[key],writable:!1,enumerable:!0})}))}static random(skew){return(new Roll).random(skew)}static d(sides,skew){return(new Roll).d(sides,skew)}static createRandomSeed(){return Uniform_1.Uniform.createRandomSeed()}static scale(value,r1,r2){return 0===r1[0]||1===r1[1]||r2?Scaled_1.Scaled.scale(value,r1,r2):Scaled_1.Scaled.scale(value,[0,1],r1)}static clip(value,range){return Scaled_1.Scaled.clip(value,range)}static round(value,places){return Scaled_1.Scaled.round(value,places)}}exports.Roll=Roll;