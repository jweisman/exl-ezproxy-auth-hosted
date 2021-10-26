import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService, CloudAppEventsService, InitData } from '@exlibris/exl-cloudapp-angular-lib';
import { of } from 'rxjs';
import { catchError, finalize, skipWhile, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Health } from '../models/service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  initData: InitData;
  health: Health;
  loading = false;

  constructor(
    private events: CloudAppEventsService,
    private http: HttpService,
    private alert: AlertService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.events.getInitData()
    .pipe(
      tap(initData => this.initData = initData),
      switchMap(initData => this.http.get<Health>(`/${initData.instCode}/health`)),
      finalize(() => this.loading = false),
      catchError(e => {
        if (e.status == '400' && e.error && e.error.status) {
          return of(e.error as Health)
        } else throw e;
      })
    )
    .subscribe({
      next: health => this.health = health,
      error: e => this.alert.error(`Could not retrieve health status. ${e.message}`)
    });
  }

  get valid() {
    return this.health?.status == 'ok'
  }

  get isAdmin() {
    return this.initData?.user.isAdmin;
  }

  get url() {
    return `${environment.service}/${this.initData.instCode}`
  }

  ngOnDestroy(): void {
  }
}