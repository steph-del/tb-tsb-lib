import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Observable } from 'rxjs';

import { RepositoryService } from './repository.service';
import { BasevegRepositoryService } from '../_repositories/baseveg.service';
import { BaseflorRepositoryService } from '../_repositories/baseflor.service';
import { BdtfxRepositoryService } from '../_repositories/bdtfx.service';
import { BdtferRepositoryService } from '../_repositories/bdtfer.service';
import { Pvf2RepositoryService } from '../_repositories/pvf2.service';
import { ApdRepositoryService } from '../_repositories/apd.service';

import { RepositoryModel } from '../_models/repository.model';
import { RepositoryItemModel } from '../_models/repository-item.model';

describe('RepositoryService', () => {
  let service: RepositoryService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RepositoryService,
        { provide: BasevegRepositoryService, useClass: FakeRepoService },
        { provide: BaseflorRepositoryService, useClass: FakeRepoService },
        { provide: BdtfxRepositoryService, useClass: FakeRepoService },
        { provide: BdtferRepositoryService, useClass: FakeRepoService },
        { provide: Pvf2RepositoryService, useClass: FakeRepoService },
        { provide: ApdRepositoryService, useClass: FakeRepoService }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(RepositoryService);
    http = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all repo', () => {
    const repos = service.listAllRepositories();
    expect(repos).toBeDefined();
    expect(repos.length).toBeGreaterThan(0);
  });

});

// Real repositories testing
describe('RepositoryService', () => {
  let service: RepositoryService;  // line
  let http: HttpTestingController;  // line

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // line
      providers: [
        RepositoryService,
        { provide: BasevegRepositoryService, useClass: BasevegRepositoryService },
        { provide: BaseflorRepositoryService, useClass: BaseflorRepositoryService },
        { provide: BdtfxRepositoryService, useClass: BdtfxRepositoryService },
        { provide: BdtferRepositoryService, useClass: BdtferRepositoryService },
        { provide: Pvf2RepositoryService, useClass: Pvf2RepositoryService },
        { provide: ApdRepositoryService, useClass: ApdRepositoryService }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(RepositoryService);
    http = TestBed.get(HttpTestingController);
  });

  it('getRepoAccordingToLevel() should return idiotaxon level repositories : at less bdtfx & taxref', () => {
    const repos: any = service.getRepoAccordingToLevel('idiotaxon');
    expect(repos.length).toBeGreaterThan(0);
    expect(repos).toContain({value: 'bdtfx', label: 'bdtfx'});
    // @todo taxref implementation
    // expect(repos).toContain({value: 'taxref', label: 'taxref'});
  });

  it('getRepoAccordingToLevel() should return synusy level repositories', () => {
    const repos: any = service.getRepoAccordingToLevel('synusy');
    expect(repos.length).toBeGreaterThan(0);
    expect(repos).toContain({value: 'baseveg', label: 'baseveg'});
  });

  it('getRepoAccordingToLevel() should throw an error for unexpected level', () => {
    expect(() => { service.getRepoAccordingToLevel('dummyLevel'); }).toThrowError();
  });

});

class FakeRepoService {
  id: string;
  label: string;
  apiUrl: string;
  apiUrlValidOccurence?: string;
  levels: Array<string>;
  description_fr: String;
  findElement: (query: string) => Observable<any>;
  findById: (id: number | string) => Observable<any>;
  findByIdNomen: (id: number | string) => Observable<any>;
  findByIdTaxo: (id: number | string) => Observable<any>;
  findValidOccurenceByIdNomen?: (id: number | string) => Observable<any>;
  findValidOccurenceByIdTaxo?: (id: number | string) => Observable<any>;
  filter: (rawData) => any;
  standardize: (rawData: any) => Array<RepositoryItemModel>;
  standardizeValidOccurence?: (rawData: any) => RepositoryItemModel;
}
