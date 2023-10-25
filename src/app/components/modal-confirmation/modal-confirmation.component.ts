import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.css']
})
export class ModalConfirmationComponent implements OnInit {
  @Input()
  showModal : boolean = false;
  @Input()
  title : string = "";
  @Input()
  message : string = "";

  @Input()
  onConfirmPressed : any = {
    method : () =>{},
    data : {}
  }

  @Output()
  showModalChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }
  closeModal () : void {
    this.showModalChange.emit(false);
  }

  onConfirm() : void {
    let parametersData = this.onConfirmPressed.data;
    this.onConfirmPressed.method(parametersData);
    this.closeModal();
  }
}
