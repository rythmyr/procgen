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
    this.camera.position.z = -5;
    this.camera.position.y = 5;
    this.camera.position.x = 0;
    this.camera.lookAt(new Three.Vector3(0, 0, 0));

    this.renderer = new Three.WebGLRenderer({canvas: this.canvas.nativeElement});
    this.renderer.setSize(800, 600);

    const chunkMesh = this.generateChunkMesh();
    this.scene.add(chunkMesh);

    const animate: () => void = () => {
      if (this.destroyed) {
        console.log('stopped animation');
        return;
      }
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
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
      for (let i = 0; i < 16; i++) {
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();

        // front
        colors.push(r, g, b);
        colors.push(r, g, b);
        colors.push(r, g, b);
        colors.push(r, g, b);

        positions.push(i * 2 + 0, 0, 0);
        positions.push(i * 2 + 0, 1, 0);
        positions.push(i * 2 + 1, 1, 0);
        positions.push(i * 2 + 1, 0, 0);

        normals.push(-1, 0, 0);
        normals.push(-1, 0, 0);
        normals.push(-1, 0, 0);
        normals.push(-1, 0, 0);

        indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
        currentIndex += 4;

        // left
        colors.push(r, g, b);
        colors.push(r, g, b);
        colors.push(r, g, b);
        colors.push(r, g, b);

        positions.push(i * 2, 0, 1);
        positions.push(i * 2, 1, 1);
        positions.push(i * 2, 1, 0);
        positions.push(i * 2, 0, 0);

        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);

        indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
        currentIndex += 4;

        // left
        colors.push(r, g, b);
        colors.push(r, g, b);
        colors.push(r, g, b);
        colors.push(r, g, b);

        positions.push(i * 2 + 1, 0, 0);
        positions.push(i * 2 + 1, 1, 0);
        positions.push(i * 2 + 1, 1, 1);
        positions.push(i * 2 + 1, 0, 1);

        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);

        indices.push(...[0, 1, 2, 0, 2, 3].map(ind => ind + currentIndex));
        currentIndex += 4;
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
