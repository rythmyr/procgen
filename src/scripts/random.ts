export default class Random {
  state1: number;
  state2: number;

  constructor(seed?: any) {
    if (seed) {
      // added these for eslint to stop yelling at me for not assigning in the constructor
      // even though they are assigned in seed();
      this.state1 = 0;
      this.state2 = 0;

      this.seed(seed);
    } else {
      this.state1 = (new Date()).getTime();
      this.state2 = (new Date()).getTime();
    }
  }

  seed(seed: any): void {
    const stringSeed = JSON.stringify(seed);
    if (stringSeed === undefined) {
      this.state1 = 0;
      this.state2 = 0;
      return;
    }
    let num = 0;
    for (const char of stringSeed) {
      const code = char.charCodeAt(0);
      num = (num * 5) + code; // eslint-disable-line no-bitwise
      num = num >>> 0; // eslint-disable-line no-bitwise
    }
    this.state1 = num;
    for (const char of stringSeed) {
      const code = char.charCodeAt(0);
      num += code * 123825601;
      num += 38106753801;
      num = num >>> 0; // eslint-disable-line no-bitwise
    }
    this.state2 = num;
  }

  setState(state1: number | {state1: number; state2: number}, state2: number): void {
    if (typeof state1 === 'number') {
      this.state1 = state1;
      this.state2 = state2;
    } else {
      this.state1 = state1.state1;
      this.state2 = state1.state2;
    }
  }

  getState(): { state1: number; state2: number } {
    return { state1: this.state1, state2: this.state2 };
  }

  next(): number {
    const tmp = this.state1 * 183205671807 + this.state2 * 13805688013;
    this.state1 = this.state2;
    this.state2 = tmp % Number.MAX_SAFE_INTEGER; // eslint-disable-line no-bitwise
    return this.state2 / Number.MAX_SAFE_INTEGER;
  }
}

