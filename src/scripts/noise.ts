import Random from './random';

export default class Noise {
  private noiseSampleArray: number[] = [];

  constructor(seed?: any) {
    this.init(seed);
  }

  init(seed?: any) {
    const random = new Random(seed);

    for (let i = 0; i < 256; i++) {
      this.noiseSampleArray[i] = i;
    }

    // noise sample value shuffle
    for (let i = 0; i < 256; i++) {
      const swapIndex = Math.floor(random.next() * 256);
      const temp = this.noiseSampleArray[i];
      this.noiseSampleArray[i] = this.noiseSampleArray[swapIndex];
      this.noiseSampleArray[swapIndex] = temp;
    }
  }

  noise1d(x: number): number {
    const { low, high, alpha } = this.noiseSampleIndices(x, 256);
    return this.noiseLerp(this.noiseSampleArray[low], this.noiseSampleArray[high], alpha) / 256;
  }

  noise2d(x: number, y: number): number {
    const noiseSampleIndex = (nx: number, ny: number): number => nx * 16 + ny;

    const { low: xLow, high: xHigh, alpha: xAlpha } = this.noiseSampleIndices(x, 16);
    const { low: yLow, high: yHigh, alpha: yAlpha } = this.noiseSampleIndices(y, 16);

    const x1 = this.noiseLerp(
      this.noiseSampleArray[noiseSampleIndex(xLow, yLow)],
      this.noiseSampleArray[noiseSampleIndex(xHigh, yLow)],
      xAlpha
    );

    const x2 = this.noiseLerp(
      this.noiseSampleArray[noiseSampleIndex(xLow, yHigh)],
      this.noiseSampleArray[noiseSampleIndex(xHigh, yHigh)],
      xAlpha
    );

    return this.noiseLerp(x1, x2, yAlpha) / 256;
  }

  noise3d(x: number, y: number, z: number): number {
    const xy = this.noise2d(x, y);
    const xz = this.noise2d(x, z);
    const yz = this.noise2d(y, z);

    return (xy + xz + yz) / 3;
  }

  private noiseLerp(start: number, end: number, alpha: number): number {
    return ((end - start) * alpha) + start;
  }

  private noiseSampleIndices(x: number, maxIndex: number): {low: number; high: number; alpha: number} {
    x *= maxIndex;

    x = x % maxIndex;

    // x can be negative and infinitesimal (not 0), but adding 16 results in just 16
    // which would give "low" a value of 16 (not actually valid if maxIndex is 16)
    // if we add 16 before calling Math.floor on x
    let low = Math.floor(x);
    if (x < 0){
      x += maxIndex;
      low += maxIndex;
    }

    const high = low === maxIndex - 1 ? 0 : low + 1;
    const alpha = x - low;

    return { low, high, alpha };
  }
};
