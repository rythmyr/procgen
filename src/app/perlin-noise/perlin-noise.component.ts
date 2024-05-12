import * as Three from 'three';
import { Component, OnInit } from '@angular/core';
import { chunkDataDefaults, defaultData, IChunkData, IWorldData, worldDataDefaults } from '../models/chunk-data.model';
import Noise from 'src/scripts/noise';

@Component({
  selector: 'pg-perlin-noise',
  templateUrl: './perlin-noise.component.html',
  styleUrls: ['./perlin-noise.component.scss']
})
export class PerlinNoiseComponent implements OnInit {
  worldData!: IWorldData;
  logFrameCount = false;
  frameCount = 0;

  redValueRange = 0;
  redValueOffset = 0;
  blueValueRange = 0;
  blueValueOffset = 0;
  greenValueRange = 0;
  greenValueOffset = 0;

  noise: Noise = new Noise();

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
    this.redValueRange = Math.random();
    this.blueValueRange = Math.random();
    this.greenValueRange = Math.random();

    this.redValueOffset = Math.random() * (1 - this.redValueRange);
    this.blueValueOffset = Math.random() * (1 - this.blueValueRange);
    this.greenValueOffset = Math.random() * (1 - this.greenValueRange);

    // generate world data
    const xzMin = -8;
    const xzMax = 8;
    const yMin = 0;
    const yMax = 16;

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


          const domainOffsetX = (this.noise.noise2d(
            worldY / blockDomainWarpOffsetPeriod,
            worldZ / blockDomainWarpOffsetPeriod
          ) - .5) * blockDomainWarpRange;
          const domainOffsetY = (this.noise.noise2d(
            worldX / blockDomainWarpOffsetPeriod,
            worldZ / blockDomainWarpOffsetPeriod
          ) - .5) * blockDomainWarpRange;
          const domainOffsetZ = (this.noise.noise2d(
            worldX / blockDomainWarpOffsetPeriod,
            worldY / blockDomainWarpOffsetPeriod
          ) - .5) * blockDomainWarpRange;

          const colorDomainOffsetX = (this.noise.noise2d(
            worldY / colorDomainWarpOffsetPeriod,
            worldZ / colorDomainWarpOffsetPeriod
          ) - .5) * colorDomainWarpRange;
          const colorDomainOffsetY = (this.noise.noise2d(
            worldX / colorDomainWarpOffsetPeriod,
            worldZ / colorDomainWarpOffsetPeriod
          ) - .5) * colorDomainWarpRange;
          const colorDomainOffsetZ = (this.noise.noise2d(
            worldX / colorDomainWarpOffsetPeriod,
            worldY / colorDomainWarpOffsetPeriod
          ) - .5) * colorDomainWarpRange;

          let yContrib = 0;
          if (worldY > 0 && worldY < 160) {
            yContrib = worldY / 160;
          } else if ( worldY >= 160) {
            yContrib = 1;
          }

          const perlinValue1 = this.noise.noise3d(
            (worldX + domainOffsetX) / blockValuePeriod,
            (worldY + domainOffsetY) / blockValuePeriod,
            (worldZ + domainOffsetZ) / blockValuePeriod
          ) * yContrib;

          const perlinValue2 = this.noise.noise3d(
            (worldX + domainOffsetX) / blockValuePeriod * 4,
            (worldY + domainOffsetY) / blockValuePeriod * 4,
            (worldZ + domainOffsetZ) / blockValuePeriod * 4
          );

          const perlinValue3 = this.noise.noise3d(
            (worldX + domainOffsetX) / blockValuePeriod * 16,
            (worldY + domainOffsetY) / blockValuePeriod * 16,
            (worldZ + domainOffsetZ) / blockValuePeriod * 16
          );

          const perlinValue = (perlinValue1 * .6 + perlinValue2 * .3 + perlinValue3 * .1);

          const chunkVoxelIndex = voxelDataIndex(x, y, z);
          if (perlinValue <= blockThreshold) {
            const r = this.noise.noise2d(
              (worldX + colorDomainOffsetX) / colorValuePeriod,
              (worldY + colorDomainOffsetY) / colorValuePeriod
            ) * this.redValueRange + this.redValueOffset;
            const g = this.noise.noise2d(
              (worldY + colorDomainOffsetY) / colorValuePeriod,
              (worldZ + colorDomainOffsetZ) / colorValuePeriod
            ) * this.greenValueRange + this.greenValueOffset;
            const b = this.noise.noise2d(
              (worldX + colorDomainOffsetX) / colorValuePeriod,
              (worldZ + colorDomainOffsetZ) / colorValuePeriod
            ) * this.blueValueRange + this.blueValueOffset;

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
}
