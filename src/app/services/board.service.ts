import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private httpClient : HttpClient) { }

  createBoard (name : string ) : Observable <any> {
    return this.httpClient.post(`/api/board/${name || 'random'}`, {}) as Observable <any>;
  }
}
