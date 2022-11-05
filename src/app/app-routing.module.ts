import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetViewerComponent, DatasetGridComponent, DatasetDetailsComponent, SimpleViewerComponent } from './components'


const routes: Routes = [
  {path:"", pathMatch: 'full', redirectTo: 'list'},
  {path: "list", component: DatasetViewerComponent},
  {path: "simple", component: SimpleViewerComponent},
  {path: "grid", component: DatasetGridComponent},
  { path: 'details/:index', loadComponent: () => import('./components/dataset-details/dataset-details.component').then(m => m.DatasetDetailsComponent) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
