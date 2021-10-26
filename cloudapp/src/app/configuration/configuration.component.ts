import { Component, Injectable, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { CanActivate, Router } from "@angular/router";
import { AlertService, CloudAppEventsService } from "@exlibris/exl-cloudapp-angular-lib";
import { DialogService } from "eca-components";
import { concat, forkJoin, Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";
import { ErrorMessages } from "../error.component";
import { CodeTableRow } from "../models/alma";
import { configFormGroup } from "../models/config";
import { AlmaService } from "../services/alma.service";
import { HttpService } from "../services/http.service";

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, OnDestroy {

  form: FormGroup;
  saving = false;
  usergroups: CodeTableRow[] = [];
  usergroupsFiltered: Observable<CodeTableRow[]>

  constructor(
    private alma: AlmaService,
    private dialog: DialogService,
    private http: HttpService,
    private alert: AlertService,
  ) {}

  ngOnInit() {
    this.saving = true;
    forkJoin([
      this.alma.getUserGroups(),
      this.http.get('/config'),
    ])
    .pipe(finalize(() => this.saving = false))
    .subscribe(results => {
        const [usergroups, config] = results;
        this.usergroups = usergroups.row.filter(r => r.enabled || r.enabled == null);
        this.form = configFormGroup(config);
      }, 
      e => this.alert.error(`Could not retrieve configuration. ${e.message}`)
    );
  }

  save() {
    this.saving = true;
    this.http.put('/config', this.form.value)
    .pipe(finalize(() => this.saving = false))
    .subscribe({
      error: e => this.alert.error(`Could not save configuration. ${e.message}`)
    });
  }

  ngOnDestroy() {

  }

  remove(name: string) {
    this.groups.removeControl(name)
  }

  add() {
    this.dialog.prompt({ title: 'Add group', prompt: 'Group name' })
    .subscribe( result => {
      if (!result) return;
      this.groups.addControl(result, new FormArray([]));
    })
  }

  get groups() {
    return this.form.controls['groups'] as FormGroup;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationGuard implements CanActivate {
  constructor(
    private events: CloudAppEventsService,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean> {
    return this.events.getInitData()
    .pipe(
      map(initData => {
        if (!initData.user.isAdmin) {
          this.router.navigate(['/error'], 
            { queryParams: { error: ErrorMessages.NO_ACCESS }});
          return false;
        }
        return true;
      })
    )
  }
}