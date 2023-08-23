import { TaskCategoryResponseInterface } from './../../interfaces/task-category-response-interface';
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

import { BehaviorSubject, take } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { CategoriesService } from 'src/app/services/categories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css'],
})
export class ListTaskComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  selectedTaskStatusId = new BehaviorSubject<number>(0);

  boardCode: string = "";
  listCategories: TaskCategoryResponseInterface[] = [];
  listStatusCategories: StatusTaskInterface[] = [];
  groupedTasks: GroupedTasks[] = [];

  showModalCreateTask: boolean = false;

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

  newCategoryName: string = '';

  constructor(
    private taskService: TaskService,
    private statusService: StatusCategoryService,
    private categoryService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService
  ) {
    const routeParams = this.route.snapshot.paramMap;
    this.boardCode = routeParams.get('board-code') || "";
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

  onClickCreateTasks(id: number): void {
    this.selectedTaskStatusId.next(id);
    this.showModalCreateTask = true;
  }

  closeModalCreateTask(): void {
    this.showModalCreateTask = false;
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
  onClickDeleteStatus(status: GroupedTasks): void {
    this.showModalConfirmation = true;
    this.dataModalConfirmation = {
      method: this.deleteStatus,
      data: status.id
    }
    this.titleModalConfirmation = "Delete this status?"
    this.textModalConfirmation = `If you delete  "${status.name}" status, all of its tasks will be moved to the "Unparented" status column.`;
  }
  addCategory() {
    this.progressTags = true;
    if (this.boardCode == null || this.boardCode.length == 0) return;
    this.categoryService.createCategory(this.newCategoryName, this.boardCode).pipe(take(1)).subscribe({
      next: response => this.getBoardData(),
      error: err => console.log(err)
    })
    this.newCategoryName = "";
    this.progressTags = false
  }
  removeCategory(id: number): void {
    if (this.boardCode == null || this.boardCode.length == 0) return;
    this.progressTags = true;
    this.categoryService.removeCategory(id, this.boardCode).pipe(take(1)).subscribe({
      next: response => this.getBoardData(),
      error: err => console.log(err)
    })
    this.progressTags = false
  }

  updateStatusName(event: any, statusId: number) {
    event.preventDefault();

    if (this.boardCode == null || this.boardCode.length == 0) return;
    let newStatusName: string = event.target.value;
    this.statusService.updateStausName(statusId, newStatusName, this.boardCode).pipe(take(1))
      .subscribe({
        error: err => console.error(err),
        complete: () => this.getBoardData()
      })
  }
}
