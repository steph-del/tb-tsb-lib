import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { SearchBoxComponent } from './search-box.component';
import { MatSelectModule, MatInputModule, MatAutocompleteModule, MatProgressSpinnerModule, MatTooltipModule, MatChipsModule, MatIconModule, MatButtonModule } from '@angular/material';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;
  let http: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchBoxComponent
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        CommonModule,
        MatSelectModule, MatInputModule, MatAutocompleteModule, MatProgressSpinnerModule, MatTooltipModule, MatChipsModule, MatIconModule, MatButtonModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
