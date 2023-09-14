import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalTaskFormComponent } from './modal-task-form.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ModalTaskFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ModalTaskFormComponent
  ]
})
export class ModalCreateTaskModule { }
