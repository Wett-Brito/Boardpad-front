import { StatusTaskInterface } from './../../interfaces/status-task-interface';
import { GroupedTasks } from './../../interfaces/grouped-tasks';
import { StatusCategoryService } from './../../services/status-category.service';
import { TaskService } from './../../services/task.service';
import { TaskResponseInterface } from './../../interfaces/task-response-interface';
import { Component, OnInit, Input, Output } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from 'src/app/services/board.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css'],
})
export class ListTaskComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  taskToEdit : TaskResponseInterface = {} as TaskResponseInterface;
  newTaskStatus : StatusTaskInterface = {}  as StatusTaskInterface;

  boardCode: string = "";
  listStatusCategories: StatusTaskInterface[] = [];
  groupedTasks: GroupedTasks[] = [];

  showModalCreateTask: boolean = false;
  showEditModal: boolean = false;

  // Controle do Modal de Confirmação
  showModalConfirmation: boolean = false;
  dataModalConfirmation: any = {
    method: () => { },
    data: {}
  };
  titleModalConfirmation = "";
  textModalConfirmation = "";

  progressNewStatus: boolean = false;
  progressTags: boolean = false;

  constructor(
    private taskService: TaskService,
    private statusService: StatusCategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService
  ) {
    const routeParams = this.route.snapshot.paramMap;
    this.boardCode = routeParams.get('board-code') || "";
  }

  updateTask = (taskForm : TaskResponseInterface): void =>{
    if (this.boardCode == null || this.boardCode.length == 0) return;
    this.taskService.updateTaskData(this.taskToEdit.id, taskForm).pipe(take(1)).subscribe({
      next : () => {
        this.closeModalUpdateTaskModal();
        this.getBoardData();
      },
      error: err => console.error("Error during task updating data. ", err)
    });
  }

  createTask = (taskForm : TaskResponseInterface): void => {
    if (this.boardCode == null || this.boardCode.length == 0) return;
    this.taskService.createTask(taskForm, this.boardCode).pipe(take(1)).subscribe({
      next: () => {
        this.getBoardData();
        this.closeModalCreateTask();
      },
      error: err => console.error(err)
    })
  }

  ngOnInit(): void {
    this.getBoardData();
  }

  getBoardData(): void {
    this.boardService.getBoardIfExists(this.boardCode).pipe(take(1)).subscribe({
      next: responseData => {
        this.groupedTasks = responseData.response.status;
        // To Get All Status that haven't tasks
        this.getAllStatus();
      },
      error: err => {
        if (err.status == 404) {
          this.createNewBoard();
        }
        else {
          alert("Internal server error. Try again later.");
          this.router.navigate(['/'])
        }
      }
    })
  }
  createNewBoard(): void {
    this.boardService.createBoard(this.boardCode).pipe(take(1)).subscribe({
      next: () => this.getBoardData(),
      error: err => {
        console.error(`Erro ao tentar criar o board [${this.boardCode}]`, err);
        alert(`Erro ao tentar criar o board [${this.boardCode}]`);
      }
    });
  }
  getAllTasks(): void {
    if (this.boardCode == null || this.boardCode.length == 0) return;
    this.taskService.listAllTasks(this.boardCode).pipe(take(1)).subscribe({
      next: response => {
        this.groupedTasks = response;
        // To Get All Status that haven't tasks
        this.getAllStatus();
      }
    })
  }
  getAllStatus(): void {
    this.statusService.listAllStatusCategories(this.boardCode).pipe(take(1)).subscribe({
      next: response => {
        this.addStatusWithNoTasksToGroupedTasks(response);
      },
      error: err => console.error(err)
    });
  }
  addStatusWithNoTasksToGroupedTasks(allStatus: StatusTaskInterface[]): void {
    allStatus.forEach(item => {
      if (this.groupedTasks.filter(groupedTask => groupedTask.id == item.id).length <= 0)
        this.groupedTasks.push(item as GroupedTasks);
    })
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
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.taskService
        .updateTaskStatus(task.id, newIdStatus, this.boardCode)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            task = response;
          },
          error: err => {
            transferArrayItem(
              event.container.data,
              event.previousContainer.data,
              event.currentIndex,
              event.previousIndex
            );
            if (err.status == 404) alert('This status was not found on this board.');
            else if (err.status > 499) alert('Internal Server Error. Unable to move this task. Try again later.');
          }
        });
    }
  }

  onClickCreateTasks(id : number, name: string): void {
    this.newTaskStatus =  {id : id, name: name};
    this.showModalCreateTask = true;
  }

  onClickViewTask(taskId : number) {
    this.taskService.getTaskById(taskId).pipe(take(1)).subscribe({
      next : resp => {
        this.showEditModal = true;
        this.taskToEdit = resp.response;
      },
      error: err => alert("Error while searching for task data.")
    });
  }

  closeModalCreateTask(): void {
    this.showModalCreateTask = false;
    this.newTaskStatus = {} as StatusTaskInterface;
  }
  closeModalUpdateTaskModal() : void {
    this.showEditModal = false;
    this.taskToEdit = {} as TaskResponseInterface;
  }
  createNewStatus(newStatusName: string = "New status"): void {
    if (this.boardCode == null || this.boardCode.length == 0) return;
    this.progressNewStatus = true;
    this.statusService
      .createNewStatus(newStatusName, this.boardCode)
      .pipe(take(1))
      .subscribe({
        error: (err) => console.log(err),
        complete: () => {
          this.getBoardData();
        }
      });
    this.progressNewStatus = false
  }
  deleteStatus = (idStatus: number): void => {
    if (this.boardCode == null || this.boardCode.length == 0) return;
    this.progressNewStatus = true;
    this.statusService
      .deleteStatus(idStatus, this.boardCode)
      .pipe(take(1))
      .subscribe({
        next: (response) => this.getBoardData(),
        error: (err) => {
          if (err.status === 404) alert(err.error);
          else if (err.status != 404) console.error(err);
        }
      });
    this.progressNewStatus = false
  }
  deleteTask = (taskId : number) : void =>{
    this.taskService.deleteTaskById(taskId, this.boardCode).pipe(take(1)).subscribe({
      next : () => this.getBoardData(),
      error: err => {
        if(err.status > 399 && err.status < 500) alert("Task could not be deleted.");
        else alert("Internal Server Error. Please, try again later.");
        this.getBoardData();
      }
    });
  }

  onClickDeleteTask(task: TaskResponseInterface): void {
    console.log(task);
    this.showModalConfirmation = true;
    this.dataModalConfirmation = {
      method: this.deleteTask,
      data: task.id
    }
    this.titleModalConfirmation = "Delete this task?"
    this.textModalConfirmation = `If you delete "${task.title}" task, all of its data will be permanently deleted.`;
  }
  onClickDeleteStatus(status: GroupedTasks): void {
    this.showModalConfirmation = true;
    this.dataModalConfirmation = {
      method: this.deleteStatus,
      data: status.id
    }
    this.titleModalConfirmation = "Delete this status?"
    this.textModalConfirmation = `If you delete  "${status.name}" status, all of its tasks will be moved to the "Unparented" status column.`;
  }
  

  updateStatusName(event: any, statusId: number) {
    event.preventDefault();

    if (this.boardCode == null || this.boardCode.length == 0) return;
    let newStatusName: string = event.target.value;
    this.statusService.updateStausName(statusId, newStatusName, this.boardCode).pipe(take(1))
      .subscribe({
        next : () => this.updateColumnNameOfTasksList(statusId, newStatusName),
        error: err => console.error(err),
        complete: () => this.getBoardData()
      })
  }
  updateColumnNameOfTasksList (id : number, name : string) : void {
    let index = this.groupedTasks.findIndex(item => item.id == id );
    this.groupedTasks[index].name = name;
  }
  
}
