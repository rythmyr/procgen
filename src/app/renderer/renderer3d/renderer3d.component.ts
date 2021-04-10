import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { IWorldData, IChunkData } from 'src/app/models/chunk-data.model';
import * as Three from 'three';

class PointerControls {
  isPointerLocked = false;

  pressedKeys: Map<string, boolean> = new Map();

  vec3 = new Three.Vector3();

  readonly minEulerX = -Math.PI / 2 + .01;
  readonly maxEulerX = Math.PI / 2 - .01;

  keyMap: { [key: string]: (timeDelta: number) => void } = {
    ['KeyW']: (timeDelta) => {
      this.moveForward(15 * timeDelta);
    },
    ['KeyA']: (timeDelta) => {
      this.moveRight(-15 * timeDelta);
    },
    ['KeyS']: (timeDelta) => {
      this.moveForward(-15 * timeDelta);
    },
    ['KeyD']: (timeDelta) => {
      this.moveRight(15 * timeDelta);
    }
  };

  constructor(
    private camera: Three.Camera,
    private domElement: HTMLElement
  ) {
    this.domElement.addEventListener('mousedown', this.clickHandler);
    this.domElement.addEventListener('mouseup', this.releaseHandler);
    this.domElement.addEventListener('mousemove', this.mouseMoveHandler);
    this.domElement.ownerDocument.addEventListener('keydown', this.keyDownHandler);
    this.domElement.ownerDocument.addEventListener('keyup', this.keyUpHandler);
  }

  clickHandler = () => {
    this.lock();
    this.isPointerLocked = true;
  };

  releaseHandler = () => {
    this.unlock();
    this.isPointerLocked = false;
  };

  mouseMoveHandler = (event: MouseEvent) => {
    if (!this.isPointerLocked) {
      return;
    }

    const eulers = new Three.Euler(0, 0, 0, 'YXZ');
    eulers.setFromQuaternion(this.camera.quaternion);
    const mx = event.movementX || 0;
    const my = event.movementY || 0;

    eulers.x -= my * .001;
    eulers.y -= mx * .001;

    if (eulers.x < this.minEulerX) {
      eulers.x = this.minEulerX;
    } else if (eulers.x > this.maxEulerX) {
      eulers.x = this.maxEulerX;
    }

    this.camera.quaternion.setFromEuler(eulers);
  };

  keyDownHandler = (event: KeyboardEvent) => {
    this.pressedKeys.set(event.code, true);
  };

  keyUpHandler = (event: KeyboardEvent) => {
    this.pressedKeys.set(event.code, false);
  };

  update = (timeDelta: number) => {
    if (!this.isPointerLocked) {
      return;
    }
    for (const [key, value] of this.pressedKeys){
      if (!value) {
        continue;
      }
      const handler = this.keyMap[key];
      if (handler) {
        handler(timeDelta);
      }
    }
  };

  lock = () => {
    this.domElement.requestPointerLock();
  };

  unlock = () => {
    this.domElement.ownerDocument.exitPointerLock();
  };

  moveRight = (dist: number) => {
    this.vec3.setFromMatrixColumn(this.camera.matrix, 0);
    this.camera.position.addScaledVector(this.vec3, dist);
  };

  moveForward = (dist: number) => {
    this.camera.getWorldDirection(this.vec3);
    this.camera.position.addScaledVector(this.vec3, dist);
  };
}

