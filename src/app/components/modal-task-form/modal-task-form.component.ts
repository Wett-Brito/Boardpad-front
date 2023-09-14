import { TaskService } from '../../services/task.service';
import { TaskResponseInterface } from '../../interfaces/task-response-interface';
import { BehaviorSubject, take } from 'rxjs';
import { TaskCategoryResponseInterface } from '../../interfaces/task-category-response-interface';
import { CategoriesService } from '../../services/categories.service';
import { StatusTaskInterface } from '../../interfaces/status-task-interface';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { StatusCategoryService } from 'src/app/services/status-category.service';
import { FormType } from 'src/app/enumerators/form-type-enum';

@Component({
  selector: 'app-modal-task-form',
  templateUrl: './modal-task-form.component.html',
  styleUrls: ['./modal-task-form.component.css']
})
export class ModalTaskFormComponent implements OnInit {
  // Task to edit
  @Input()
  taskToEdit: TaskResponseInterface = {} as TaskResponseInterface;
  // Used when creates task
  @Input()
  targetStatusColumn : StatusTaskInterface = {} as StatusTaskInterface;
  @Input()
  boardCode = "";
  @Output()
  showModal = new EventEmitter<boolean>();
  @Output()
  updateTaskList = new EventEmitter();
  @Input()
  listCategories: TaskCategoryResponseInterface[] = [];

  @Input()
  onSubmitMethod = (taskForm : TaskResponseInterface) => {};

  @Input()
  formType : FormType = FormType.CREATE;

  taskForm: TaskResponseInterface = {} as TaskResponseInterface;

  constructor(
    private categoryService: CategoriesService,
    private taskService: TaskService) {
    this.taskForm.idCategory = 0;
  }

  ngOnInit(): void {
    if (this.formType == FormType.CREATE) {
      this.taskForm.idStatus = this.targetStatusColumn.id;
      this.taskForm.nameStatus = this.targetStatusColumn.name;

      this.getAllCategories();
    }
    else if (this.formType == FormType.UPDATE) this.taskForm = this.taskToEdit;
  }


  closeCreationModal() {
    this.showModal.emit(false);
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
  formSubmit(event : any) {
    event.preventDefault();
    this.onSubmitMethod(this.taskForm);
  }
}
