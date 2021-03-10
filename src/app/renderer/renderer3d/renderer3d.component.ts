import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'pg-renderer3d',
  templateUrl: './renderer3d.component.html',
  styleUrls: ['./renderer3d.component.scss']
})
export class Renderer3dComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  destroyed = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const scene: THREE.Scene = new THREE.Scene();
    const camera: THREE.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 5;
    camera.position.x = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer: THREE.Renderer = new THREE.WebGLRenderer({canvas: this.canvas.nativeElement});
    renderer.setSize(800, 600);

    const geo: THREE.BufferGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geo);
    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = 0;

    scene.add(cube);
    const animate: () => void = () => {
      if (this.destroyed) {
        console.log('stopped animation');
        return;
      }
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      cube.rotateY(.01);
    };
    animate();
  }

  ngOnDestroy(): void {
    console.log('destroyed');
    this.destroyed = true;
  }
}
