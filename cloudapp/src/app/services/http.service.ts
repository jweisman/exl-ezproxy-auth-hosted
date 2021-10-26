import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CloudAppEventsService } from "@exlibris/exl-cloudapp-angular-lib";
import { of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private _token: string;

  constructor(
    private events: CloudAppEventsService,
    private http: HttpClient,
  ) { }

  get<T = any>(uri: string, options: { params?: HttpParams, headers?: HttpHeaders  } = { params: null, headers: null }) {
    if (!options.headers) options.headers = new HttpHeaders();
    return this.getToken().pipe(
      tap(token => {
        options.headers = options.headers
          .set('Authorization', `Bearer ${token}`)
      }),
      /* observe: response allows body of 400 error message to be retrieved and parsed */
      switchMap(() => this.http.get<T>(`${environment.service}${uri}`, { observe: 'response', ...options })),
      map(response => response.body as T),
    )
  }

  put<T = any>(uri: string, body: any, options: { params?: HttpParams, headers?: HttpHeaders } = { params: null, headers: null }) {
    if (!options.headers) options.headers = new HttpHeaders();
    return this.getToken().pipe(
      tap(token => {
        options.headers = options.headers
          .set('Authorization', `Bearer ${token}`)
      }),
      switchMap(() => this.http.put<T>(`${environment.service}${uri}`, body, options)),
    )
  }

  post<T = any>(uri: string, body: any, options: { params?: HttpParams, headers?: HttpHeaders } = { params: null, headers: null }) {
    if (!options.headers) options.headers = new HttpHeaders();
    return this.getToken().pipe(
      tap(token => {
        options.headers = options.headers
          .set('Authorization', `Bearer ${token}`)
      }),
      switchMap(() => this.http.post<T>(`${environment.service}${uri}`, body, options)),
    )
  }

  getToken() {
    if (!!this._token) return of(this._token);
    return this.events.getAuthToken().pipe(
      tap(token => this._token = token)
    )
  }
}