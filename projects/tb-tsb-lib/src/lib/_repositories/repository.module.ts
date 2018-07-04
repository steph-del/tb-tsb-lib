import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepositoryService } from '../_services/repository.service';
import { BasevegRepositoryService } from './baseveg.service';
import { BaseflorRepositoryService } from './baseflor.service';
import { BdtfxRepositoryService } from './bdtfx.service';
import { BdtferRepositoryService } from './bdtfer.service';
import { Pvf2RepositoryService } from './pvf2.service';
import { ApdRepositoryService } from './apd.service';

@NgModule({
  imports: [ CommonModule ],
  declarations: [],
  providers: [
    RepositoryService,
    BasevegRepositoryService,
    BaseflorRepositoryService,
    BdtfxRepositoryService,
    BdtferRepositoryService,
    Pvf2RepositoryService,
    ApdRepositoryService
  ]
})
export class RepositoryModule { }
