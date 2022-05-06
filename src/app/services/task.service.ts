import { TaskResponseInterface } from './../interfaces/task-response-interface';
import { environment } from './../../environments/environment';
import { StatusTaskInterface } from './../interfaces/status-task-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient : HttpClient) { }

  listAllTasks() : Observable <TaskResponseInterface []> {
    return this.httpClient.get(environment.urlBase + "/tasks") as Observable <TaskResponseInterface []>;
  }
  updateTaskStatus (task : TaskResponseInterface, newStatusId : number) : Observable<TaskResponseInterface>{
    task.status = newStatusId;
    return this.httpClient.put(`${environment.urlBase}/tasks/${task.id}`, task) as Observable<TaskResponseInterface>;
  }
}
