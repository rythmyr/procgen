import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Renderer3dComponent } from 'src/app/renderer/renderer3d/renderer3d.component';

@NgModule({
  declarations: [Renderer3dComponent],
  imports: [
    CommonModule
  ],
  exports: [Renderer3dComponent]
})
export class RendererModule { }
