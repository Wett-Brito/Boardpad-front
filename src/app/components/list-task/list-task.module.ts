import { ModalConfirmationModule } from './../modal-confirmation/modal-confirmation.module';
import { FormsModule } from '@angular/forms';
import { ModalCreateTaskModule } from '../modal-task-form/modal-task-form.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTaskComponent } from './list-task.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
  declarations: [
    ListTaskComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    ModalCreateTaskModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatProgressBarModule,
    ModalConfirmationModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  exports : [ListTaskComponent]
})
export class ListTaskModule { }
