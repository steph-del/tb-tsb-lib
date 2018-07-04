import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RepositoryService } from './_services/repository.service';
import { BasevegRepositoryService } from './_repositories/baseveg.service';
import { BaseflorRepositoryService } from './_repositories/baseflor.service';
import { BdtfxRepositoryService } from './_repositories/bdtfx.service';
import { Pvf2RepositoryService } from './_repositories/pvf2.service';

import { TbTsbLibComponent } from './tb-tsb-lib.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { MatSelectModule, MatInputModule, MatAutocompleteModule, MatProgressSpinnerModule, MatTooltipModule, MatChipsModule, MatIconModule } from '@angular/material';
import { RepositoryModule } from './_repositories/repository.module';

@NgModule({
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    MatSelectModule, MatInputModule, MatAutocompleteModule, MatProgressSpinnerModule, MatTooltipModule, MatChipsModule, MatIconModule,
    RepositoryModule
  ],
  declarations: [
    TbTsbLibComponent, SearchBoxComponent
  ],
  exports: [
    TbTsbLibComponent, SearchBoxComponent
  ]
})
export class TbTsbLibModule {
  providers: [
    RepositoryService, BasevegRepositoryService, BaseflorRepositoryService,
    BdtfxRepositoryService, Pvf2RepositoryService
  ];
}
