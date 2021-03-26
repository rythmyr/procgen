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

  noiseSampleArray: number[] = [];

  constructor() { }

  ngOnInit(): void {
    // noise prefill
    for (let i = 0; i < 256; i++) {
      this.noiseSampleArray[i] = i;
    }

    // noise shuffle
    for (let i = 0; i < 256; i++) {
      const swapIndex = Math.floor(Math.random() * 256);
      const temp = this.noiseSampleArray[i];
      this.noiseSampleArray[i] = this.noiseSampleArray[swapIndex];
      this.noiseSampleArray[swapIndex] = temp;
    }

    // generate world data
    this.worldData = defaultData({}, worldDataDefaults);
    this.worldData.chunkDataMap = {};
    for (let x = -5; x < 5; x++) {
      this.worldData.chunkDataMap[x] = {};
      for (let y = 0; y < 10; y++) {
        this.worldData.chunkDataMap[x][y] = {};
        for (let z = -5; z < 5; z++) {
          const chunkData: IChunkData = defaultData({
            position: new Three.Vector3(x, y, z)
          }, chunkDataDefaults);
          this.generateChunkVoxelData(chunkData, this.worldData.chunkSize);
          this.worldData.chunkDataMap[x][y][z] = chunkData;
          this.worldData.chunkDataArray.push(chunkData);
        }
      }
    }
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

    for (let x = 0; x < chunkSize; x++) {
      for (let z = 0; z < chunkSize; z++) {
        const worldX = chunkSize * chunkData.position.x + x;
        const worldZ = chunkSize * chunkData.position.z + z;
        let height = this.noise2d(worldX / 80, worldZ / 80);
        height *= 35;

        for (let y = 0; y < chunkSize; y++) {
          const chunkVoxelIndex = voxelDataIndex(x, y, z);
          const worldY = toWorldCoords(chunkData.position.y, y);
          if (worldY <= height) {
            const colorVal = this.noise2d(worldX / 300, worldY / 300);
            chunkData.voxelData[chunkVoxelIndex] = {
              color: new Three.Color(colorVal, colorVal, colorVal)
            };
          } else {
            chunkData.voxelData[chunkVoxelIndex] = {};
          }
        }
      }
    }
  }

  noise2d(x: number, y: number): number {
    const noiseSampleIndex = (nx: number, ny: number): number => nx * 16 + ny;

    x *= 16;
    y *= 16;

    x = x % 16;
    y = y % 16;

    if (x < 0){ x += 16; }
    if (y < 0){ y += 16; }

    const xLow = Math.floor(x);
    const xHigh = xLow === 15 ? 0 : Math.ceil(x);

    const yLow = Math.floor(y);
    const yHigh = yLow === 15 ? 0 : Math.ceil(y);

    const x1 = this.noiseLerp(
      this.noiseSampleArray[noiseSampleIndex(xLow, yLow)],
      this.noiseSampleArray[noiseSampleIndex(xHigh, yLow)],
      x - Math.floor(x)
    );

    const x2 = this.noiseLerp(
      this.noiseSampleArray[noiseSampleIndex(xLow, yHigh)],
      this.noiseSampleArray[noiseSampleIndex(xHigh, yHigh)],
      x - Math.floor(x)
    );

    return this.noiseLerp(x1, x2, y - Math.floor(y)) / 256;
    // noise should generally return a value between -1 and 1, this returns 0 to 1;
  }

  noiseLerp(start: number, end: number, alpha: number): number {
    const range = end - start;
    const add = alpha * range;
    return add + start;
  }
}
