import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { RendererModule } from 'src/app/renderer/renderer.module';

import { RandomCubesRoutingModule } from './random-cubes-routing.module';
import { RandomCubesComponent } from './random-cubes.component';

@NgModule({
  declarations: [RandomCubesComponent],
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    CommonModule,
    RandomCubesRoutingModule,
    RendererModule
  ]
})
export class RandomCubesModule { }
