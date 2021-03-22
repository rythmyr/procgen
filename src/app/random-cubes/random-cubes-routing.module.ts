import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RandomCubesComponent } from './random-cubes.component';

const routes: Routes = [{ path: '', component: RandomCubesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RandomCubesRoutingModule { }
