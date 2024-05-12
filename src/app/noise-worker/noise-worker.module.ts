import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { RendererModule } from 'src/app/renderer/renderer.module';

import { NoiseWorkerRoutingModule } from './noise-worker-routing.module';
import { NoiseWorkerComponent } from './noise-worker.component';

@NgModule({
  declarations: [NoiseWorkerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatSlideToggleModule,
    NoiseWorkerRoutingModule,
    RendererModule
  ]
})
export class NoiseWorkerModule { }
