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
    this.url = 'http://localhost:3000/api/listas';
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

// public create(item: List): Observable<List> {
//   return this.http.post<List>(this.url, item);
// }

// public getAll(params?: string): Observable<T[]> {
//   if (!params) params = '';
//   return this.http.get<T[]>(`${this.url}/${this.endpoint}${params}`);
// }

// public getOne(item: T | string): Observable<T> {
//   let id = typeof item === 'string' ? item : item.id;
//   return this.http.get<T>(`${this.url}/${this.endpoint}/${id}`);
// }

// public delete(item: T | string) {
//   let id = typeof item === 'string' ? item : item.id;
//   return this.http.delete(`${this.url}/${this.endpoint}/${id}`);
// }

// public update(item: T): Observable<T> {
//   return this.http.put<T>(`${this.url}/${this.endpoint}/${item.id}`, item);
// }
