import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebugComponent } from 'src/app/debug/debug.component';

const routes: Routes = [
  { path: 'noise/perlin', loadChildren: () => import('./perlin-noise/perlin-noise.module').then(m => m.PerlinNoiseModule) },
  { path: 'cubes', loadChildren: () => import('./random-cubes/random-cubes.module').then(m => m.RandomCubesModule) },
  { path: 'debug', component: DebugComponent },
  { path: '', pathMatch: 'full', redirectTo: 'noise/perlin' },
  { path: '**', pathMatch: 'full', redirectTo: 'noise/perlin' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
