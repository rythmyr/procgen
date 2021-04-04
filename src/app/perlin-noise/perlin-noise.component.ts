import * as Three from 'three';
import { Component, OnInit } from '@angular/core';
import { chunkDataDefaults, defaultData, IChunkData, IWorldData, worldDataDefaults } from '../models/chunk-data.model';

@Component({
  selector: 'pg-perlin-noise',
  templateUrl: './perlin-noise.component.html',
  styleUrls: ['./perlin-noise.component.scss']
})
export class PerlinNoiseComponent implements OnInit {
  worldData!: IWorldData;
  logFrameCount = false;
  frameCount = 0;

  noiseSampleArray: number[] = [];

  constructor() { }

  timeThis(fn: () => void): number {
    const clock = new Three.Clock();
    clock.start();

    fn();

    const time = clock.getElapsedTime();
    clock.stop();

    return time;
  }

  onFrameCountUpdate(frameCount: number): void {
    this.frameCount = frameCount;
  }

  ngOnInit(): void {
    // noise sample value prefill
    for (let i = 0; i < 256; i++) {
      this.noiseSampleArray[i] = i;
    }

    // noise sample value shuffle
    for (let i = 0; i < 256; i++) {
      const swapIndex = Math.floor(Math.random() * 256);
      const temp = this.noiseSampleArray[i];
      this.noiseSampleArray[i] = this.noiseSampleArray[swapIndex];
      this.noiseSampleArray[swapIndex] = temp;
    }

    // generate world data
    const xzMin = -5;
    const xzMax = 5;
    const yMin = 0;
    const yMax = 20;

    const elapsed = this.timeThis(() => {
      this.worldData = defaultData({}, worldDataDefaults);
      this.worldData.chunkDataMap = {};
      for (let x = xzMin; x < xzMax; x++) {
        this.worldData.chunkDataMap[x] = {};
        for (let y = yMin; y < yMax; y++) {
          this.worldData.chunkDataMap[x][y] = {};
          for (let z = xzMin; z < xzMax; z++) {
            const chunkData: IChunkData = defaultData({
              position: new Three.Vector3(x, y, z)
            }, chunkDataDefaults);
            this.generateChunkVoxelData(chunkData, this.worldData.chunkSize);
            this.worldData.chunkDataMap[x][y][z] = chunkData;
            this.worldData.chunkDataArray.push(chunkData);
          }
        }
      }
    });
    console.log(`generation of block data took ${elapsed} seconds`);
  }

  generateChunkVoxelData(chunkData: IChunkData, chunkSize: number): void {
    chunkData.voxelData = [];
    const voxelDataIndex: (x: number, y: number, z: number) => number = (x, y, z) => {
      if (x >= chunkSize || y >= chunkSize || z >= chunkSize || x < 0 || y < 0 || z < 0) {
        return -1;
      }
      return x * chunkSize * chunkSize + y * chunkSize + z;
    };

    const toWorldCoords = (chunkPos: number, localPos: number) => (chunkPos * chunkSize) + localPos;

    const blockValuePeriod = 960;
    const blockDomainWarpOffsetPeriod = 640;
    const blockDomainWarpRange = 40;
    const blockThreshold = .4;

    const colorValuePeriod = 960;
    const colorDomainWarpOffsetPeriod = 20;
    const colorDomainWarpRange = 40;

    for (let x = 0; x < chunkSize; x++) {
      const worldX = toWorldCoords(chunkData.position.x, x);
      for (let z = 0; z < chunkSize; z++) {
        const worldZ = toWorldCoords(chunkData.position.z, z);
        for (let y = 0; y < chunkSize; y++) {
          const worldY = toWorldCoords(chunkData.position.y, y);


          const domainOffsetX = (this.noise2d(
            worldY / blockDomainWarpOffsetPeriod,
            worldZ / blockDomainWarpOffsetPeriod
          ) - .5) * blockDomainWarpRange;
          const domainOffsetY = (this.noise2d(
            worldX / blockDomainWarpOffsetPeriod,
            worldZ / blockDomainWarpOffsetPeriod
          ) - .5) * blockDomainWarpRange;
          const domainOffsetZ = (this.noise2d(
            worldX / blockDomainWarpOffsetPeriod,
            worldY / blockDomainWarpOffsetPeriod
          ) - .5) * blockDomainWarpRange;

          const colorDomainOffsetX = (this.noise2d(
            worldY / colorDomainWarpOffsetPeriod,
            worldZ / colorDomainWarpOffsetPeriod
          ) - .5) * colorDomainWarpRange;
          const colorDomainOffsetY = (this.noise2d(
            worldX / colorDomainWarpOffsetPeriod,
            worldZ / colorDomainWarpOffsetPeriod
          ) - .5) * colorDomainWarpRange;
          const colorDomainOffsetZ = (this.noise2d(
            worldX / colorDomainWarpOffsetPeriod,
            worldY / colorDomainWarpOffsetPeriod
          ) - .5) * colorDomainWarpRange;

          let yContrib = 0;
          if (worldY > 0 && worldY < 160) {
            yContrib = worldY / 160;
          } else if ( worldY >= 160) {
            yContrib = 1;
          }

          const perlinValue1 = this.noise3d(
            (worldX + domainOffsetX) / blockValuePeriod,
            (worldY + domainOffsetY) / blockValuePeriod,
            (worldZ + domainOffsetZ) / blockValuePeriod
          ) * yContrib;

          const perlinValue2 = this.noise3d(
            (worldX + domainOffsetX) / blockValuePeriod * 4,
            (worldY + domainOffsetY) / blockValuePeriod * 4,
            (worldZ + domainOffsetZ) / blockValuePeriod * 4
          );

          const perlinValue3 = this.noise3d(
            (worldX + domainOffsetX) / blockValuePeriod * 16,
            (worldY + domainOffsetY) / blockValuePeriod * 16,
            (worldZ + domainOffsetZ) / blockValuePeriod * 16
          );

          const perlinValue = (perlinValue1 * .6 + perlinValue2 * .3 + perlinValue3 * .1);

          const chunkVoxelIndex = voxelDataIndex(x, y, z);
          if (perlinValue <= blockThreshold) {
            const r = this.noise2d(
              (worldX + colorDomainOffsetX) / colorValuePeriod,
              (worldY + colorDomainOffsetY) / colorValuePeriod
            );
            const g = this.noise2d(
              (worldY + colorDomainOffsetY) / colorValuePeriod,
              (worldZ + colorDomainOffsetZ) / colorValuePeriod
            );
            const b = this.noise2d(
              (worldX + colorDomainOffsetX) / colorValuePeriod,
              (worldZ + colorDomainOffsetZ) / colorValuePeriod
            );

            chunkData.voxelData[chunkVoxelIndex] = {
              color: new Three.Color(r, g, b)
            };
          } else {
            chunkData.voxelData[chunkVoxelIndex] = {};
          }
        }
      }
    }
  }

  noiseSampleIndices(x: number, maxIndex: number): {low: number, high: number, alpha: number} {
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

  noiseLerp(start: number, end: number, alpha: number): number {
    const range = end - start;
    const add = alpha * range;
    return add + start;
  }

  noise3d(x: number, y: number, z: number): number {
    const xy = this.noise2d(x, y);
    const xz = this.noise2d(x, z);
    const yz = this.noise2d(y, z);

    return (xy + xz + yz) / 3;
  }
}
