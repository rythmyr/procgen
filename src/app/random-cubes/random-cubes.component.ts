import * as Three from 'three';
import { Component, OnInit } from '@angular/core';
import { chunkDataDefaults, defaultData, IChunkData, IWorldData, worldDataDefaults } from '../models/chunk-data.model';
import Random from '../../scripts/random';

@Component({
  selector: 'pg-random-cubes',
  templateUrl: './random-cubes.component.html',
  styleUrls: ['./random-cubes.component.scss']
})
export class RandomCubesComponent implements OnInit {

  worldData!: IWorldData;

  constructor() { }

  ngOnInit(): void {
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
          chunkData.position = new Three.Vector3(x, y, z);
          this.worldData.chunkDataMap[x][y][z] = chunkData;
          this.worldData.chunkDataArray.push(chunkData);
        }
      }
    }
  }

  generateChunkVoxelData(chunkData: IChunkData, chunkSize: number): void {
    const random = new Random({pos: chunkData.position, seed: 0});
    chunkData.voxelData = [];
    const colorR = random.next();
    const colorG = random.next();
    const colorB = random.next();

    const lerp = (from: number, to: number, t: number) => {
      const range = to - from;
      const position = t * range;
      return from + position;
    };

    for (let x = 0; x < chunkSize; x++) {
      for (let y = 0; y < chunkSize; y++) {
        for (let z = 0; z < chunkSize; z++) {
          if (random.next() < .99) {
            chunkData.voxelData.push({});
            continue;
          }
          let r = random.next();
          let g = random.next();
          let b = random.next();

          r = lerp(colorR, r, .15);
          g = lerp(colorG, g, .15);
          b = lerp(colorB, b, .15);

          chunkData.voxelData.push({
            color: new Three.Color(r, g, b)
          });
        }
      }
    }

  }

}
