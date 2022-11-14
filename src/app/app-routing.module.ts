import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ListViewComponent, GridViewComponent, DetailViewComponent, CardViewComponent, MapComponent } from './components'

const routes: Routes = [
  // EAGER Routes
  { path: "", pathMatch: 'full', redirectTo: 'card' },
  { path: "list", component: ListViewComponent },
  { path: "card", component: CardViewComponent },
  { path: "grid", component: GridViewComponent },
  { path: "map", component: MapComponent },
  { path: 'details/:index', component: DetailViewComponent }
  //  { path: 'details/:index', loadComponent: () => import('./components/detail-view/detail-view.component').then(m => m.DetailViewComponent) } // for standalone

  // LAZY Routes: preloaded right after root app module (via dynamic import module)

  // Page not found route
  // { path: '**', component: X404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],  // lazy loads ASAP!
  exports: [RouterModule]
})
export class AppRoutingModule { }
