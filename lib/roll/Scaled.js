"use strict";
/**
 * @file Scaled.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export class Scaled`
 * Class for mutating a number with scale/clip/round. Also includes
 * a static method that can compensate for JS floating point errors.
 * Internal transformations automatically apply a JS floating point error fix.
 */Object.defineProperty(exports,"__esModule",{value:!0}),exports.Scaled=void 0;class Scaled{value;setValue;range;setRange;scale;clip;round;constructor(value,range=[0,1]){const notNumber=v=>!Number.isNaN(parseFloat(`${v}`))?parseFloat(`${v}`):v.value();let v="number"==typeof value?value:notNumber(value),r=range;this.scale=(min=0,max=1)=>(v=Scaled.scale(v,r,[min,max]),r=[min,max],this),this.clip=(min,max)=>(v=Scaled.clip(v,[min,max]),this),this.round=(places=0)=>(v=Scaled.round(v,places),this),this.value=()=>v,this.range=()=>r,this.setValue=val=>{v=val},this.setRange=bounds=>{r=bounds}}static scale(value,initialRange,targetRange){const fix=Scaled.floatingPointFix,r1=initialRange,r2=targetRange,r1Size=fix(r1[1]-r1[0]),r2Size=fix(r2[1]-r2[0]),x=fix(value-r1[0]),y=fix(x*r2Size),z=fix(y/r1Size);return fix(z+r2[0])}static clip(value,range){const fix=Scaled.floatingPointFix;return(v=>fix(Math.min(v,range[1])))((v=>fix(Math.max(range[0],v)))(value))}static round(value,places=0){return Scaled.floatingPointFix(Number(`${Math.round(Number(`${value}e${places}`))}e-${places}`))}static floatingPointFix(value,repeat=6){if(!value||Number.isNaN(parseFloat(`${value}`)))return value;const[intPart,decimalPart]=`${value}`.split(".");if(!decimalPart)return value;const regex=new RegExp(`(9{${repeat},}|0{${repeat},})(\\d)*$`,"gm"),matched=decimalPart.match(regex);if(!matched)return value;const[wrongPart]=matched,correctDecimalsLength=decimalPart.length-wrongPart.length,fixed=parseFloat(`${intPart}.${decimalPart}`);return parseFloat(fixed.toFixed(correctDecimalsLength))}}exports.Scaled=Scaled;