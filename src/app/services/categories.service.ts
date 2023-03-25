import { TaskCategoryResponseInterface } from './../interfaces/task-category-response-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private httpClient: HttpClient) { }

  listAllCategories(boardCode: string): Observable<TaskCategoryResponseInterface[]> {
    return this.httpClient.get(`/api/category`, { params: { "board-code": boardCode } }) as Observable<TaskCategoryResponseInterface[]>;
  }
  createCategory(name: string, boardCode: string): Observable<TaskCategoryResponseInterface> {
    return this.httpClient.post(`/api/category`, {}, { params: { "newCategoryName": name, "board-code": boardCode } }) as Observable<TaskCategoryResponseInterface>;
  }
  removeCategory(id: number, boardCode: string): Observable<any> {
    return this.httpClient.delete(`/api/category/${id}`, {params : {"board-code" : boardCode}}) as Observable<any>;
  }
}
