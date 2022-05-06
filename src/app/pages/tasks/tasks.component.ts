import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  showCreationModal : boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  openCreationModal() : void {
    this.showCreationModal = true;
  }
  closeCreationModal() : void {
    this.showCreationModal = false;
  }
}
