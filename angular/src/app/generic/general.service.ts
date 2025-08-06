
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class General {
  private http = inject(HttpClient);
  private baseUrl = environment.apiURL;

  constructor() {}

  // GET
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params });
  }

  getById<T>(endpoint: string, id: number | string): Observable<T> {
  return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`);
}


  post<T>(endpoint: string, body: unknown): Observable<T> {
  return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body);
}

put<T>(endpoint: string, body: unknown): Observable<T> {
  return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body);
}


  // DELETE
delete<T>(endpoint: string, id: number | string): Observable<T> {
  return this.http.delete<T>(`${this.baseUrl}/${endpoint}/${id}`);
}



}
