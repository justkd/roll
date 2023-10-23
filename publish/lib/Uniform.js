"use strict";
/**
 * @file Uniform.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export class Uniform`
 * Class implementing Mersenne Twister random number generator.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uniform = void 0;
/**
 * Mersenne Twister uniform distribution random number generator.
 * Generates a random seed using `window.crypto` or `node.crypto` if one
 * isn't provided.
 */
class Uniform {
    /**
     * Generates a 53-bit random real in the interval [0,1] with
     * normal distribution.
     * @returns {number}
     */
    random;
    /**
     * If `seed` is `null`, return the current seed. Otherwise, initialize the
     * instance with a new seed. Creates a random seed if one isn't provided.
     * @param {Seed} [seed] - Unsigned 32-bit `Integer`, `Uint32Array`, or
     * `number[]` of arbitrary size and values.
     * @returns {Seed} The actual seed after initialization.
     */
    seed;
    /**
     * Mersenne Twister uniform distribution random number generator.
     * Generates a random seed using `window.crypto` or `node.crypto`if
     * one isn't provided.
     * @param {Seed} [seed=null] - The initial seed value. Should be an unsigned
     * 32-bit `Integer`, `Uint32Array`, or `number[]` of arbitrary values and
     * length. If `null`, `KDRoll()` will generate a random seed.
     */
    constructor(seed) {
        const N = 624;
        const mt = new Array(N);
        let mti = null;
        /**
         * Namespace to differentiate between `seed` as both a property
         * and function.
         */
        const $state = {
            seed,
        };
        /**
         * Namespace to differentiate between `seed` as both a property
         * and function.
         */
        const $private = {
            /** Container for initialization functions. */
            seed: {
                /** Initializes state vector with a single unsigned 32-bit integer. */
                withInt: (intSeed) => {
                    let s;
                    mt[0] = intSeed >>> 0;
                    for (mti = 1; mti < N; mti += 1) {
                        s = mt[mti - 1] ^ (mt[mti - 1] >>> 30);
                        mt[mti] =
                            ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
                                (s & 0x0000ffff) * 1812433253 +
                                mti;
                        mt[mti] >>>= 0;
                    }
                },
                /**
                 * Initializes state vector by using an array of unsigned
                 * 32-bit integers `Uint32Array()` or `number[]`. If length is
                 * less than 624, then each array of 32-bit integers gives
                 * distinct initial state vector.
                 */
                withArray: (arrSeed) => {
                    const isUint32Array = arrSeed.constructor === Uint32Array;
                    let s;
                    const v = isUint32Array
                        ? [...arrSeed]
                        : arrSeed;
                    let i = 1;
                    let j = 0;
                    let k = N > v.length ? N : v.length;
                    $private.seed.withInt(v[0]);
                    for (; k > 0; k -= 1) {
                        s = mt[i - 1] ^ (mt[i - 1] >>> 30);
                        const a = (((s & 0xffff0000) >>> 16) * 1664525) << 16;
                        const b = (s & 0x0000ffff) * 1664525;
                        mt[i] = (mt[i] ^ (a + b)) + v[j] + j;
                        mt[i] >>>= 0;
                        i += 1;
                        j += 1;
                        if (i >= N) {
                            mt[0] = mt[N - 1];
                            i = 1;
                        }
                        if (j >= v.length)
                            j = 0;
                    }
                    for (k = N - 1; k; k -= 1) {
                        s = mt[i - 1] ^ (mt[i - 1] >>> 30);
                        const a = (((s & 0xffff0000) >>> 16) * 1566083941) << 16;
                        const b = (s & 0x0000ffff) * 1566083941;
                        mt[i] = (mt[i] ^ (a + b)) - i;
                        mt[i] >>>= 0;
                        i += 1;
                        if (i >= N) {
                            mt[0] = mt[N - 1];
                            i = 1;
                        }
                    }
                    /* Guard against an empty or invalid array. */
                    if (mt.length < 1)
                        mt[0] = 0x80000000;
                },
                /**
                 * Initialize the state vector with a random array
                 * generated via `window.crypto` or `node.crypto`.
                 */
                withCrypto: () => {
                    $state.seed = Uniform.createRandomSeed();
                    $private.seed.withArray($state.seed);
                },
            },
            /**
             * Initialize the instance with a new seed. Creates a random seed if
             * one isn't provided.
             * @param {Seed} [withSeed] - Unsigned 32-bit `Integer`, `Uint32Array`, or
             * `number[]` of arbitrary size and values.
             */
            init: (withSeed) => {
                const ensureUint = (num) => {
                    /* Make sure the integer size is safe. */
                    if (num > Number.MAX_SAFE_INTEGER)
                        return -1;
                    /* Only positive integers. */
                    if (num < 0)
                        num = Math.abs(num);
                    /* Ignore decimals. */
                    if (!Number.isInteger(num))
                        num = Number(num.toFixed(0));
                    /* Ensure number isn't `NaN` or `Infinity.` */
                    if (!Number.isSafeInteger(num))
                        num = -1;
                    return num;
                };
                const s = withSeed;
                /* Allow seed to be an integer. */
                if (typeof s === "number") {
                    let ss = s;
                    ss = ensureUint(ss);
                    if (ss >= 0) {
                        $state.seed = ss;
                        $private.seed.withInt(ss);
                    }
                    else {
                        console.warn("Seed integer is unsafe.");
                        console.log("Generating a random seed array instead.");
                        $private.seed.withCrypto();
                    }
                }
                else if (s && s.every && s.every((v) => typeof v === "number")) {
                    /* Allow seed to be `Uint32Array` or `number[]`. */
                    const isUint32Array = s.constructor === Uint32Array;
                    let ss = isUint32Array ? [...s] : s;
                    if (ss.length > 0) {
                        ss = ss.map((x) => ensureUint(x));
                        if (ss.includes(-1)) {
                            console.warn("Seed array can not contain unsafe integers.");
                            console.log("Generating a random seed array instead.");
                            $private.seed.withCrypto();
                        }
                        else {
                            $state.seed = ss;
                            $private.seed.withArray(ss);
                        }
                    }
                    else {
                        console.warn("Seed array can not be empty.");
                        console.log("Generating a random seed array instead.");
                        $private.seed.withCrypto();
                    }
                }
                else {
                    /* Anything else should generate a random seed array with
                    `window.crypto`. */
                    $private.seed.withCrypto();
                }
            },
            /**
             * Generates a random unsigned 32-bit integer.
             * @returns {number}
             */
            int32: () => {
                const M = 397;
                const UM = 0x80000000;
                const LM = 0x7fffffff;
                const MA = 0x9908b0df;
                let y;
                let kk = 0;
                const mag01 = [0, MA];
                if (mti !== null) {
                    for (; kk < N - M; kk += 1) {
                        y = (mt[kk] & UM) | (mt[kk + 1] & LM);
                        mt[kk] = mt[kk + M] ^ (y >>> 1) ^ mag01[y & 1];
                    }
                    for (; kk < N - 1; kk += 1) {
                        y = (mt[kk] & UM) | (mt[kk + 1] & LM);
                        mt[kk] = mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 1];
                    }
                    y = (mt[N - 1] & UM) | (mt[0] & LM);
                    mt[N - 1] = mt[M - 1] ^ (y >>> 1) ^ mag01[y & 1];
                    mti = 0;
                }
                y = mt[(mti += 1)];
                y ^= y >>> 11;
                y ^= (y << 7) & 0x9d2c5680;
                y ^= (y << 15) & 0xefc60000;
                y ^= y >>> 18;
                return y >>> 0;
            },
        };
        /*
         * Generates a 53-bit random real in the interval [0,1]
         * with normal distribution.
         */
        this.random = () => {
            /** Floating point fix. */
            const fix = (value, repeat = 6) => {
                /* Value is not applicable */
                if (!value || Number.isNaN(parseFloat(`${value}`)))
                    return value;
                /* No decimal */
                const [intPart, decimalPart] = `${value}`.split(".");
                if (!decimalPart)
                    return value;
                const regex = new RegExp(`(9{${repeat},}|0{${repeat},})(\\d)*$`, "gm");
                const matched = decimalPart.match(regex);
                /* No floating point problem */
                if (!matched)
                    return value;
                const [wrongPart] = matched;
                const correctDecimalsLength = decimalPart.length - wrongPart.length;
                const fixed = parseFloat(`${intPart}.${decimalPart}`);
                return parseFloat(fixed.toFixed(correctDecimalsLength));
            };
            const c = $private.int32();
            const a = c >>> 5;
            const b = c >>> 6;
            const x = fix(a * 67108864.0 + b);
            const y = fix(1.0 / 9007199254740992.0);
            const result = fix(x * y);
            return result;
        };
        /*
         * If `seed` is empty, return the current seed.
         * Otherwise, initialize the instance with a new seed.
         * Creates a random seed if one isn't provided.
         */
        this.seed = ($seed) => {
            if ($seed !== undefined && $seed !== null)
                $private.init($seed);
            return $state.seed;
        };
        $private.init(seed);
    }
    /**
     * Generate a random seed array using `window.crypto`. Fallback to
     * `node.crypto`. Fallback to array filled via `Math.random()`.
     * @returns {number[]}
     */
    static createRandomSeed() {
        const max = 623;
        const min = 20;
        const len = Math.floor(Math.random() * Math.floor(max - min)) + min;
        try {
            /* Use `window.crypto` if available. */
            if (window?.crypto) {
                return [...window.crypto.getRandomValues(new Uint32Array(len))];
            }
        }
        catch {
            //
        }
        /* Else use `node.crypto.randomFillSync()`. */
        let crypto;
        try {
            /* eslint-disable-next-line global-require */
            crypto = require("crypto");
            const buf = Buffer.alloc(len);
            return [...crypto.randomFillSync(buf)];
        }
        catch {
            /* Else use `Math.random()`. */
            const randomInt = () => {
                const rand = Math.random().toFixed(4);
                return Math.floor(Number(rand)) * 1000;
            };
            return new Array(len).fill(0).map(() => randomInt());
        }
    }
}
exports.Uniform = Uniform;
//# sourceMappingURL=Uniform.js.map