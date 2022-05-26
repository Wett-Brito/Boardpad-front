import { TaskCategoryResponseInterface } from './../../interfaces/task-category-response-interface';
import { StatusTaskInterface } from './../../interfaces/status-task-interface';
import { GroupedTasks } from './../../interfaces/grouped-tasks';
import { StatusCategoryService } from './../../services/status-category.service';
import { TaskService } from './../../services/task.service';
import { TaskResponseInterface } from './../../interfaces/task-response-interface';
import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { take } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css'],
})
export class ListTaskComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  listCategories : TaskCategoryResponseInterface [] = [];
  listTasks: TaskResponseInterface[] = [];
  listStatusCategories: StatusTaskInterface[] = [];
  groupedTasks: GroupedTasks[] = [];

  showModalCreateTask: boolean = false;

  // Controle do Modal de Confirmação
  showModalConfirmation: boolean = false;
  dataModalConfirmation : any = {
    method : () =>{},
    data : {}
  };
  titleModalConfirmation = "";
  textModalConfirmation = "";


  progressNewStatus : boolean = false;
  progressTags : boolean = false;
  selectedTaskStatus: StatusTaskInterface = {} as StatusTaskInterface;

  newStatusName: string = '';
  newCategoryName : string = '';

  constructor(
    private taskService: TaskService,
    private statusService: StatusCategoryService,
    private categoryService : CategoriesService
  ) {
    this.refreshPage();
  }

  ngOnInit(): void {}

  refreshPage () : void {
    this.categoryService.listAllCategories().pipe(take(1)).subscribe({
      next : response => this.listCategories = response,
      error : err => console.log(err)
    });
    this.getAllStatus();
  }

  getAllStatus(): void {
    this.statusService.listAllStatusCategories().subscribe({
      next: (response) => (this.listStatusCategories = response),
      error: (err) => console.error(err),
      complete: () => {
        this.taskService.listAllTasks().subscribe({
          next: (response) => (this.listTasks = response),
          error: (err) => console.log(err),
          complete: () => this.groupByCategory(),
        });
      },
    });
  }

  getAllTasks(): void {
    this.taskService.listAllTasks().subscribe({
      next: (response) => {
        this.listTasks = response;
        this.groupByCategory();
      },
      error: (err) => console.log(err),
    });
  }

  groupByCategory(): void {
    this.groupedTasks = [];
    let arrayTest: any[] = [];
    if (this.listStatusCategories == null || this.listStatusCategories.length == 0) return;
    this.listStatusCategories.forEach((categoryItem, index, arr) => {
      let newObject: GroupedTasks = {
        id: categoryItem.id,
        name: categoryItem.name,
        tasks: this.listTasks.filter(
          (taskItem) => taskItem.idStatus === categoryItem.id
        ),
      };
      arrayTest.push(newObject);
    });
    console.log(arrayTest);
    this.groupedTasks.push(...arrayTest);
  }

  changeStatusTask(
    task: TaskResponseInterface,
    newIdStatus: number
  ): TaskResponseInterface {
    let updatedTask: TaskResponseInterface = {} as TaskResponseInterface;
    this.taskService
      .updateTaskStatus(task.id, newIdStatus)
      .pipe(take(1))
      .subscribe({
        next: (response) => (updatedTask = response),
        error: (err) => {
          console.log(err);
        },
      });
    return updatedTask;
  }

  onDropCard(
    event: CdkDragDrop<
      TaskResponseInterface[],
      TaskResponseInterface[],
      TaskResponseInterface
    >,
    newIdStatus: number
  ) {
    let task: TaskResponseInterface = event.item.data;
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Fazer update
      let updatedTaskData: TaskResponseInterface = this.changeStatusTask(
        task,
        newIdStatus
      );
      if (updatedTaskData !== null) {
        console.log(task);
        task = updatedTaskData;
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else alert('Erro ao mudar status da task');
    }
  }

  onClickCreateTasks(obj = { id: 0, name: '' }): void {
    this.selectedTaskStatus = {
      id: obj.id,
      name: obj.name,
    };
    this.showModalCreateTask = true;
  }

  createNewStatus(): void {
    this.progressNewStatus = true;
    this.statusService
      .createNewStatus(this.newStatusName)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.newStatusName = '';
          this.getAllStatus();
        },
        error: (err) => console.log(err)
      });
      this.progressNewStatus = false
  }
  deleteStatus = (idStatus: number) : void => {
    this.progressNewStatus = true;
    this.statusService
      .deleteStatus(idStatus)
      .pipe(take(1))
      .subscribe({
        next: (response) =>  this.getAllStatus(),
        error: (err) => {
          if (err.status === 400) alert(err.error);
        }
      });
      this.progressNewStatus = false
  }
  onClickDeleteStatus( status : GroupedTasks ) : void {
    this.showModalConfirmation = true;
    this.dataModalConfirmation = {
      method : this.deleteStatus,
      data : status.id
    }
    this.titleModalConfirmation = "Confirmar remoção"
    this.textModalConfirmation = `Deletando este o status ${status.name} você também deletará todas as Tasks relacionada à ele`;
  }
  addCategory () {
    this.progressTags = true;
    this.categoryService.createCategory(this.newCategoryName).pipe(take(1)).subscribe({
      next : response => this.refreshPage(),
      error : err => console.log(err)
    })
    this.newCategoryName = "";
    this.progressTags = false
  }
  removeCategory (id : number) : void {
    this.progressTags = true;
    this.categoryService.removeCategory(id).pipe(take(1)).subscribe({
      next : response => this.refreshPage(),
      error : err => console.log(err)
    })
    this.progressTags = false
  }
}
