import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
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
