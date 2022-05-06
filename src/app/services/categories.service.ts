import { TaskCategoryResponseInterface } from './../interfaces/task-category-response-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private httpClient : HttpClient) { }

  listAllCategories() : Observable<TaskCategoryResponseInterface[]> {
    return this.httpClient.get(`${environment.urlBase}/categories`) as Observable<TaskCategoryResponseInterface[]>;
  }
}
