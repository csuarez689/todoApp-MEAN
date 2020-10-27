import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { List } from '../models/list';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private url: string;

  constructor(protected http: HttpClient) {
    this.url = 'https://todo-app-mean-2020.herokuapp.com/api/listas';
  }

  public create(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.url}/${task.idLista}/tareas`, task);
  }

  public getAllTasksFromList(
    list: List | string,
    params?: string
  ): Observable<Task[]> {
    let idLista = typeof list === 'string' ? list : list.id;
    if (!params) params = '';
    return this.http.get<Task[]>(`${this.url}/${idLista}/tareas${params}`);
  }

  public getOneTaskFromList(
    task: Task | string,
    list: List | string
  ): Observable<Task> {
    let idLista = typeof list === 'string' ? list : list.id;
    let idTarea = typeof task === 'string' ? task : task.id;
    return this.http.get<Task>(`${this.url}/${idLista}/tareas/${idTarea}`);
  }

  public delete(task: Task | string, list: List | string) {
    let idLista = typeof list === 'string' ? list : list.id;
    let idTarea = typeof task === 'string' ? task : task.id;
    return this.http.delete(`${this.url}/${idLista}/tareas/${idTarea}`);
  }

  public update(task: Task | string, list: List | string): Observable<Task> {
    let idLista = typeof list === 'string' ? list : list.id;
    let idTarea = typeof task === 'string' ? task : task.id;
    return this.http.put<Task>(
      `${this.url}/${idLista}/tareas/${idTarea}`,
      task
    );
  }

  // upload image
  public uploadImage(
    task: Task | string,
    list: List | string,
    file
  ): Observable<Task> {
    let idLista = typeof list === 'string' ? list : list.id;
    let idTarea = typeof task === 'string' ? task : task.id;
    let formData = new FormData();
    formData.append('imagen', file);
    return this.http.post<Task>(
      `${this.url}/${idLista}/tareas/${idTarea}/imagen`,
      formData
    );
  }
}
