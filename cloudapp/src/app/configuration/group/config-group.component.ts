import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormControl } from "@angular/forms";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { CodeTableRow } from "../../models/alma";

@Component({
  selector: 'app-config-group',
  templateUrl: './config-group.component.html',
  styleUrls: ['./config-group.component.scss']
})
export class ConfigGroupComponent implements OnInit {

  @Input() group: FormArray;
  @Input() usergroups: CodeTableRow[] = [];
  groupCtrl: FormControl = new FormControl();
  usergroupsFiltered: Observable<CodeTableRow[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('groupInput') groupInput: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.usergroupsFiltered = this.groupCtrl.valueChanges
    .pipe(
      startWith(''),
      map((text: string | null) => text && typeof text == 'string' ? this._filter(text) : this.usergroups.slice()),
    );
  }

  add(event: MatChipInputEvent): void {
    /* Don't allow additional entries */
  }

  remove(i: number): void {
    this.group.removeAt(i);
    this.groupCtrl.setValue('');
    this.groupInput.nativeElement.value = '';
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const code = event.option.value.code;
    if (this.group.controls.findIndex((g: FormControl) => g.value == code) < 0) {
      this.group.push(new FormControl(code));
    }
    this.groupCtrl.setValue('');
    this.groupInput.nativeElement.value = '';
  }

  private _filter(value: string): CodeTableRow[] {
    const filterValue = value.toLowerCase();
    return this.usergroups.filter(group => group.description.toLowerCase().includes(filterValue));
  }
}