@Component({
  selector: 'pg-renderer3d',
  templateUrl: './renderer3d.component.html',
  styleUrls: ['./renderer3d.component.scss']
})
export class Renderer3dComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container') container!: ElementRef<HTMLElement>;
  @Input() worldData!: IWorldData;
  @Input() logFrameCount?: boolean;

  @Output() frameCount: EventEmitter<number> = new EventEmitter();

  frameCountSubject = new Subject<number>();

  destroyed = false;
  private renderer!: Three.Renderer;
  private scene!: Three.Scene;
  private camera!: Three.PerspectiveCamera;

  constructor() { }

  ngOnInit(): void {
    this.scene = new Three.Scene();

    const clock = new Three.Clock();
    clock.start();

    const material = new Three.MeshBasicMaterial({
      vertexColors: true
      // wireframe: true
    });
    const logData: any[] = [];
    for (const chunkData of this.worldData.chunkDataArray) {
      chunkData.mesh = this.generateChunkMesh(chunkData, this.worldData, logData);
      chunkData.meshNeedsUpdate = false;
      chunkData.mesh.material = material;
      this.scene.add(chunkData.mesh);
    }
    console.log(logData);
    const elapsed = clock.getElapsedTime();
    clock.stop();
    console.log(`generation of mesh data took ${elapsed} seconds`);
  }

  onResize(): void {
    const size = this.container.nativeElement.getBoundingClientRect();
    this.renderer.setSize(size.width, size.height);
    this.camera.aspect = size.width / size.height;
    this.camera.updateProjectionMatrix();
  }

  ngAfterViewInit(): void {
    const size = this.container.nativeElement.getBoundingClientRect();

    this.renderer = new Three.WebGLRenderer({ canvas: this.canvas.nativeElement });
    this.renderer.setSize(size.width, size.height);

    this.camera = new Three.PerspectiveCamera(75, (size.width / size.height), 0.1, 1000);
    this.camera.position.y = 180;
    this.camera.position.z = 100;
    this.camera.position.x = 100;
    this.camera.lookAt(new Three.Vector3(0, 80, 0));

    const controls = new PointerControls(
      this.camera, this.canvas.nativeElement
    );

    const clock = new Three.Clock();

    clock.start();

    let frameTime = 0;
    let frameCount = 0;

    const animate: () => void = () => {
      const delta = clock.getDelta();
      // this.camera.rotateOnWorldAxis(new Three.Vector3(0, 1, 0), .5 * delta);
      frameTime += delta;
      frameCount += 1;
      if (frameTime > 1) {
        if (this.logFrameCount) {
          this.frameCount.emit(frameCount);
        }
        frameTime -= 1;

        if (delta > 1) {
          console.warn(`delta of ${delta} seconds in render loop`);
          frameTime = 0;
        }
        frameCount = 0;
      }
      if (this.destroyed) {
        clock.stop();
        return;
      }
      controls.update(delta);
      this.render();
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  render(): void {
    if (!this.renderer) {
      return;
    }

    this.renderer.render(this.scene, this.camera);
  }

  generateChunkMesh(chunkData: IChunkData, worldData: IWorldData, logData: any[]): Three.Mesh {
    if (!chunkData.meshNeedsUpdate) {
      return new Three.Mesh();
    }

    const colors: number[] = [];
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    const chunkSize = worldData.chunkSize;

    const voxelDataIndex: (x: number, y: number, z: number) => number = (x, y, z) => {
      if (x >= chunkSize || y >= chunkSize || z >= chunkSize || x < 0 || y < 0 || z < 0) {
        return -1;
      }
      return x * chunkSize * chunkSize + y * chunkSize + z;
    };

    let currentIndex = 0;
    for (let x = 0; x < chunkSize; x++) {
      for (let y = 0; y < chunkSize; y++) {
        for (let z = 0; z < chunkSize; z++) {
          const voxelData = chunkData.voxelData[voxelDataIndex(x, y, z)];
          if (!(voxelData && voxelData.color)) {
            continue;
          }

          const {r, g, b} = voxelData.color;

          // -z
          (() => {
            let voxel2;
            const voxel2Index = voxelDataIndex(x, y, z - 1);
            if (voxel2Index === -1) {
              const borderChunk = worldData.chunkDataMap
                [chunkData.position.x]?.
                [chunkData.position.y]?.
                [chunkData.position.z - 1];
              if (!borderChunk) { return; }
              voxel2 = borderChunk?.voxelData[voxelDataIndex(x, y, chunkSize - 1)];
            } else {
              voxel2 = chunkData.voxelData[voxel2Index];
            }
            if (voxel2?.color) {
              return;
            }
            colors.push(r * .9, g * .9, b * .9);
            colors.push(r * .9, g * .9, b * .9);
            colors.push(r * .9, g * .9, b * .9);
            colors.push(r * .9, g * .9, b * .9);

            positions.push(x + 0, y + 0, z + 0);
            positions.push(x + 0, y + 1, z + 0);
            positions.push(x + 1, y + 1, z + 0);
            positions.push(x + 1, y + 0, z + 0);

            normals.push(0, 0, -1);
            normals.push(0, 0, -1);
            normals.push(0, 0, -1);
            normals.push(0, 0, -1);

            indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
            currentIndex += 4;

          }) ();

          // +z
          (() => {
            let voxel2;
            const voxel2Index = voxelDataIndex(x, y, z + 1);
            if (voxel2Index === -1) {
              const borderChunk = worldData.chunkDataMap
                [chunkData.position.x]?.
                [chunkData.position.y]?.
                [chunkData.position.z + 1];
              if (!borderChunk) { return; }
              voxel2 = borderChunk?.voxelData[voxelDataIndex(x, y, 0)];
            } else {
              voxel2 = chunkData.voxelData[voxel2Index];
            }
            if (voxel2?.color) {
              return;
            }
            colors.push(r * .8, g * .8, b * .8);
            colors.push(r * .8, g * .8, b * .8);
            colors.push(r * .8, g * .8, b * .8);
            colors.push(r * .8, g * .8, b * .8);

            positions.push(x + 1, y + 1, z + 1);
            positions.push(x + 0, y + 1, z + 1);
            positions.push(x + 0, y + 0, z + 1);
            positions.push(x + 1, y + 0, z + 1);

            normals.push(0, 0, 1);
            normals.push(0, 0, 1);
            normals.push(0, 0, 1);
            normals.push(0, 0, 1);

            indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
            currentIndex += 4;
          }) ();

          // -x
          (() => {
            let voxel2;
            const voxel2Index = voxelDataIndex(x - 1, y, z);
            if (voxel2Index === -1) {
              const borderChunk = worldData.chunkDataMap
                [chunkData.position.x - 1]?.
                [chunkData.position.y]?.
                [chunkData.position.z];
              if (!borderChunk) { return; }
              voxel2 = borderChunk?.voxelData[voxelDataIndex(chunkSize - 1, y, z)];
            } else {
              voxel2 = chunkData.voxelData[voxel2Index];
            }
            if (voxel2?.color) {
              return;
            }
            colors.push(r * .95, g * .95, b * .95);
            colors.push(r * .95, g * .95, b * .95);
            colors.push(r * .95, g * .95, b * .95);
            colors.push(r * .95, g * .95, b * .95);

            positions.push(x, y + 0, z + 1);
            positions.push(x, y + 1, z + 1);
            positions.push(x, y + 1, z + 0);
            positions.push(x, y + 0, z + 0);

            normals.push(-1, 0, 0);
            normals.push(-1, 0, 0);
            normals.push(-1, 0, 0);
            normals.push(-1, 0, 0);

            indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
            currentIndex += 4;
          }) ();

          // +x
          (() => {
            let voxel2;
            const voxel2Index = voxelDataIndex(x + 1, y, z);
            if (voxel2Index === -1) {
              const borderChunk = worldData.chunkDataMap
                [chunkData.position.x + 1]?.
                [chunkData.position.y]?.
                [chunkData.position.z];
              if (!borderChunk) { return; }
              voxel2 = borderChunk?.voxelData[voxelDataIndex(0, y, z)];
            } else {
              voxel2 = chunkData.voxelData[voxel2Index];
            }
            if (voxel2?.color) {
              return;
            }
            colors.push(r * .85, g * .85, b * .85);
            colors.push(r * .85, g * .85, b * .85);
            colors.push(r * .85, g * .85, b * .85);
            colors.push(r * .85, g * .85, b * .85);

            positions.push(x + 1, y + 0, z + 0);
            positions.push(x + 1, y + 1, z + 0);
            positions.push(x + 1, y + 1, z + 1);
            positions.push(x + 1, y + 0, z + 1);

            normals.push(1, 0, 0);
            normals.push(1, 0, 0);
            normals.push(1, 0, 0);
            normals.push(1, 0, 0);

            indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
            currentIndex += 4;
          }) ();

          // -y
          (() => {
            let voxel2;
            const voxel2Index = voxelDataIndex(x, y - 1, z);
            if (voxel2Index === -1) {
              const borderChunk = worldData.chunkDataMap
                [chunkData.position.x]?.
                [chunkData.position.y - 1]?.
                [chunkData.position.z];
              if (!borderChunk) { return; }
              voxel2 = borderChunk?.voxelData[voxelDataIndex(x, chunkSize - 1, z)];
            } else {
              voxel2 = chunkData.voxelData[voxel2Index];
            }
            if (voxel2?.color) {
              return;
            }
            colors.push(r, g, b);
            colors.push(r, g, b);
            colors.push(r, g, b);
            colors.push(r, g, b);

            positions.push(x + 1, y + 0, z + 1);
            positions.push(x + 0, y + 0, z + 1);
            positions.push(x + 0, y + 0, z + 0);
            positions.push(x + 1, y + 0, z + 0);

            normals.push(0, -1, 0);
            normals.push(0, -1, 0);
            normals.push(0, -1, 0);
            normals.push(0, -1, 0);

            indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
            currentIndex += 4;
          }) ();

          // +y
          (() => {
            let voxel2;
            const voxel2Index = voxelDataIndex(x, y + 1, z);
            if (voxel2Index === -1) {
              const borderChunk = worldData.chunkDataMap
                [chunkData.position.x]?.
                [chunkData.position.y + 1]?.
                [chunkData.position.z];
              if (!borderChunk) { return; }
              voxel2 = borderChunk?.voxelData[voxelDataIndex(x, 0, z)];
            } else {
              voxel2 = chunkData.voxelData[voxel2Index];
            }
            if (voxel2?.color) {
              return;
            }
            colors.push(r, g, b);
            colors.push(r, g, b);
            colors.push(r, g, b);
            colors.push(r, g, b);

            positions.push(x + 1, y + 1, z + 0);
            positions.push(x + 0, y + 1, z + 0);
            positions.push(x + 0, y + 1, z + 1);
            positions.push(x + 1, y + 1, z + 1);

            normals.push(0, 1, 0);
            normals.push(0, 1, 0);
            normals.push(0, 1, 0);
            normals.push(0, 1, 0);

            indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
            currentIndex += 4;
          }) ();
        }
      }
    }
    const geometry = new Three.BufferGeometry();
    geometry.setAttribute('color', new Three.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('position', new Three.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new Three.Float32BufferAttribute(normals, 3));
    geometry.setIndex(indices);

    const mesh: Three.Mesh = new Three.Mesh(geometry);
    const position: Three.Vector3 = chunkData.position.clone().multiplyScalar(chunkSize);
    mesh.position.copy(position);
    return mesh;
  }

  ngOnDestroy(): void {
    console.log('destroyed');
    this.destroyed = true;
  }
}
