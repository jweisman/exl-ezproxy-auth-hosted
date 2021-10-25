import { Component, OnInit, ViewChild } from "@angular/core";
import { CloudAppEventsService, InitData } from "@exlibris/exl-cloudapp-angular-lib";
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  initData: InitData;
  @ViewChild('testform') form: HTMLFormElement;

  constructor(
    private events: CloudAppEventsService,
  ) {}

  ngOnInit() {
    this.events.getInitData()
    .subscribe(initData => this.initData = initData);
  }

  submit() {
    this.form.nativeElement.submit();
  }

  get url() {
    return `${environment.service}/${this.initData.instCode}`
  }
}