import { Injectable } from '@angular/core';
import { isDefined } from '@angular/compiler/src/util';
import { RepositoryModel } from '../_models/repository.model';
import { RepositoryItemModel } from '../_models/repository-item.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Default TB's repository pattern
 * Each repository that belongs under 'https://api.tela-botanica.org/service:cel/NameSearch/' can use this default pattern
 * In practice, all repositories added via the SearchBoxComponent 'repositoriesConfig' input will use this unique service
 *
 * This service provide default functions for retrieving data upon TB's NameSearch API
 */
@Injectable({
  providedIn: 'root'
})
export class DefaultRepositoryService /* implements RepositoryModel */ {

  apiUrl: string;
  apiUrl2: string;
  apiUrlValidOccurence: string;

  constructor(private http: HttpClient) { }

  findElement = (query: string, url: string) => {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const request: Observable<any> = this.http.get(url + query, { headers });

    return request;
  }

  findById(id, url) {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const request: Observable<any> = this.http.get(url + id, { headers });
    return request;
  }

  findByIdNomen(idNomen, url) {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const request: Observable<any> = this.http.get(url + `?q=numero_nomenclatural:${idNomen}`, { headers });
    return request;
  }

  findByIdTaxo(idTaxo, url) {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const request: Observable<any> = this.http.get(url + `?q=numero_nomenclatural_du_nom_retenu:${idTaxo}`, { headers });
    return request;
  }

  findValidOccurenceByIdNomen(idNomen, url): Observable<any> {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const request: Observable<any> = this.http.get(url + idNomen, { headers });
    return request;
  }

  standardize = (rawData: any, attachRawData: boolean = false): any => {
    const sData: Array<RepositoryItemModel> = [];

    rawData.forEach(item => {
      const rim: RepositoryItemModel = {repository: null, name: null, author: null, idTaxo: null, idNomen: null, isSynonym: false, rawData: null};
      rim.name = item[3];
      rim.author = item[0].substr(item[3].length + 1, (item[0].length - item[3].length));
      rim.idTaxo = null; // not provided
      rim.idNomen = item[1];
      rim.isSynonym = (+item[2] === 4 ? true : false);
      if (attachRawData) { rim.rawData = item; }
      sData.push(rim);
      });

    return sData;
  }

  standardizeValidOccurence = (rawData: any): RepositoryItemModel => {
    const sData: RepositoryItemModel = {repository: null, name: null, author: null, idTaxo: null, idNomen: null, isSynonym: false, rawData: null};

    if (!isDefined(rawData['nom_retenu.id'])) {
      sData.name = 'NA';
      sData.author = 'NA';
      sData.idTaxo = 'NA';
      sData.idNomen = 'NA';
      sData.isSynonym = false;
    } else {
      const nomSci = rawData['nom_retenu.libelle'];
      sData.name = nomSci;
      sData.author = rawData['auteur'];
      sData.idTaxo = rawData['nom_retenu.id'];
      sData.idNomen = rawData['nom_retenu.id'];
      sData.isSynonym = false;
    }

    return sData;

  }

  /**
   * Before returning an Observable, some data may needs to be transformed
   * i.e. data from elasticsearch are nested (rawData.hits.hits / _source)
   * @param rawData
   */
  filter(rawData) {
    return rawData;
  }
}
