import * as Three from 'three';
import { Component, OnInit } from '@angular/core';
import { chunkDataDefaults, defaultData, IChunkData, IWorldData, worldDataDefaults } from '../models/chunk-data.model';

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
    const chunkData: IChunkData = defaultData({}, chunkDataDefaults);
    this.generateChunkVoxelData(chunkData, this.worldData.chunkSize);

    this.worldData.chunkData.push(chunkData);
  }

  generateChunkVoxelData(chunkData: IChunkData, chunkSize: number): void {
    chunkData.voxelData = [];
    const colorR = Math.random();
    const colorG = Math.random();
    const colorB = Math.random();

    const lerp = (from: number, to: number, t: number) => {
      const range = to - from;
      const position = t * range;
      return from + position;
    };

    for (let x = 0; x < chunkSize; x++) {
      for (let y = 0; y < chunkSize; y++) {
        for (let z = 0; z < chunkSize; z++) {
          if (Math.random() < .9) {
            chunkData.voxelData.push({});
            continue;
          }
          let r = Math.random();
          let g = Math.random();
          let b = Math.random();

          r = lerp(colorR, r, .15);
          g = lerp(colorG, g, .15);
          b = lerp(colorB, b, .15);
          chunkData.voxelData.push({
            color: new Three.Color(r, g, b)
          });
        }
      }
    }
    chunkData.position = new Three.Vector3();
  }

}
