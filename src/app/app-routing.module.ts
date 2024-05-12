import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebugComponent } from 'src/app/debug/debug.component';

const routes: Routes = [
  { path: 'noise/perlin', loadChildren: () => import('./perlin-noise/perlin-noise.module').then(m => m.PerlinNoiseModule) },
  { path: 'cubes', loadChildren: () => import('./random-cubes/random-cubes.module').then(m => m.RandomCubesModule) },
  { path: 'noise/worker', loadChildren: () => import('./noise-worker/noise-worker.module').then(m => m.NoiseWorkerModule) },
  { path: 'debug', component: DebugComponent },
  { path: '', pathMatch: 'full', redirectTo: 'noise/worker' },
  { path: '**', pathMatch: 'full', redirectTo: 'noise/worker' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
