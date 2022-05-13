import { TaskResponseInterface } from './../interfaces/task-response-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient : HttpClient) { }

  listAllTasks() : Observable <TaskResponseInterface []> {
    return this.httpClient.get("/api/tasks") as Observable <TaskResponseInterface []>;
  }
  updateTaskStatus (task : TaskResponseInterface, newStatusId : number) : Observable<TaskResponseInterface>{
    task.idStatus = newStatusId;
    return this.httpClient.put(`/api/tasks/${task.id}`, task) as Observable<TaskResponseInterface>;
  }

  createTask (task : TaskResponseInterface) : Observable <TaskResponseInterface>{
    return this.httpClient.post(`/api/tasks`, task) as Observable<TaskResponseInterface>;
  }
}
