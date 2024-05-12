import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoiseWorkerComponent } from './noise-worker.component';

const routes: Routes = [{ path: '', component: NoiseWorkerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoiseWorkerRoutingModule { }
