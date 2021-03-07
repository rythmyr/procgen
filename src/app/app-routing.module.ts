import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebugComponent } from 'src/app/debug/debug.component';

const routes: Routes = [
  { path: 'Noise/Perlin', loadChildren: () => import('./perlin-noise/perlin-noise.module').then(m => m.PerlinNoiseModule) },
  { path: 'debug', component: DebugComponent },
  { path: '', pathMatch: 'full', redirectTo: 'Noise/Perlin' },
  { path: '**', pathMatch: 'full', redirectTo: 'Noise/Perlin' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
