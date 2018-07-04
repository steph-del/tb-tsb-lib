import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TbTsbLibComponent } from './tb-tsb-lib.component';

describe('TbTsbLibComponent', () => {
  let component: TbTsbLibComponent;
  let fixture: ComponentFixture<TbTsbLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TbTsbLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TbTsbLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
