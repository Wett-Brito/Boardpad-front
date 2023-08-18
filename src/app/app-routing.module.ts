import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TasksComponent } from './pages/tasks/tasks.component';

const routes: Routes = [
  {
    path : '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path : ':board-code',
    component: TasksComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
