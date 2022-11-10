import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ListViewComponent, GridViewComponent, DetailViewComponent, CardViewComponent, MapViewComponent } from './components'

const routes: Routes = [
  // EAGER Routes
  { path: "", pathMatch: 'full', redirectTo: 'card' },
  { path: "list", component: ListViewComponent },
  { path: "card", component: CardViewComponent },
  { path: "grid", component: GridViewComponent },
  { path: "map", component: MapViewComponent },
  { path: 'details/:index', loadComponent: () => import('./components/detail-view/detail-view.component').then(m => m.DetailViewComponent) }

  // LAZY Routes: preloaded right after root app module (via dynamic import module)

  // Page not found route
  // { path: '**', component: X404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],  // lazy loads ASAP!
  exports: [RouterModule]
})
export class AppRoutingModule { }
