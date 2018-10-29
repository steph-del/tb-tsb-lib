import { Injectable } from '@angular/core';
import { Observable, empty } from 'rxjs';
import { map } from 'rxjs/operators';
import { RepositoryModel } from '../_models/repository.model';
import { BasevegRepositoryService } from '../_repositories/baseveg.service';
import { BaseflorRepositoryService } from '../_repositories/baseflor.service';
import { BdtfxRepositoryService } from '../_repositories/bdtfx.service';
import { BdtferRepositoryService } from '../_repositories/bdtfer.service';
import { Pvf2RepositoryService } from '../_repositories/pvf2.service';
import { ApdRepositoryService } from '../_repositories/apd.service';
import { RepositoryItemModel } from '../_models/repository-item.model';
import { isDefined } from '@angular/compiler/src/util';

@Injectable()
/**
 * To add a new Repository :
 *   1. Create a new service called 'myrepository.service' inside the _repositories dir that extends RepositoryModel
 *   2. Import this service into _repositories/repository.module and add it as a provider
 *   3. Import this service into _services/repository.service (here). Don't forget the constructor.
 *   4. Name this service as anythingRepoService (*RepoService) in the constructor (here)
 *   5. Push this service inside the repo array (here)
 *   4. Update the tests
 */
export class RepositoryService {

  repo: Array<RepositoryModel> = [];

  constructor(
    private basevegRepoService: BasevegRepositoryService,
    private baseflorRepoService: BaseflorRepositoryService,
    private bdtfxRepoService: BdtfxRepositoryService,
    private bdtferRepoService: BdtferRepositoryService,
    private pvf2RepoService: Pvf2RepositoryService,
    private apdRepoService: ApdRepositoryService
  ) {

    this.repo.push(
      this.basevegRepoService,
      this.baseflorRepoService,
      this.bdtfxRepoService,
      this.bdtferRepoService,
      this.pvf2RepoService,
      this.apdRepoService
    );
  }

  /**
   * List all available repositories
   */
  listAllRepositories() {
    const response: Array<any> = [];

    this.repo.forEach(repo => {
      const obj: any = {};

      obj.id = repo.id;
      obj.label = repo.label;
      obj.apiUrl = repo.apiUrl;
      obj.levels = repo.levels;
      obj.description_fr = repo.description_fr;

      response.push(obj);
    });

    return response;
  }

  /**
   * List all repositories that can be used for a given level
   * Return an array of the names of the repositories
   * @param level
   */
  getRepoAccordingToLevel(level): Array<{value: string, label: string}> {
    const availableRepositoryNames: Array<{value: string, label: string}> = [];
    this.repo.forEach((repoService) => {
      if (repoService.levels.indexOf(level) > -1) { availableRepositoryNames.push({value: repoService.id, label: repoService.label}); }
    });

    if (availableRepositoryNames.length === 0) { throw new Error(`Aucun référentiel n'est disponible pour le niveau '${level}'.`); }
    return availableRepositoryNames;
  }

  /**
   * Find elements (idiotaxon, syntaxon, etc.) according to a repository and a term (query)
   * Standardize those elements
   * Returns an Obserable
   * @param repository
   * @param query
   */
  findDataFromRepo(repository: string, query: string, attachRawData: boolean = false): Observable<any> {
    if (!repository) { return empty(); }
    return this[(repository + 'RepoService')]
           .findElement(query)
           .pipe(map(results => this[(repository + 'RepoService')].standardize(results, attachRawData)));
  }

  /**
   * Find elements by id according to a repository
   * @param repository
   * @param query
   */
  findDataById(repository: string, query: string | number, attachRawData: boolean = false): Observable<any> {
    if (!repository) { return empty(); }
    return this[(repository + 'RepoService')].findById(query)
           .pipe(map(results => this[(repository + 'RepoService')].standardize(results, attachRawData)));
           // .catch((error) => empty());
  }

  /**
   * Find elements by idNomen according to a repository
   * @param repository
   * @param query
   */
  findDataByIdNomen(repository: string, query: string | number | Array<string | Number>, attachRawData: boolean = false): Observable<any> {
    if (!repository) { return empty(); }
    return this[(repository + 'RepoService')].findByIdNomen(query)
           .pipe(map(results => this[(repository + 'RepoService')].standardize(results, attachRawData) ));
           // .catch((error) => empty());
  }

  /**
   * Find elements by idNomen according to a repository
   * @param repository
   * @param query
   */
  findDataByIdNomenWithoutStandardize(repository: string, query: string | number | Array<string | Number>): Observable<any> {
    if (!repository) { return empty(); }
    return this[(repository + 'RepoService')].findByIdNomen(query)
           .pipe(map(results => this[(repository + 'RepoService')].getResultsWithoutMetadata(results) ));
           // .catch((error) => empty());
  }

  /**
   * Find elements by idTaxo according to a repository
   * @param repository
   * @param query
   */
  findDataByIdTaxo(repository: string, query: string | number, attachRawData: boolean = false): Observable<any> {
    if (!repository) { return empty(); }
    return this[(repository + 'RepoService')].findByIdTaxo(query)
           .pipe(map(results => this[(repository + 'RepoService')].standardize(results, attachRawData)));
           // .catch((error) => empty());
  }

  getRepositoryDescription(repository: string): String {
    if (!repository || repository === 'otherunknow') { return ''; }
    return this[(repository + 'RepoService')].description_fr;
  }

  /**
   * Find a valid occurence from a synonym idNomen
   * Note : we can't check here that the provided idNomen is from a synonym occurence,
   */
  getValidOccurence(repository: string, idNomen: number | string | null, idTaxo: number | string | null): Observable<any> {
    if (isDefined(this[(repository + 'RepoService')].findValidOccurenceByIdNomen)) {
      return this[(repository + 'RepoService')].findValidOccurenceByIdNomen(idNomen);
    } else if (isDefined(this[(repository + 'RepoService')].findValidOccurenceByIdTaxo)) {
      return this[(repository + 'RepoService')].findValidOccurenceByIdTaxo(idTaxo);
    } else {
      // @todo throw error ?
    }
  }

  /**
   * A valid occurence has to be standardized into a RepositoryItemModel
   */
  standardizeValidOccurence(repository: string, data: any): RepositoryItemModel {
    return this[(repository + 'RepoService')].standardizeValidOccurence(data);
  }

}
