import { TaskCategoryResponseInterface } from './../interfaces/task-category-response-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private httpClient : HttpClient) { }

  listAllCategories() : Observable<TaskCategoryResponseInterface[]> {
    return this.httpClient.get(`/api/category`) as Observable<TaskCategoryResponseInterface[]>;
  }
  createCategory (name : string) :  Observable<TaskCategoryResponseInterface> {
    return this.httpClient.post(`/api/category?newCategoryName=${name}`, {}) as Observable<TaskCategoryResponseInterface>;
  }
  removeCategory (id : number) :  Observable<any> {
    return this.httpClient.delete(`/api/category/${id}`, {}) as Observable<any>;
  }
}
