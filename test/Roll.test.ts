/**
 * @file Roll.test.ts
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview
 */

import { describe, it } from "mocha";
import { expect } from "chai";
import { Roll, Seed } from "../src/lib/Roll";

describe(`Roll`, () => {
  /* Generate a random integer 0-100 */
  const randomInt = () => {
    return Math.floor(Number(Math.random().toFixed(4)) * 100);
  };

  describe(`randomInt helper function`, () => {
    /**
     * Ensure the helper function generating random integers
     * 0-1000 works as intended.
     */
    it(`should return a random integer 0-100`, () => {
      const ints = new Array(100).fill(null).map((x) => randomInt());
      ints.forEach((int) => {
        expect(Number.isSafeInteger(int)).to.equal(true);
        expect(int).to.be.at.least(0);
        expect(int).to.be.at.most(100);
      });
    });
  });

  describe(`basic use`, () => {
    /**
     * Roll 100 randoms using .uniform(), and 100 rolls using its alias
     * .random(). Retrieve the Roll instance history and filter out
     * any values > 1 or < 0.
     * Expect the history array and filtered array to remain equal.
     */
    it(`should generate random numbers normalized 0-1`, () => {
      const roll = new Roll();
      let rolls = 100;
      let rolls2 = 100;
      while (rolls--) roll.random();
      while (rolls2--) roll.uniform();
      const randoms = roll.history();
      const filter = randoms.filter((number) => number <= 1 && number >= 0);
      expect(filter).to.have.lengthOf(randoms.length);
    });

    /**
     * Generate 20 sets of 20 rolls each.
     * Expect each set of 20 to be unique from all other sets.
     */
    it(`should generate convincing random psuedorandomness`, () => {
      const nullArray = (len: number) => new Array(len).fill(null);
      const roll = new Roll();
      const count = 20;

      const getRolls = () => nullArray(count).map((x) => roll.random());
      const aHundredSetsOfRolls = nullArray(count).map((x) => getRolls());

      const uniqueSet = [...new Set(aHundredSetsOfRolls)];
      expect(uniqueSet).to.deep.equal(aHundredSetsOfRolls);
    });
  });

  describe(`seed behavior`, () => {
    /**
     * Generate 10 instances of Roll and ensure they each have
     * and return a random seed.
     */
    it(`should autogenerate a random seed if one is not provided`, () => {
      const kdrolls = new Array(10).fill(null).map((x) => new Roll());
      const seeds = kdrolls.map((roll) => roll.seed());
      const filtered = seeds.filter((x) => x !== undefined && x !== null);
      expect(filtered).to.have.lengthOf(kdrolls.length);
    });

    /**
     * Seed Roll instance with an integer.
     * Expect the instance seed to equal the passed seed.
     * Expect the instance to return random numbers.
     */
    it(`should allow an integer to be passed as a seed`, () => {
      const seed = 1;
      const roll = new Roll({ seed });
      expect(roll.seed()).to.deep.equal(seed);
      expect(roll.random()).to.be.a("number");
    });

    /**
     * Seed Roll instance with an array of integers.
     * Expect the instance seed to equal the passed seed.
     * Expect the instance to return random numbers.
     */
    it(`should allow an array of integers to be passed as a seed`, () => {
      const seed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const roll = new Roll({ seed });
      expect(roll.seed()).to.deep.equal(seed);
      expect(roll.random()).to.be.a("number");
    });

    /**
     * The static method createRandomSeed should be able to
     * generate random seed arrays for independent external reference.
     */
    it(`should be able to generate random seed arrays`, () => {
      const seed = Roll.createRandomSeed();
      expect(seed).to.have.length.greaterThan(0);
      seed.forEach((num) => expect(Number.isSafeInteger(num)).to.equal(true));
    });

    /**
     * Floating point numbers passed as seeds should be rounded
     * to the nearest integer.
     */
    it("should convert floating point numbers", () => {
      const int = 123;
      const dec = 0.45678;
      const seed = int + dec;
      const roll = new Roll({ seed });
      expect(roll.seed()).to.deep.equal(int);
    });

    /**
     * Floating point numbers in a seed array should each be rounded
     * to the nearest integer.
     */
    it("should convert floating point numbers", () => {
      const seed = [123.456, 456.789, 789.0123];
      const expected = [123, 457, 789];
      const roll = new Roll({ seed });
      expect(roll.seed()).to.deep.equal(expected);
    });

    /**
     * Negative numbers passed as seeds should be converted to
     * unsigned integers.
     */
    it("should convert negative numbers", () => {
      const seed = -123;
      const expected = 123;
      const roll = new Roll({ seed });
      expect(roll.seed()).to.deep.equal(expected);
    });

    /**
     * Negative numbers passed in a seed array should each be converted
     * to unsigned integers.
     */
    it("should convert negative numbers in arrays", () => {
      const seed = [-123, -456, -789];
      const expected = [123, 456, 789];
      const roll = new Roll({ seed });
      expect(roll.seed()).to.deep.equal(expected);
    });

    /**
     * Negative floating point numbers passed as seeds should be
     * converted to unsigned integers.
     */
    it("should convert negative floating point nums", () => {
      const seed = -123.456;
      const expected = 123;
      const roll = new Roll({ seed });
      expect(roll.seed()).to.deep.equal(expected);
    });

    /**
     * Negative floating point numbers passed in seed arrays should
     * be converted to unsigned integers.
     */
    it("should convert negative floating point nums in arrays", () => {
      const seed = [-123.456, -456.789, -789.0123];
      const expected = [123, 457, 789];
      const roll = new Roll({ seed });
      expect(roll.seed()).to.deep.equal(expected);
    });

    const warning = "NOTICE: This test should create a warning in the console.";
    /**
     * Following conversions, only safe integers should be allowed.
     * If the seed integer is larger than MAX_SAFE_INTEGER, it will
     * generate a random seed array instead.
     */
    it("should only allow safe integers", () => {
      const maxSafeInt = () => Number.MAX_SAFE_INTEGER;
      const unsafeInt = () => Math.pow(2, 53);
      console.warn(warning);
      const rollSafe = new Roll({ seed: maxSafeInt() });
      const rollUnsafe = new Roll({ seed: unsafeInt() });
      expect(rollSafe.seed()).to.deep.equal(maxSafeInt());
      expect(rollUnsafe.seed()).to.not.deep.equal(unsafeInt());
      expect(rollUnsafe.seed()).to.have.length.greaterThan(0);
    });

    /**
     * If an integer larger than MAX_SAFE_INTEGER is included in
     * a seed array, it will generate a random seed array instead.
     */
    it("should only allow safe integers in arrays", () => {
      const maxSafeInt = () => Number.MAX_SAFE_INTEGER;
      const unsafeInt = () => Math.pow(2, 53);
      console.warn(warning);
      const seed = [maxSafeInt(), unsafeInt()];
      const roll = new Roll({ seed });
      expect(roll.seed()).to.not.deep.equal(seed);
      expect(roll.seed()).to.have.length.greaterThan(0);
    });

    /**
     * If an empty array is passed as a seed, it should generate
     * a random seed instead.
     */
    it(`should not allow empty arrays`, () => {
      const seed: Seed = [];
      console.warn(warning);
      const roll = new Roll({ seed });
      expect(roll.seed()).to.not.deep.equal(seed);
      expect(roll.seed()).to.have.length.greaterThan(0);
    });

    /**
     * NaN and Infinity should not be allowed.
     * It should generate a random seed instead.
     */
    it(`should not allow unsafe numbers`, () => {
      const nan = NaN;
      const inf = Infinity;
      const und = undefined;
      console.warn(warning);
      const rollNaN = new Roll({ seed: nan });
      console.warn(warning);
      const rollInf = new Roll({ seed: inf });
      const rollUnd = new Roll({ seed: und });
      expect(rollNaN.seed()).to.not.deep.equal(nan);
      expect(rollInf.seed()).to.not.deep.equal(inf);
      expect(rollUnd.seed()).to.not.deep.equal(und);
      expect(rollNaN.seed()).to.have.length.greaterThan(0);
      expect(rollInf.seed()).to.have.length.greaterThan(0);
      expect(rollUnd.seed()).to.have.length.greaterThan(0);
    });

    /**
     * Seed a single Roll instance with various number[] and integers.
     * Expect .seed() to return the new seed after each re-seed.
     * Expect the Roll instance .random() to return a number normalized 0-1
     * after each re-seed.
     */
    it(`should be able to be re-seeded with explicit seeds`, () => {
      const rolls: number[] = [];

      /* Generate a random seed array of random length */
      const seed = new Array(randomInt() + 1)
        .fill(null)
        .map((x) => randomInt());

      /* Seed Roll instance with array an store a random number */
      const roll = new Roll({ seed });
      expect(roll.seed()).to.deep.equal(seed);
      rolls.push(roll.random());

      /* Seed Roll instance with each integer in the array 
      and store a random number for each */
      seed.forEach((num) => {
        roll.seed(num);
        expect(roll.seed()).to.deep.equal(num);
        rolls.push(roll.random());
      });

      /* Generate a different random seed array of random length */
      const seed2 = new Array(randomInt() + 1)
        .fill(null)
        .map((x) => randomInt());

      /* Seed Roll instance with a new seed array and store
      a random number */
      roll.seed(seed2);
      expect(roll.seed()).to.deep.equal(seed2);
      rolls.push(roll.random());

      /* Expect each stored number to fit the random number criteria */
      rolls.forEach((num) => {
        expect(num).to.be.a("number");
        expect(num).to.be.at.least(0);
        expect(num).to.be.at.most(1);
      });
    });
  });

  describe(`seed effect on pseudo-random number sequence`, () => {
    /* Create three instances with the same seed and roll each ten times. */
    const get30RandomValuesForSeed = (seed: Seed) => {
      const roll1 = new Roll({ seed });
      const roll2 = new Roll({ seed });
      const roll3 = new Roll({ seed });

      const handleRolls = (roller: Roll) => {
        let count = 10;
        while (count--) roller.random();
        return roller.history();
      };

      const rolls1 = handleRolls(roll1);
      const rolls2 = handleRolls(roll2);
      const rolls3 = handleRolls(roll3);

      return [rolls1, rolls2, rolls3];
    };

    /* Per seed, expect each collection of 90 values to be equal. */
    const compareResultsPerSeed = (seed: Seed) => {
      const results = [
        get30RandomValuesForSeed(seed),
        get30RandomValuesForSeed(seed),
        get30RandomValuesForSeed(seed),
      ];

      /* Compare the results and expect them all to be equal. */
      const map = results.map((x) => JSON.stringify(x));
      const uniqueSet = [...new Set(map)];
      expect(uniqueSet).to.have.lengthOf(1);

      return results;
    };

    /**
     * For various seeds, create 3 instances of Roll seeded with the same
     * value.
     * Expect each of those instances to independently generate the same
     * sequence of numbers.
     * Expect the sequences for each seed value to be different from each other.
     */
    it(`should generate the same random sequence for each unique seed`, () => {
      /* Given different seeds, expect the outputs to each be unique. */
      const results = [
        compareResultsPerSeed(1),
        compareResultsPerSeed(2),
        compareResultsPerSeed(3),
        compareResultsPerSeed([1, 2, 3]),
        compareResultsPerSeed([5, 7, 8]),
        compareResultsPerSeed([1101, 25, 99637]),
      ];

      const map = results.map((x) => JSON.stringify(x));
      const uniqueSet = [...new Set(map)];
      expect(uniqueSet).to.have.lengthOf(results.length);
    });

    /**
     * For various random seeds, create 3 instances of Roll seeded with the
     * same value.
     * Expect each of those instances to independently generate the same
     * sequence of numbers.
     * Expect the sequences for each seed value to be different from each other.
     */
    it(`should generate different random numbers given different seeds`, () => {
      /* Generate 10 random, unique seeds. */
      const getUniqueRandomSeeds = () => {
        /* Generate 10 random seeds or random length. */
        const getSeeds = () => {
          return new Array(10).fill(null).map((x) => {
            return new Array(randomInt() + 1)
              .fill(null)
              .map((x) => randomInt());
          });
        };

        /* Absolutely ensure all random seeds are unique. */
        const ensureAllMembersAreUnique = (arr: number[][]) => {
          const uniqueSet = [...new Set(arr.map((x) => JSON.stringify(x)))];
          return uniqueSet.length === arr.length;
        };

        let seeds = getSeeds();

        /* Re-generate seeds until there are 10 unique seeds. */
        const checkSeeds = () => {
          if (ensureAllMembersAreUnique(seeds)) {
            return seeds;
          } else {
            seeds = getSeeds();
            checkSeeds();
          }
        };

        seeds = checkSeeds() || seeds;
        return seeds;
      };

      /* Expect the sets of random numbers from each unique seed to be unique */
      const map = getUniqueRandomSeeds().map((x) => compareResultsPerSeed(x));
      const strings = map.map((x) => JSON.stringify(x));
      const uniqueSet = [...new Set(strings)];
      expect(uniqueSet).to.have.lengthOf(map.length);
    });
  });

  describe(`history functionality`, () => {
    const defaultMaxHistory = Infinity;
    /**
     * Expect a new instance to have and return a default max history.
     */
    it(`should default to a max history of ${defaultMaxHistory}`, () => {
      const roll = new Roll();
      let max = roll.maxHistory();
      expect(max).to.equal(defaultMaxHistory);
    });

    /**
     * Set the max history and expect it to return the new value.
     * Roll n times where n is the new max history + 100 and expect
     * the history length to still equal the new max history value.
     */
    it(`should allow the max history to be changed`, () => {
      const roll = new Roll();
      expect(roll.maxHistory()).to.equal(defaultMaxHistory);
      const newMax = randomInt() + 1;
      roll.maxHistory(newMax);
      expect(roll.maxHistory()).to.equal(newMax);

      let count = newMax + 100;
      while (count--) roll.random();
      expect(roll.history().length).to.equal(newMax);
    });

    /**
     * When a roll is made while the history length is equal to the max
     * history, the history array should remove the first element and
     * make room for the new element.
     * After generating n random numbers where n is the default max history,
     * expect the history length to equal the max history value.
     * After each subsequent roll, expect the first element to be
     * discarded, other elements to move up one index position,
     * and the new element to be pushed into the last position.
     */
    it(`should make room if max is reached`, () => {
      const maxHistory = 1000;
      const roll = new Roll({ maxHistory });

      const rollUntilMaxed = () => {
        let max = roll.maxHistory();
        while (max--) roll.random();
        expect(roll.history()).to.have.lengthOf(maxHistory);
      };

      const rollAgain = () => {
        const getValues = () => {
          const history = roll.history();
          return {
            first: history[0],
            second: history[1],
            secondToLast: history[history.length - 2],
            last: history[history.length - 1],
          };
        };

        const initial = getValues();
        const rand = roll.random();
        const afterOneMoreRoll = getValues();
        expect(roll.history()).to.have.lengthOf(maxHistory);
        expect(afterOneMoreRoll.first).to.equal(initial.second);
        expect(initial.last).to.equal(afterOneMoreRoll.secondToLast);
        expect(afterOneMoreRoll.last).to.equal(rand);
      };

      let count = 5;
      rollUntilMaxed();
      while (count--) rollAgain();
    });

    /**
     * After rolling 100 times, expect the history length to be 100.
     * After calling clearHistory(), expect the history length to be 0.
     */
    it(`should be possible to clear the history`, () => {
      const roll = new Roll();
      expect(roll.history()).to.have.lengthOf(0);

      const loops = 10;
      let count = loops;
      while (count--) roll.random();
      expect(roll.history()).to.have.lengthOf(loops);

      roll.clearHistory();
      expect(roll.history()).to.have.lengthOf(0);
    });

    /**
     * After setting a new maxHistory and then calling clearHistory(),
     * expect the maxHistory to still be the custom value.
     */
    it(`should retain a custom maxSize when history is cleared`, () => {
      const roll = new Roll();
      expect(roll.maxHistory()).to.equal(defaultMaxHistory);

      const newMax = 100;
      roll.maxHistory(newMax);
      roll.random();
      roll.clearHistory();
      expect(roll.maxHistory()).to.equal(newMax);
    });
  });

  describe(`transformation helpers`, () => {
    /**
     * Using the static method Roll.clip(), expect the
     * returned value to always be within the given min/max.
     */
    it(`should allow number clipping/clamping`, () => {
      const roll = new Roll();

      const tests: {
        min: number;
        max: number;
      }[] = [
        {
          min: 0.3,
          max: 0.8,
        },
        {
          min: 0.1,
          max: 0.9,
        },
        {
          min: 0.55,
          max: 0.76271,
        },
        {
          min: 1,
          max: 10,
        },
        {
          min: 11,
          max: 101,
        },
      ];

      tests.forEach((test) => {
        const { min, max } = test;
        let loops = 100;
        while (loops--) {
          const clipped = Roll.clip(roll.random(), [min, max]);
          expect(clipped).to.be.at.least(min);
          expect(clipped).to.be.at.most(max);
        }
      });
    });

    /**
     * Given an initial range and target range, a number should
     * be able to be scaled proportionately.
     */
    it(`should allow number range scaling`, () => {
      const tests: {
        value: number;
        initialRange: [number, number];
        targetRange: [number, number];
        expected: number;
      }[] = [
        {
          value: 0,
          initialRange: [-1, 1],
          targetRange: [0, 1],
          expected: 0.5,
        },
        {
          value: 0.5,
          initialRange: [0, 1],
          targetRange: [-1, 1],
          expected: 0,
        },
        {
          value: 0.45,
          initialRange: [0, 1],
          targetRange: [0, 100],
          expected: 45,
        },
        {
          value: 45,
          initialRange: [0, 100],
          targetRange: [0, 1],
          expected: 0.45,
        },
        {
          value: 12,
          initialRange: [0, 1000],
          targetRange: [0, 10],
          expected: 0.12,
        },
        {
          value: 12975.2123,
          initialRange: [0, 9001],
          targetRange: [0, 1],
          expected: 1.4415300855460504,
        },
        {
          value: 55,
          initialRange: [2.3, 98.6],
          targetRange: [33.42, 87.55],
          expected: 63.04254413291797,
        },
        {
          value: 0.5,
          initialRange: [0, 1],
          targetRange: [5, 72],
          expected: 38.5,
        },
      ];

      tests.forEach((test) => {
        const { value, initialRange, targetRange, expected } = test;
        const scaled = Roll.scale(value, initialRange, targetRange);
        expect(scaled).to.equal(expected);
      });
    });

    /**
     * Given a value and a target number of decimal places, the static
     * method Roll.round() should appropriately round the number to
     * the target places. Values >= 5 are rounded up.
     */
    it(`should be able to round numbers to a given number of places`, () => {
      const tests: {
        value: number;
        places: number;
        expected: number;
      }[] = [
        {
          value: 0.5,
          places: 0,
          expected: 1,
        },
        {
          value: 0.4,
          places: 0,
          expected: 0,
        },
        {
          value: 0.149,
          places: 1,
          expected: 0.1,
        },
        {
          value: 0.15,
          places: 1,
          expected: 0.2,
        },
        {
          value: 0.123456,
          places: 3,
          expected: 0.123,
        },
        {
          value: 0.456789,
          places: 3,
          expected: 0.457,
        },
        {
          value: 11.298317,
          places: 1,
          expected: 11.3,
        },
        {
          value: 1928.9998,
          places: 0,
          expected: 1929,
        },
        {
          value: -1.000007,
          places: 5,
          expected: -1.00001,
        },
      ];

      tests.forEach((test) => {
        const { value, places, expected } = test;
        const rounded = Roll.round(value, places);
        expect(rounded).to.equal(expected);
      });
    });

    describe(`basic stats on arrays`, () => {
      /**
       * Given an array, Roll should be able to calculate basic
       * statistics for the array. Standard deviation is always
       * normalized 0-1.
       */
      it(`should calculate state on arrays passed as an arg`, () => {
        const tests: {
          arr: number[];
          expectedMean: number;
          expectedMedian: number;
          expectedModes: number[];
          expectedStd: number;
        }[] = [
          {
            arr: [0, 1],
            expectedMean: 0.5,
            expectedMedian: 0.5,
            expectedModes: [0, 1],
            expectedStd: 0.5,
          },
          {
            arr: [0, 1, 2],
            expectedMean: 1,
            expectedMedian: 1,
            expectedModes: [0, 1, 2],
            expectedStd: 0.408248290463863,
          },
          {
            arr: [1, 2, 3, 4, 5],
            expectedMean: 3,
            expectedMedian: 3,
            expectedModes: [1, 2, 3, 4, 5],
            expectedStd: 0.282842712474619,
          },
          {
            arr: [1, 2, 2, 3, 4, 5],
            expectedMean: 2.8333333333333335,
            expectedMedian: 2.5,
            expectedModes: [2],
            expectedStd: 0.26874192494328497,
          },
          {
            arr: [1, 1, 1, 1, 1, 1, 1, 1, 1],
            expectedMean: 1,
            expectedMedian: 1,
            expectedModes: [1],
            expectedStd: 0,
          },
          {
            arr: [11, 24, 4, 3.21, 24, 40.9191, 0.12909, 11],
            expectedMean: 14.78227375,
            expectedMedian: 11,
            expectedModes: [11, 24],
            expectedStd: 0.317061252161967,
          },
        ];

        const roll = new Roll();

        tests.forEach((test) => {
          const {
            arr,
            expectedMean,
            expectedMedian,
            expectedModes,
            expectedStd,
          } = test;
          expect(roll.mean(arr)).to.equal(expectedMean);
          expect(roll.median(arr)).to.equal(expectedMedian);
          expect(roll.modes(arr)).to.deep.equal(expectedModes);
          expect(roll.stdDev(arr)).to.equal(expectedStd);
        });
      });
    });

    /**
     * If no argument is passed to the stats methods, Roll instances
     * automatically target their own internal history.
     */
    it(`should calculate stats on its own history if no arg`, () => {
      const roll = new Roll();
      let count = 99;
      while (count--) roll.random();
      const mean = roll.mean();
      const median = roll.median();
      const modes = roll.modes();
      const stdv = roll.stdDev();
      expect(mean).to.be.a("number");
      expect(median).to.be.a("number");
      expect(modes).to.be.instanceOf(Array);
      expect(stdv).to.be.a("number");
    });
  });

  describe(`die roll metaphor`, () => {
    /**
     * Given an arbitrary number of sides, the .d() method should
     * generate random integers in the range 1-sides.
     */
    it(`should generate random integers in a given range 1-n`, () => {
      const roll = new Roll();
      const tests = [6, 8, 10, 12, 20, 99, 1, 819276];
      const loops = 20;

      tests.forEach((sides) => {
        let count = loops;
        while (count--) {
          const result = roll.d(sides);
          expect(Number.isSafeInteger(result)).to.equal(true);
          expect(result).to.be.at.least(1);
          expect(result).to.be.at.most(sides);
        }
        expect(roll.history()).to.have.lengthOf(loops);
        roll.clearHistory();
      });
    });
  });

  describe(`distribution models`, () => {
    /**
     * Uniform distribution expects a mean and median of ~0.5 with a
     * standard deviation ~0.285.
     * Here we do 100 loops of 1000 rolls each and test that the relevant values
     * are in range.
     */
    it(`should use uniform distribution by default`, () => {
      const expected = {
        meanRange: [0.4, 0.6],
        medianRange: [0.4, 0.6],
        stdvRange: [0.27, 0.31],
      };

      let loops = 10;
      while (loops--) {
        const roll = new Roll();

        let count = 1000;
        while (count--) roll.random();

        const mean = roll.mean();
        expect(mean).to.be.at.least(expected.meanRange[0]);
        expect(mean).to.be.at.most(expected.meanRange[1]);

        const median = roll.median();
        expect(median).to.be.at.least(expected.medianRange[0]);
        expect(median).to.be.at.most(expected.medianRange[1]);

        const stdv = roll.stdDev();
        expect(stdv).to.be.at.least(expected.stdvRange[0]);
        expect(stdv).to.be.at.most(expected.stdvRange[1]);
      }
    });

    /**
     * Gaussian distribution accounts for a skew to "curve" or weight
     * the values closer to 0 or 1. For each test case, we do 100 loops
     * of 1000 rolls each, and ensure the relevant values are within
     * acceptable expected ranges.
     */
    it(`should allow for variable skew gaussian distribution`, () => {
      const tests = [
        {
          skew: 0,
          expectedRanges: {
            mean: [0.475, 0.525],
            median: [0.475, 0.525],
            stdv: [0.09, 0.14],
          },
        },
        {
          skew: 0.5,
          expectedRanges: {
            mean: [0.225, 0.525],
            median: [0.225, 0.525],
            stdv: [0.05, 0.2],
          },
        },
        {
          skew: 0.75,
          expectedRanges: {
            mean: [0.12, 0.16],
            median: [0.11, 0.15],
            stdv: [0.01, 0.2],
          },
        },
        {
          skew: -0.25,
          expectedRanges: {
            mean: [0.55, 0.65],
            median: [0.55, 0.65],
            stdv: [0.08, 0.12],
          },
        },
        {
          skew: -0.98,
          expectedRanges: {
            mean: [0.975, 0.999],
            median: [0.975, 0.999],
            stdv: [0.001, 0.007],
          },
        },
      ];

      tests.forEach((test) => {
        const { skew, expectedRanges } = test;

        let loops = 10;
        while (loops--) {
          const roll = new Roll();

          let count = 1000;
          while (count--) roll.gaussian(skew);

          const mean = roll.mean();
          expect(mean).to.be.at.least(expectedRanges.mean[0]);
          expect(mean).to.be.at.most(expectedRanges.mean[1]);

          const median = roll.median();
          expect(median).to.be.at.least(expectedRanges.median[0]);
          expect(median).to.be.at.most(expectedRanges.median[1]);

          const stdv = roll.stdDev();
          expect(stdv).to.be.at.least(expectedRanges.stdv[0]);
          expect(stdv).to.be.at.most(expectedRanges.stdv[1]);
        }
      });
    });
  });
});
