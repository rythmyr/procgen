import { Component, OnDestroy, OnInit } from '@angular/core';
import { IWorldData, worldDataDefaults, defaultData } from '../models/chunk-data.model';

@Component({
  selector: 'pg-noise-worker',
  templateUrl: './noise-worker.component.html',
  styleUrls: ['./noise-worker.component.scss']
})
export class NoiseWorkerComponent implements OnInit, OnDestroy {
  worldData!: IWorldData;
  logFrameCount = true;

  workers: Worker[] = [];

  frameCount = 0;

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < navigator.hardwareConcurrency; i++) {
      const worker = new Worker('../chunk-generator.worker', { type: 'module' });
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
      };
      worker.postMessage('hello');
    }
    this.worldData = defaultData({}, worldDataDefaults);
  }

  ngOnDestroy(): void {
    this.workers.forEach((w) => {
      w.terminate();
    });
  }

  onFrameCountUpdate(frameCount: number): void {
    this.frameCount = frameCount;
  }

}
