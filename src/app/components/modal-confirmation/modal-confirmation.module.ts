import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalConfirmationComponent } from './modal-confirmation.component';



@NgModule({
  declarations: [
    ModalConfirmationComponent
  ],
  imports: [
    CommonModule
  ],
  exports : [ModalConfirmationComponent]
})
export class ModalConfirmationModule { }
