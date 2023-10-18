# [@justkd/roll](@justkd/roll)

![CircleCI](https://img.shields.io/circleci/build/gh/justkd/roll/master?token=d3afcc64819c5e9c38e2f653e196382415a4ec88&style=for-the-badge&logo=circleci)

![npm](https://img.shields.io/npm/dw/%40justkd/roll?style=for-the-badge&logo=npm&label=NPM)

Class representing a pseudorandom number manager. Includes Mersenne Twister uniform distribution, Box Mueller gaussian distribution, n-sided die rolling, history of variable max size, elementary statistics, and scale/clip/round convenience functions. Each instance 
can be seeded but also automatically generates its own random seed on creation. 

## Notes and Todo
- `.random` - add tests for optional gaussian functionality
- does setting maxHistory reset the history array? should it? if not how should it handle truncating?
- audit/optimize tests - originally (mostly) for older version are they all still valid?

## Install
```
npm i @justkd/roll
```
```
yarn add @justkd/roll
```

## Exports
```
import { Roll } from '@justkd/roll';
import type { Seed } from '@justkd/roll';
```

## Basic Use - Static Methods
Use the static method `.random` to generate a random number in the range 0-1.
```
const rand = Roll.random();
```
Use the static method `.d` to generate a random integer in the range 1-20.
```
const d20 = Roll.d(20);
```

## Basic Use - Instance Methods
Use instance methods to track history and expose statistic functions.
```
const roll = new Roll();

let i = 10;
while (i--) roll.random();

const history = roll.history(); // retrieve the internal history
const avg = roll.mean();        // retrieve the current average
```

## Extended Use

`Roll` can use either uniform (normal) or gaussian distribution.
```
const roll = new Roll();

/* convenience function, same as `.uniform()` */
const random = roll.random();         

/* random number in the range 0-1, uniform (normal) distribution */ 
const uniform = roll.uniform();        

/* random number in the range 0-1, gaussian distribution, undefined skew (same as 0 skew) */
const gaussian = roll.gaussian();        

/* random number in the range 0-1, gaussian distribution, skewed RIGHT (normalized -1 to 1) */
const gaussianSkew = roll.gaussian(0.15); 
```

`Roll` can use either uniform (normal) or gaussian distribution (part II).
```
const roll = new Roll();

/* random integer in the range 1-6, uniform (normal) distribution */
const d6 = roll.d(6);                     

/* random integer in the range 1-8, gaussian distribution, no skew */
const d8 = roll.d(8, 0);   

/* random integer in the range 1-12, gaussian distribution, skewed LEFT (normalized -1 to 1) */
const d12 = roll.d(12, 0.85);

/* random integer in the range 1-20, gaussian distribution, skewed RIGHT (normalized -1 to 1) */
const d20 = roll.d(20, -0.35);
```

Each instance of `Roll` can be given a `maxHistory`.
```
const roll = new Roll({ maxHistory: 1000 });

let i = roll.maxHistory();
while (i--) roll.random();

const stats = {
    history: roll.history(),
    mean:    roll.mean(),
    median:  roll.median(),
    modes:   roll.modes(),
    stdDev:  roll.stdDev(), // standard deviation normalized 0-1
};
```

Note: While each instance of `Roll` will allow using both normal and gaussian distribution, you should use different instances if you need to track the distribution over time.
```
const maxHistory = 1000;

const uniformRoll = new Roll({ maxHistory });
const gaussianRoll = new Roll({ maxHistory });

let i = maxHistory;
while (i--) {
    uniformRoll.d(10);
    gaussianRoll.d(31, 0.24);
};

const uniformStats = {
    history: uniformRoll.history(),
    mean:    uniformRoll.mean(),
    median:  uniformRoll.median(),
    modes:   uniformRoll.modes(),
    stdDev:  uniformRoll.stdDev(),
};

const gaussianStats = {
    history: gaussianRoll.history(),
    mean:    gaussianRoll.mean(),
    median:  gaussianRoll.median(),
    modes:   gaussianRoll.modes(),
    stdDev:  gaussianRoll.stdDev(),
};
```

Set the max history in the constructor or with the instance method.
```
/* set the initial `maxHistory` to `99`, default is `maxHistory === Infinity` */
const roll = new Roll({ maxHistory: 99 });

/* returns the current `maxHistory` if no param is given */
console.log(roll.maxHistory()); // `maxHistory === 99`

roll.maxHistory(10);            // set instance `maxHistory` to `10`
console.log(roll.maxHistory()); // `maxHistory === 10`
``` 

Giving `Roll` a max history will allow you to calculate rolling statistics.
```
const roll = new Roll({ maxHistory: 10 });

setInterval(() => {
    const rand = roll.d(6);
    const avg = roll.mean();
    const history = roll.history();
    console.log(rand, avg, history);
}, 1000);
```

Round to `n` decimal places using the static method `Roll.round()`.
```
const roll = new Roll();

const rand = roll.random();
const n = 2;
const rounded = Roll.round(rand, n);
const whole = Roll.round(rand * 100, 0)

// Roll.round(0.75, 0) === 1
// Roll.round(0.5, 0) === 1
// Roll.round(0.49, 0) === 0
// Roll.round(0.75, 1) === 0.8
// Roll.round(0.424242, 3) === 0.424
```

Numbers can be scaled from any known range to another using the static method `Roll.scale()`.
```
const n = Roll.random();
const r1 = [0, 1];  // initial range
const r2 = [5, 72]; // target range
const scaled = Roll.scale(n, r1, r2); // if `n === 0.5` then `scaled === 33.5`

// Roll.scale(0.5, [0, 1], [-1, 1]) === 0
// Roll.scale(0.75, [0, 1], [0, 2]) === 1.5
// Roll.scale(55, [2.3, 98.6], [33.42, 87.55]) === 63.04254413291797
// Roll.scale(12975.2123, [0, 9001], [0, 1]) === 1.4415300855460504
```

Numbers can be clipped to a minimum and maximum allowed value using the static method `Roll.clip()`.
```
const n = Roll.random();
const min = 0.2;
const max = 0.8;
const clipped = Roll.clip(n, [min, max]);

// Roll.clip(1, [0, 0.5]) === 0.5
// Roll.clip(-1, [1.5, 10]) === 1.5
// Roll.clip(0.5, [0, 1]) === 0.5
```

Generate a whole number between 1 and MAX_SAFE_INTEGER using gaussian distribution.
```
const getGaussianWhole = () => {
    const n = Roll.random(0);
    const scaled = Roll.scale(n, [0, 1], [1, Number.MAX_SAFE_INTEGER]);
    const whole = Roll.round(scaled, 0);
    return whole;
}
console.log(getGaussianWhole())
```

Generate and set a new random seed with the static method `Roll.createRandomSeed()` and instance method `roll.seed()`.
```
const roll = new Roll();

/* returns the current `seed` if no param is given */
console.log(roll.seed());

const newSeed = Roll.createRandomSeed();

/* set the seed for the given instance (this will clear the history) */
roll.seed(newSeed);
```

## API - Instance Methods
```
/**
 * Allowed seed types. 
 * A `number`, `number[]`, `Uint32Array`, or `undefined` representing a seed value.
 * @typedef {( number | number[] | Uint32Array | undefined )} Seed
 */
 type Seed = number | number[] | Uint32Array | undefined

/**
 * Generates a 53-bit random real in the interval [0, 1] with uniform distribution.
 * @returns {number}
 * @readonly
 */
 readonly uniform: () => number

/**
 * Generates a 53-bit random real in the interval [0, 1] with gaussian distribution.
 * @param {number} [skew=0] - In the range [-1,1]. Negative values skew data RIGHT, 
 * and positive values skew data LEFT. 
 * @returns {number}
 * @readonly
 */
readonly gaussian: (skew: number = 0) => number

/**
 * Convenience function. Same as `.gaussian` if `skew` is a `number`, same as 
 * `.uniform` if `skew` is `undefined`.
 * @param {number} [skew] - In the range [-1, 1]. Negative values skew data RIGHT, 
 * positive values skew data LEFT.
 * @note Pass `0` to use gaussian distribution without skew.
 * @returns {number}
 * @readonly
 */
readonly random: (skew?: number) => number

/**
 * Simulates a die-rolling metaphor. First generates a 53-bit random real in the 
 * interval [0, 1] with uniform or gaussian distribution, then scales it to a range 
 * `[1, n]` where `n` is the number of sides, then rounds to whole number.
 * @param {number} sides - The number of sides the die should represent. 
 * Allows but ignores decimal places.
 * @param {number} [skew] - In the range [-1, 1]. Negative values skew data RIGHT, 
 * positive values skew data LEFT.
 * @note Pass `0` to use gaussian distribution without skew.
 * @returns {number}
 * @readonly
 */
readonly d: (sides: number, skew?: number) => number

/**
 * Set the seed or get the current seed if no param is given. Automatically 
 * clears `history` when setting a new seed.
 * @param {Seed} [seed] - Unsigned 32-bit integer or number array of arbitrary size/values.
 * @returns {Seed} Returns the current seed.
 * @readonly
 */
readonly seed: (seed?: Seed) => Seed

/**
 * Retrieve a copy of the internal history array with no references.
 * @returns {number[]} Returns the current `history`.
 * @readonly
 */
readonly history: () => number[]

/**
 * Set the maximum `history` size or get the current size if no param is given. 
 * Default on instance creation is `Infinity`.
 * @param {number} [size] - The desired maximum history size.
 * @returns {number} Returns the current `maxHistory`.
 * @readonly
 */
readonly maxHistory: (size?: number) => number

/**
 * Reset the internal `history` array. Does not change current `maxHistory`.
 * @readonly
 */
readonly clearHistory: () => void

/**
 * Calculate the statistical mean of a given `number[]` or the current `history`.
 * @param {number[]} [arr] - Target array on which to operate. 
 * Defaults to the current `history` if `arr` is `undefined`.
 * @returns {number}
 * @readonly
 */
readonly mean: (arr?: number[]) => number

/**
 * Calculate the statistical median of a given `number[]` or the current `history`.
 * @param {number[]} [arr] -  Target array on which to operate. 
 * Defaults to the current `history` if `arr` is `undefined`.
 * @returns {number}
 * @readonly
 */
readonly median: (arr?: number[]) => number

/**
 * Calculate the statistical modes of a given `number[]` or the current `history`.
 * @param {number[]} [arr] - Target array on which to operate. 
 * Defaults to the current `history` if `arr` is `undefined`.
 * @returns {number[]}
 * @readonly
 */
readonly modes: (arr?: number[]) => number[]

/**
 * Calculate the standard deviation of a given `number[]` or the current `history`.
 * @param {number[]} [arr] - Target array on which to operate. 
 * Defaults to the current `history` if `arr` is `undefined`.
 * @returns {number} Standard deviation normalized [0, 1].
 * @readonly
 */
readonly stdDev: (arr?: number[]) => number
```

## API - Static Methods
```
/**
 * Convenience function. Same as `.gaussian` if `skew` is a `number`, 
 * same as `.uniform` if `skew` is `undefined`.
 * @param {number} [skew] - In the range [-1, 1]. Negative values skew data RIGHT, 
 * positive values skew data LEFT.
 * @note Pass `0` to use gaussian distribution without skew.
 * @returns {number}
 * @static
 */
static random(skew?: number): number

/**
 * Convenience function to generate a randomly seeded random number
 * in the range 1-sides.
 * @param {number} sides - The desired number of sides to simulate.
 * @param {number} [skew] - In the range [-1,1]. If `skew` is a number,
 * `Roll.d` will use gaussian distribution instead of normal distribution.
 * @note Pass `0` to use gaussian distribution without skew.
 * @returns {number}
 * @static
 */
static d(sides: number, skew?: number): number

/**
 * Generate a random seed array using `window.crypto`. Falls back to `node.crypto` 
 * or a final fallback to using `Math.random()` to fill an array.
 * @return {number[]} Randomly generated `number[]` of random size [20,623] and values.
 * @static
 */
static createRandomSeed(): number[]

/**
 * Scale a value from a known range to a new range.
 * @param {number} value - The initial value.
 * @param {[number, number]} r1 - The initial range [min, max].
 * @param {[number, number]} [r2] - The target range [min, max].
 * @note Shorthand: If `r1` is not `[0, 1]` and `r2` is `undefined`,
 * the actual `r1` is assumed to be `[0, 1]` and the actual `r2`
 * is assumed to be the given `r1`.
 * @returns {number}
 * @static
 * @example
 * const n = 50
 * const scaled = Roll.scale(n, [0, 100], [0, 1]) // scaled === 0.5
 * @example
 * // we can use the shorthand when we know the input value is in the range [0, 1]
 * const n = Roll.random()
 * const scaled = Roll.scale(n, [0, 10]) // scaled === 5
 */
static scale(
    value: number,
    r1: [number, number],
    r2: [number, number],
): number

/**
 * Limit a value to a hard minimum and maximum.
 * @param {number} value - The initial value.
 * @param {[number, number]} range - Two-element array containing 
 * the minimum and maximum possible values.
 * @returns {number}
 * @static
 */
static clip(
    value: number, 
    range: [number, number],
): number

/**
 * Round a value to a specific number of places. 
 * Decimal values < 5 (for any given place) are rounded down.
 * @param {number} value - The initial value.
 * @param {number} [places=0] - The desired number of decimal places.
 * `0` results in a whole number. Default is `places=0`.
 * @returns {number}
 * @static
 */
static round(
    value: number, 
    places: number
): number
```