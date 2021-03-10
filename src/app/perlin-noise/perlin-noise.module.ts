import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RendererModule } from 'src/app/renderer/renderer.module';

import { PerlinNoiseRoutingModule } from './perlin-noise-routing.module';
import { PerlinNoiseComponent } from './perlin-noise.component';

@NgModule({
  declarations: [PerlinNoiseComponent],
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    CommonModule,
    PerlinNoiseRoutingModule,
    RendererModule
  ]
})
export class PerlinNoiseModule { }
