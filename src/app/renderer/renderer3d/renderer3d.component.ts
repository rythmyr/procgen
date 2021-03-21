import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, OnDestroy, Input } from '@angular/core';
import { ChunkData } from 'src/app/models/chunk-data.model';
import * as Three from 'three';

@Component({
  selector: 'pg-renderer3d',
  templateUrl: './renderer3d.component.html',
  styleUrls: ['./renderer3d.component.scss']
})
export class Renderer3dComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() chunkData!: ChunkData[];

  destroyed = false;
  private renderer!: Three.Renderer;
  private scene!: Three.Scene;
  private camera!: Three.Camera;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.scene = new Three.Scene();
    this.camera = new Three.PerspectiveCamera(75, (4 / 3), 0.1, 1000);
    this.camera.position.y = .5;
    this.camera.lookAt(new Three.Vector3(1, 0, 1));

    this.renderer = new Three.WebGLRenderer({canvas: this.canvas.nativeElement});
    this.renderer.setSize(800, 600);

    const chunkMesh = this.generateChunkMesh();
    this.scene.add(chunkMesh);

    const animate: () => void = () => {
      if (this.destroyed) {
        console.log('stopped animation');
        return;
      }
      this.renderer.render(this.scene, this.camera);
      this.camera.rotateOnWorldAxis(new Three.Vector3(0, 1, 0), .005);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  generateChunkMesh(chunkData?: ChunkData): Three.Mesh {
    const colors: number[] = [];
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    if (chunkData) {
    }
    else {
      let currentIndex = 0;
      for (let x = -8; x < 8; x++) {
        for (let y = -8; y < 8; y++) {
          for (let z = -8; z < 8; z++) {

            const r = Math.random();
            const g = Math.random();
            const b = Math.random();

            // -z
            colors.push(r * .9, g * .9, b * .9);
            colors.push(r * .9, g * .9, b * .9);
            colors.push(r * .9, g * .9, b * .9);
            colors.push(r * .9, g * .9, b * .9);

            positions.push(x * 2 + 0, y * 2 + 0, z * 2 + 0);
            positions.push(x * 2 + 0, y * 2 + 1, z * 2 + 0);
            positions.push(x * 2 + 1, y * 2 + 1, z * 2 + 0);
            positions.push(x * 2 + 1, y * 2 + 0, z * 2 + 0);

            normals.push(0, 0, -1);
            normals.push(0, 0, -1);
            normals.push(0, 0, -1);
            normals.push(0, 0, -1);

            indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
            currentIndex += 4;

            // +z
            colors.push(r * .8, g * .8, b * .8);
            colors.push(r * .8, g * .8, b * .8);
            colors.push(r * .8, g * .8, b * .8);
            colors.push(r * .8, g * .8, b * .8);

            positions.push(x * 2 + 1, y * 2 + 1, z * 2 + 1);
            positions.push(x * 2 + 0, y * 2 + 1, z * 2 + 1);
            positions.push(x * 2 + 0, y * 2 + 0, z * 2 + 1);
            positions.push(x * 2 + 1, y * 2 + 0, z * 2 + 1);

            normals.push(0, 0, 1);
            normals.push(0, 0, 1);
            normals.push(0, 0, 1);
            normals.push(0, 0, 1);

            indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
            currentIndex += 4;

            // -x
            colors.push(r * .95, g * .95, b * .95);
            colors.push(r * .95, g * .95, b * .95);
            colors.push(r * .95, g * .95, b * .95);
            colors.push(r * .95, g * .95, b * .95);

            positions.push(x * 2, y * 2 + 0, z * 2 + 1);
            positions.push(x * 2, y * 2 + 1, z * 2 + 1);
            positions.push(x * 2, y * 2 + 1, z * 2 + 0);
            positions.push(x * 2, y * 2 + 0, z * 2 + 0);

            normals.push(-1, 0, 0);
            normals.push(-1, 0, 0);
            normals.push(-1, 0, 0);
            normals.push(-1, 0, 0);

            indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
            currentIndex += 4;

            // +x
            colors.push(r * .85, g * .85, b * .85);
            colors.push(r * .85, g * .85, b * .85);
            colors.push(r * .85, g * .85, b * .85);
            colors.push(r * .85, g * .85, b * .85);

            positions.push(x * 2 + 1, y * 2 + 0, z * 2 + 0);
            positions.push(x * 2 + 1, y * 2 + 1, z * 2 + 0);
            positions.push(x * 2 + 1, y * 2 + 1, z * 2 + 1);
            positions.push(x * 2 + 1, y * 2 + 0, z * 2 + 1);

            normals.push(1, 0, 0);
            normals.push(1, 0, 0);
            normals.push(1, 0, 0);
            normals.push(1, 0, 0);

            indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
            currentIndex += 4;

            // -y
            colors.push(r, g, b);
            colors.push(r, g, b);
            colors.push(r, g, b);
            colors.push(r, g, b);

            positions.push(x * 2 + 1, y * 2 + 0, z * 2 + 1);
            positions.push(x * 2 + 0, y * 2 + 0, z * 2 + 1);
            positions.push(x * 2 + 0, y * 2 + 0, z * 2 + 0);
            positions.push(x * 2 + 1, y * 2 + 0, z * 2 + 0);

            normals.push(0, -1, 0);
            normals.push(0, -1, 0);
            normals.push(0, -1, 0);
            normals.push(0, -1, 0);

            indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
            currentIndex += 4;

            // +y
            colors.push(r, g, b);
            colors.push(r, g, b);
            colors.push(r, g, b);
            colors.push(r, g, b);

            positions.push(x * 2 + 1, y * 2 + 1, z * 2 + 0);
            positions.push(x * 2 + 0, y * 2 + 1, z * 2 + 0);
            positions.push(x * 2 + 0, y * 2 + 1, z * 2 + 1);
            positions.push(x * 2 + 1, y * 2 + 1, z * 2 + 1);

            normals.push(0, 1, 0);
            normals.push(0, 1, 0);
            normals.push(0, 1, 0);
            normals.push(0, 1, 0);

            indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
            currentIndex += 4;
          }
        }
      }
    }

    const geometry = new Three.BufferGeometry();
    geometry.setAttribute('color', new Three.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('position', new Three.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new Three.Float32BufferAttribute(normals, 3));
    geometry.setIndex(indices);

    const mesh: Three.Mesh = new Three.Mesh(geometry);
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 0;

    mesh.material = new Three.MeshBasicMaterial({
      vertexColors: true,
    });

    return mesh;
  }

  ngOnDestroy(): void {
    console.log('destroyed');
    this.destroyed = true;
  }
}
