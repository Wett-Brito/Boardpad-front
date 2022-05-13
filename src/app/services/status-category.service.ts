import { StatusTaskInterface } from './../interfaces/status-task-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StatusCategoryService {

  constructor(private httpClient : HttpClient) { }

  listAllStatusCategories() : Observable <StatusTaskInterface []> {
    return this.httpClient.get("/api/status") as Observable <StatusTaskInterface []>;
  }

  createNewStatus (name : string) : Observable <any> {
    return this.httpClient.post('/api/status', name);
  }
}
