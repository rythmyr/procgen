import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, OnDestroy, Input } from '@angular/core';
import { IWorldData, IChunkData, chunkDataDefaults, defaultData } from 'src/app/models/chunk-data.model';
import * as Three from 'three';

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

  destroyed = false;
  private renderer!: Three.Renderer;
  private scene!: Three.Scene;
  private camera!: Three.PerspectiveCamera;
  private clock!: Three.Clock;
  private frameCount = 0;
  private frameTime = 0;

  constructor() { }

  ngOnInit(): void {
    this.scene = new Three.Scene();

    for (let x = -5; x < 5; x++) {
      for (let y = -5; y < 5; y++) {
        for (let z = -5; z < 5; z++) {
          const chunkData: IChunkData = this.worldData.chunkData[x][y][z];
          chunkData.mesh = this.generateChunkMesh(chunkData, 16);
          chunkData.meshNeedsUpdate = false;
          this.scene.add(chunkData.mesh);
        }
      }
    }
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
    this.camera.position.y = -5;
    this.camera.position.z = -5;
    this.camera.position.x = -5;
    this.camera.lookAt(new Three.Vector3(1, 0, 1));

    this.clock = new Three.Clock();

    this.clock.start();

    const animate: () => void = () => {
      // this.camera.rotateOnWorldAxis(new Three.Vector3(0, 1, 0), .5 * delta);
      const delta = this.clock.getDelta();
      this.frameTime += delta;
      this.frameCount += 1;
      if (this.frameTime > 1) {
        if (this.logFrameCount) {
          console.log(this.frameCount);
        }
        this.frameTime -= 1;

        if (delta > 1) {
          console.warn('delta of ' + delta + ' seconds in render loop');
          this.frameTime = 0;
        }
        this.frameCount = 0;
      }
      if (this.destroyed) {
        this.clock.stop();
        return;
      }
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

  generateChunkMesh(chunkData: IChunkData, chunkSize: number): Three.Mesh {
    if (chunkData.meshNeedsUpdate) {
      const colors: number[] = [];
      const positions: number[] = [];
      const normals: number[] = [];
      const indices: number[] = [];

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
              const voxelData2 = chunkData.voxelData[voxelDataIndex(x, y, z - 1)];
              if (voxelData2 && voxelData2.color) {
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
              const voxelData2 = chunkData.voxelData[voxelDataIndex(x, y, z + 1)];
              if (voxelData2 && voxelData2.color) {
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
              const voxelData2 = chunkData.voxelData[voxelDataIndex(x - 1, y, z)];
              if (voxelData2 && voxelData2.color) {
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
              const voxelData2 = chunkData.voxelData[voxelDataIndex(x + 1, y, z)];
              if (voxelData2 && voxelData2.color) {
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
              const voxelData2 = chunkData.voxelData[voxelDataIndex(x, y - 1, z)];
              if (voxelData2 && voxelData2.color) {
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
              const voxelData2 = chunkData.voxelData[voxelDataIndex(x, y - 1, z)];
              if (voxelData2 && voxelData2.color) {
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

      mesh.material = new Three.MeshBasicMaterial({
        vertexColors: true,
      });
      return mesh;
    } else {
      return new Three.Mesh();
    }
  }

  ngOnDestroy(): void {
    console.log('destroyed');
    this.destroyed = true;
  }
}
