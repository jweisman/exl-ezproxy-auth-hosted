import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppEventsService, InitData } from '@exlibris/exl-cloudapp-angular-lib';
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
  ) { }

  ngOnInit() {
    this.loading = true;
    this.events.getInitData()
    .pipe(
      tap(initData => this.initData = initData),
      switchMap(initData => this.http.get<Health>(`/${initData.instCode}/health`)),
      finalize(() => this.loading = false),
      catchError(e => of(e.error as Health))
    )
    .subscribe(health => this.health = health);
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