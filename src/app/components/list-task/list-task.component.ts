import { StatusTaskInterface } from './../../interfaces/status-task-interface';
import { GroupedTasks } from './../../interfaces/grouped-tasks';
import { StatusCategoryService } from './../../services/status-category.service';
import { TaskService } from './../../services/task.service';
import { TaskResponseInterface } from './../../interfaces/task-response-interface';
import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css'],
})
export class ListTaskComponent implements OnInit {
  listTasks: TaskResponseInterface[] = [];
  listStatusCategories: StatusTaskInterface[] = [];
  groupedTasks: GroupedTasks[] = [];

  showModalCreateTask : boolean = false;
  selectedTaskStatus : StatusTaskInterface = {} as StatusTaskInterface;

  newStatusName : string = '';

  constructor(
    private taskService: TaskService,
    private statusService: StatusCategoryService
  ) {
    // this.getAllTasks();
    this.getAllStatus();
  }

  ngOnInit(): void {}

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
    if (this.listStatusCategories.length == 0) alert('erro');
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
    console.log(arrayTest)
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

  onClickCreateTasks(obj = {id : 0, name : ""} ) : void{
    this.selectedTaskStatus = {
      id : obj.id,
      name : obj.name
    };
    this.showModalCreateTask = true;
  }

  onNewStatusNameChange (event : any) : void {
    this.newStatusName = event.target.value;
  }
  createNewStatus() : void{
    this.statusService.createNewStatus(this.newStatusName).pipe(take(1)).subscribe({
      next : response => this.getAllStatus(),
      error : err => console.log(err)
    });
  }
}
