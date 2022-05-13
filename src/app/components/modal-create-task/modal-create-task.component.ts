import { TaskService } from './../../services/task.service';
import { TaskResponseInterface } from './../../interfaces/task-response-interface';
import { take } from 'rxjs';
import { TaskCategoryResponseInterface } from './../../interfaces/task-category-response-interface';
import { CategoriesService } from './../../services/categories.service';
import { StatusTaskInterface } from './../../interfaces/status-task-interface';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-modal-create-task',
  templateUrl: './modal-create-task.component.html',
  styleUrls: ['./modal-create-task.component.css']
})
export class ModalCreateTaskComponent implements OnInit {
  @Input()
  taskStatus : StatusTaskInterface = {} as StatusTaskInterface;
  @Input()
  showCreationModal : boolean = false;
  @Output()
  showCreationModalChange = new EventEmitter<boolean>();
  @Output()
  updateTaskList = new EventEmitter();

  taskForm : TaskResponseInterface = {} as TaskResponseInterface;
  listCategories : TaskCategoryResponseInterface [] = [];

  constructor(private categoryService : CategoriesService, private taskService : TaskService ) {
    this.taskForm.idCategory = 0;
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  closeCreationModal(){
    this.showCreationModalChange.emit(false);
  }

  getAllCategories() :void {
    this.categoryService.listAllCategories().pipe(take(1)).subscribe({
      next : response => this.listCategories = response,
      error : err => console.log(err)
    })
  }

  createTask () : void {
    console.log(this.taskForm);
    this.taskForm.idStatus = this.taskStatus.id;
    this.taskService.createTask(this.taskForm).pipe(take(1)).subscribe({
      next : response => {
        this.updateTaskList.emit(1);
        this.closeCreationModal();
      },
      error : err => console.log(err)
    })
  }
}
