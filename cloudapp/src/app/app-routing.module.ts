import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent, ConfigurationGuard } from './configuration/configuration.component';
import { TestComponent } from './test/test.component';
import { ErrorComponent } from './error.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'configuration', component: ConfigurationComponent, canActivate: [ ConfigurationGuard ]},
  { path: 'error', component: ErrorComponent },
  { path: 'test', component: TestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
