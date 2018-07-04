import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { TbTsbLibModule } from 'tb-tsb-lib';
import { TestModuleComponent } from './test-module/test-module.component';
import { TestUiComponent } from './test-ui/test-ui.component';
import { TestAppComponent } from './test-app/test-app.component';

@NgModule({
  declarations: [
    AppComponent,
    TestModuleComponent,
    TestUiComponent,
    TestAppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    TbTsbLibModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
