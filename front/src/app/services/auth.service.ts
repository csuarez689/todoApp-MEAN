import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string;
  private tokenRequestTimeout;
  private headers = new HttpHeaders();

  constructor(private router: Router, private http: HttpClient) {
    this.url = 'http://localhost:3000/api/users';
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }

  //login
  login(user: User) {
    return this.http
      .post<User>(`${this.url}/login`, user, {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        map((res) => {
          localStorage.setItem('token', res.headers.get('x-access-token'));
          this.startTokenTimer();
          return res.body as User;
        })
      );
  }

  //register
  register(user: User) {
    return this.http
      .post<User>(`${this.url}/register`, user, {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        map((res) => {
          localStorage.setItem('token', res.headers.get('x-access-token'));
          this.startTokenTimer();
          return res.body as User;
        })
      );
  }

  //logout
  logout() {
    localStorage.removeItem('token');
    this.stopTokenTimer();
    this.router.navigate(['/login']);
  }

  //obtain new access token
  getNewAccessToken(): Observable<any> {
    return this.http
      .get<any>(`${this.url}/refreshToken`, {
        headers: this.headers,
        observe: 'response',
      })
      .pipe(
        map((res) => {
          localStorage.setItem('token', res.headers.get('x-access-token'));
          this.startTokenTimer();
          return res.body as User;
        })
      );
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.url}/me`);
  }

  //----------------HELPERS-----------------------

  private startTokenTimer() {
    const timeout = 1000 * 60 * 30;
    this.tokenRequestTimeout = setTimeout(
      () => this.getNewAccessToken().subscribe(),
      timeout
    );
  }

  private stopTokenTimer() {
    clearTimeout(this.tokenRequestTimeout);
  }

  //obtain token from local storage
  public getToken(): string {
    return localStorage.getItem('token');
  }
}
