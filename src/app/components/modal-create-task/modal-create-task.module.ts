import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCreateTaskComponent } from './modal-create-task.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ModalCreateTaskComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ModalCreateTaskComponent
  ]
})
export class ModalCreateTaskModule { }
