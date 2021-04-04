import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { RendererModule } from 'src/app/renderer/renderer.module';

import { PerlinNoiseRoutingModule } from './perlin-noise-routing.module';
import { PerlinNoiseComponent } from './perlin-noise.component';

@NgModule({
  declarations: [PerlinNoiseComponent],
  imports: [
    FormsModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatSlideToggleModule,
    CommonModule,
    PerlinNoiseRoutingModule,
    RendererModule
  ]
})
export class PerlinNoiseModule { }
