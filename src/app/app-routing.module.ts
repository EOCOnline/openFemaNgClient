import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataSetViewerComponent } from './Components/data-set-viewer/data-set-viewer.component'

const routes: Routes = [
  {path:"", pathMatch: 'full', redirectTo: 'list'},
  {path: "list", component: DataSetViewerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
