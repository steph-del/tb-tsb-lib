import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { TbTsbLibModule } from 'tb-tsb-lib';
import { TestModuleComponent } from './test-module/test-module.component';
import { TestUiComponent } from './test-ui/test-ui.component';
import { TestAppComponent } from './test-app/test-app.component';
import { ElementsComponent } from './elements/elements.component';

@NgModule({
  declarations: [
    AppComponent,
    TestModuleComponent,
    TestUiComponent,
    TestAppComponent,
    ElementsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    TbTsbLibModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  entryComponents: [ElementsComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    const elm = createCustomElement(ElementsComponent, { injector: this.injector });
    customElements.define('tb-taxo-box', elm);
  }
  ngDoBootstrap() { }

}
