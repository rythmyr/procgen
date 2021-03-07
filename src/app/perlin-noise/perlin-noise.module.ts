import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerlinNoiseRoutingModule } from './perlin-noise-routing.module';
import { PerlinNoiseComponent } from './perlin-noise.component';


@NgModule({
  declarations: [PerlinNoiseComponent],
  imports: [
    CommonModule,
    PerlinNoiseRoutingModule
  ]
})
export class PerlinNoiseModule { }
