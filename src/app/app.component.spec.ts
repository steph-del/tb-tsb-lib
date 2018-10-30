import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TbTsbLibModule } from 'tb-tsb-lib';
import { TestModuleComponent } from './test-module/test-module.component';
import { TestUiComponent } from './test-ui/test-ui.component';
import { TestAppComponent } from './test-app/test-app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TestModuleComponent,
        TestUiComponent,
        TestAppComponent
      ],
      imports: [
        TbTsbLibModule
      ]
    }).compileComponents();
  }));


  /*it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to tb-tsb-lib-app!');
  }));*/
});
