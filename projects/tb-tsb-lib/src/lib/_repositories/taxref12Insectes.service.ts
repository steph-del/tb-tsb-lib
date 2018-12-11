import { Injectable } from '@angular/core';
import { RepositoryModel } from '../_models/repository.model';
import { RepositoryItemModel } from '../_models/repository-item.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * TAXREF v12 Insectes
 */
@Injectable({
  providedIn: 'root'
})
export class TaxRef12Insectes implements RepositoryModel {
  id = 'taxref12Insectes';
  label = 'Insectes';
  apiUrl = `http://51.38.37.216:9200/taxrefv12/_search`;
  apiUrl2 = `http://51.38.37.216:9200/taxrefv12/_search`;
  levels = ['idiotaxon'];
  description_fr = ``;

  constructor(private http: HttpClient) { }

  findElement = (query: string) => {
    let esQuery: string;
    const queryArray = query.split(' ');
    if (queryArray.length === 1 && queryArray[0]) {
      esQuery = `
        {
          "query" : {
            "function_score": {
              "query" :{
                "bool": {
                  "must": {
                    "regexp" : { "NOM_COMPLET": "${queryArray[0]}( )?[aA-zZ]*" }
                  },
                  "should": {
                    "term" : { "RANG": "es" }
                  },
                  "filter": [
                    {"term" : { "GROUP2_INPN": "insectes" }}
                  ]
                }
              },
              "script_score": {
                "script": {
                  "source": \"if (doc['CD_REF'] == doc['CD_NOM']) { _score * 2 } else { _score }\"
                }
              }
            }
          }
        }
      `;
    } else if (queryArray.length > 1) {
      let esQueryBody = '';
      let i = 0;
      queryArray.forEach((queryItem) => {
        esQueryBody += `{"regexp" : { "NOM_COMPLET": "${queryItem}( )?[aA-zZ]*" }}`;
        esQueryBody += (i < queryArray.length - 1) ? ',' : '';
        i++;
      });

      esQuery = `
        {
          "query": {
            "function_score": {
              "query" : {
                "bool": {
                  "must": [${esQueryBody}],
                  "should": {
                    "term" : { "RANG": "es" }
                  },
                  "filter": [
                    {"term" : { "GROUP2_INPN": "insectes" }}
                  ]
                }
              },
              "script_score": {
                "script": {
                  "source": "if (doc['CD_REF'] == doc['CD_NOM']) { _score * 2 } else { _score }"
                }
              }
            }
          }
        }
      `;
    }

    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const request: Observable<any> = this.http.post(this.apiUrl, esQuery, { headers });

    return request;
  }

  findById(id) {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const request: Observable<any> = this.http.get(this.apiUrl + `?q=CD_NOM:${id}`, { headers });
    return request;
  }

  findByIdNomen(idNomen) {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const request: Observable<any> = this.http.get(this.apiUrl + `?q=CD_NOM:${idNomen}`, { headers });
    return request;
  }

  findByIdTaxo(idTaxo) {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const request: Observable<any> = this.http.get(this.apiUrl + `?q=CD_REF:${idTaxo}`, { headers });
    return request;
  }

  standardize = (rawData: any, attachRawData: boolean = false): any => {
    const sData: Array<RepositoryItemModel> = [];
    // Get results from elasticsearch (= remove metadata)
    rawData = this.filter(rawData);

    rawData.forEach((item) => {
      const rim: RepositoryItemModel = {repository: null, name: null, author: null, idTaxo: null, idNomen: null, isSynonym: false, rawData: null};
      rim.name = item.LB_NOM;
      rim.author = item.LB_AUTEUR;
      rim.idTaxo = item.CD_REF;
      rim.idNomen = item.CD_NOM;
      rim.isSynonym = (item.CD_NOM === item.CD_REF ? false : true);
      if (attachRawData) { rim.rawData = item; }
      sData.push(rim);
    });

    return sData;
  }

  /**
   * Before returning an Observable, some data may needs to be transformed
   * i.e. data from elasticsearch are nested (rawData.hits.hits / _source)
   * @param rawData
   */
  filter(rawData) {
    const data = rawData.hits.hits;
    const results: Array<any> = [];
    data.forEach((d) => { results.push(d._source); });
    return results;
  }

  findValidOccurenceByIdTaxo(idTaxo): Observable<any> {
    return this.findByIdNomen(idTaxo);
  }

  standardizeValidOccurence(data) {
    const r = this.standardize(data);
    return r[0];
  }

}
