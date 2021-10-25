import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  template: "{{error}}"
})
export class ErrorComponent  {
  error: string;
  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.error = errorMessages[params['error']] || 'An error has occurred.';
    });
  }
}

const errorMessages = {
  'NO_ACCESS': "The general Administrator role is required for access to this page."
}

export enum ErrorMessages {
  NO_ACCESS = 'NO_ACCESS'
} 