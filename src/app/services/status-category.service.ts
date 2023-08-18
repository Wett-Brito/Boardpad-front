import { StatusTaskInterface } from './../interfaces/status-task-interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StatusCategoryService {

  constructor(private httpClient: HttpClient) { }

  listAllStatusCategories(boardCode: string = ''): Observable<StatusTaskInterface[]> {
    return this.httpClient.get("/api/status", {
      params: {
        "board-code": boardCode
      }
    }) as Observable<StatusTaskInterface[]>;
  }

  createNewStatus(name: string, boardCode: string): Observable<any> {

    return this.httpClient.post('/api/status', name, {
      params: {
        "board-code": boardCode,
        "new-status-name" : name
      }
    });
  }

  deleteStatus(idStatus: number, boardCode: string): Observable<any> {
    return this.httpClient.delete(`/api/status/${idStatus}`, {
      params: {
        "board-code": boardCode
      }
    });
  }

  updateStausName(idStatus: number, newName: string, boardCode: string): Observable<any> {
    return this.httpClient.put(`/api/status/${idStatus}/`, {}, {
      params: {
        "board-code": boardCode,
        "new-name": newName
      }
    });
  }
}
