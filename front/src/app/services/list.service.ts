import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { List } from '../models/list';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private url: string;

  constructor(protected http: HttpClient) {
    this.url = 'https://todo-app-mean-2020.herokuapp.com/api/listas';
  }

  public create(list: List): Observable<List> {
    return this.http.post<List>(this.url, list);
  }

  public getAll(params?: string): Observable<List[]> {
    if (!params) params = '';
    return this.http.get<List[]>(`${this.url}${params}`);
  }

  public getOne(list: List | string): Observable<List> {
    let id = typeof list === 'string' ? list : list.id;
    return this.http.get<List>(`${this.url}/${id}`);
  }

  public delete(list: List | string) {
    let id = typeof list === 'string' ? list : list.id;
    return this.http.delete(`${this.url}/${id}`);
  }

  public update(list: List): Observable<List> {
    return this.http.put<List>(`${this.url}/${list.id}`, list);
  }
}
