import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DatasetViewerComponent, DatasetGridComponent, DatasetDetailsComponent, CardViewerComponent } from './components'


const routes: Routes = [
  // EAGER Routes
  { path: "", pathMatch: 'full', redirectTo: 'simple' },
  { path: "list", component: DatasetViewerComponent },
  { path: "card", component: CardViewerComponent },
  { path: "grid", component: DatasetGridComponent },
  { path: 'details/:index', loadComponent: () => import('./components/dataset-details/dataset-details.component').then(m => m.DatasetDetailsComponent) }

  // LAZY Routes: preloaded right after root app module (via dynamic import module)


  // Page not found route
  // { path: '**', component: X404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],  // lazy loads ASAP!
  exports: [RouterModule]
})
export class AppRoutingModule { }
