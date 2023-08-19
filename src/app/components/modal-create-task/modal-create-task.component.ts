import { TaskService } from './../../services/task.service';
import { TaskResponseInterface } from './../../interfaces/task-response-interface';
import { BehaviorSubject, take } from 'rxjs';
import { TaskCategoryResponseInterface } from './../../interfaces/task-category-response-interface';
import { CategoriesService } from './../../services/categories.service';
import { StatusTaskInterface } from './../../interfaces/status-task-interface';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { StatusCategoryService } from 'src/app/services/status-category.service';

@Component({
  selector: 'app-modal-create-task',
  templateUrl: './modal-create-task.component.html',
  styleUrls: ['./modal-create-task.component.css']
})
export class ModalCreateTaskComponent implements OnInit {
  @Input()
  boardCode = "";
  @Input()
  idStatusSubj: BehaviorSubject<number> = new BehaviorSubject(0);
  @Output()
  showCreationModal = new EventEmitter<boolean>();
  @Output()
  updateTaskList = new EventEmitter();
  @Input()
  listCategories: TaskCategoryResponseInterface[] = [];

  idStatus: number = 0;
  taskStatus: StatusTaskInterface = {} as StatusTaskInterface;
  taskForm: TaskResponseInterface = {} as TaskResponseInterface;

  constructor(
    private statusService: StatusCategoryService,
    private categoryService: CategoriesService,
    private taskService: TaskService) {
    this.taskForm.idCategory = 0;
  }
  
  ngOnInit(): void {
    this.idStatusSubj.subscribe({next : id => this.idStatus = id});
      this.getAllCategories();
      this.getStatusData();
  }

  closeCreationModal() {
    this.showCreationModal.emit(false);
  }
  getStatusData(): void {
    this.statusService.getStatusById(this.idStatus).pipe(take(1)).subscribe({
      next: response => this.taskStatus = response,
      error: err => console.error(err)
    });
  }
  getAllCategories(): void {
    if (this.boardCode == null || this.boardCode.length == 0) return;
    this.categoryService.listAllCategories(this.boardCode).pipe(take(1)).subscribe({
      next: response => {
        this.listCategories = response.response;
      },
      error: err => (err.status != 404) && console.log(err)
    })
  }

  createTask(): void {
    console.log(this.taskForm);
    this.taskForm.idStatus = this.taskStatus.id;
    if (this.boardCode == null || this.boardCode.length == 0) return;
    this.taskService.createTask(this.taskForm, this.boardCode).pipe(take(1)).subscribe({
      next: response => {
        this.updateTaskList.emit(1);
        this.closeCreationModal();
      },
      error: err => console.log(err)
    })
  }
}
