import { Routes } from '@angular/router';
import { TestModuleComponent } from './test-module/test-module.component';
import { TestUiComponent } from './test-ui/test-ui.component';
import { TestAppComponent } from './test-app/test-app.component';

export const ROUTES: Routes = [
{ path: '', component: TestModuleComponent },
{ path: 'testModule', component: TestModuleComponent },
{ path: 'testUi', component: TestUiComponent },
{ path: 'testApp', component: TestAppComponent }
];
