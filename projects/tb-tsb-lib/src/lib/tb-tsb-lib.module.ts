import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TbTsbLibComponent } from './tb-tsb-lib.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { MatSelectModule, MatInputModule, MatAutocompleteModule, MatProgressSpinnerModule, MatTooltipModule, MatChipsModule, MatIconModule, MatButtonModule } from '@angular/material';
import { RepositoryModule } from './_repositories/repository.module';

@NgModule({
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    MatSelectModule, MatInputModule, MatAutocompleteModule, MatProgressSpinnerModule, MatTooltipModule, MatChipsModule, MatIconModule, MatButtonModule,
    RepositoryModule
  ],
  declarations: [
    TbTsbLibComponent, SearchBoxComponent
  ],
  exports: [
    TbTsbLibComponent, SearchBoxComponent
  ]
})
export class TbTsbLibModule { }
