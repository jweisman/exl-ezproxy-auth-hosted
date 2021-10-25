import { Injectable } from "@angular/core";
import { CloudAppRestService } from "@exlibris/exl-cloudapp-angular-lib";
import { map } from "rxjs/operators";
import { CodeTable, sortCodeTable } from "../models/alma";

@Injectable({
  providedIn: 'root'
})
export class AlmaService {

  constructor(
    private rest: CloudAppRestService,

  ) { }

  getUserGroups() {
    return this.rest.call<CodeTable>('/conf/code-tables/UserGroups')
    .pipe(map(table => sortCodeTable(table)));
  }
}