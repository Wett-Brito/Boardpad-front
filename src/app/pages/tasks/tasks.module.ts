import { ListTaskModule } from '../../components/list-task/list-task.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';



@NgModule({
  declarations: [
    TasksComponent
  ],
  imports: [
    CommonModule,
    ListTaskModule
  ],
  exports : [TasksComponent]
})
export class TasksModule { }
