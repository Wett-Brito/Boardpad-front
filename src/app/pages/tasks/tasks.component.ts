import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  showCreationModal: boolean = false;
  boardCode : string = "";

  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.boardCode = routeParams.get('board-code') || "";
  }
  openCreationModal(): void {
    this.showCreationModal = true;
  }
  closeCreationModal(): void {
    this.showCreationModal = false;
  }
}
