import { TaskService } from '../../services/task.service';
import { TaskResponseInterface } from '../../interfaces/task-response-interface';
import { BehaviorSubject, take } from 'rxjs';
import { TaskCategoryResponseInterface } from '../../interfaces/task-category-response-interface';
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

  @Input()
  onSubmitMethod = (taskForm : TaskResponseInterface) => {};

  @Input()
  formType : FormType = FormType.CREATE;

  taskForm: TaskResponseInterface = {} as TaskResponseInterface;

  constructor(
    private taskService: TaskService) {
    this.taskForm.idCategory = 0;
  }

  ngOnInit(): void {
    if (this.formType == FormType.CREATE) {
      this.taskForm.idStatus = this.targetStatusColumn.id;
      this.taskForm.nameStatus = this.targetStatusColumn.name;
    }
    else if (this.formType == FormType.UPDATE) this.taskForm = this.taskToEdit;
  }


  closeCreationModal() {
    this.showModal.emit(false);
  }
  
  formSubmit(event : any) {
    event.preventDefault();
    this.onSubmitMethod(this.taskForm);
  }
}
