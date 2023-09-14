import { TaskResponseInterface } from './../interfaces/task-response-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupedTasks } from '../interfaces/grouped-tasks';
import { GenericResponse } from '../interfaces/generic-reponse-interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient : HttpClient) { }

  listAllTasks(boardCode = "board-test") : Observable <GroupedTasks []> {
    return this.httpClient.get("/api/tasks", {
      params: {
        "board-code": boardCode
      }
    }) as Observable <GroupedTasks []>;
  }
  updateTaskStatus (taskId : number, newStatusId : number, boardCode : string) : Observable<TaskResponseInterface>{
    return this.httpClient.put(`/api/tasks/${taskId}/status`, {}, {
      params: {
        "board-code": boardCode,
        "new-status-id" : newStatusId
      }
    }) as Observable<TaskResponseInterface>;
  }

  createTask (task : TaskResponseInterface, boardCode : string) : Observable <TaskResponseInterface>{
    return this.httpClient.post(`/api/tasks`, task, {
      params: {
        "board-code": boardCode
      }
    }) as Observable<TaskResponseInterface>;
  }

  deleteTaskById(taskId : number, boardCode : string) : Observable <any>{
    return this.httpClient.delete(`/api/tasks/${taskId}`, {
      params: {
        "board-code": boardCode
      }
    }) as Observable<TaskResponseInterface>;
  }

  getTaskById (taskId : number) : Observable <GenericResponse<TaskResponseInterface>> {
    return this.httpClient.get(`/api/tasks/${taskId}`) as Observable<GenericResponse<TaskResponseInterface>> ;
  }
}
