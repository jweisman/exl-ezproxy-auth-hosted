import { Component, OnInit } from "@angular/core";
import { CloudAppEventsService, InitData } from "@exlibris/exl-cloudapp-angular-lib";
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  initData: InitData;

  constructor(
    private events: CloudAppEventsService,
  ) {}

  ngOnInit() {
    this.events.getInitData()
    .subscribe(initData => this.initData = initData);
  }

  get url() {
    return `${environment.service}/${this.initData.instCode}`
  }
}