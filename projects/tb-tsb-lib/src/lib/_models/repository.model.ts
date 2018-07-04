import { RepositoryItemModel } from './repository-item.model';
import { Observable } from 'rxjs';

/**
 * Each repository service must implements this interface
 */
export interface RepositoryModel {

  /**
   * Identifier of the repository
   */
  id: string;

  /**
   * Name of the repository
   */
  label: string;

  /**
   * The URL of the APi
   */
  apiUrl: string;

  /**
   * Wich levels can this repository manage ?
   * Array must contains 'idiotaxon' | 'synusy' | 'microcenosis' | 'phytocenosis' | ...
   */
  levels: Array<string>;

  /**
   * French description
   */
  description_fr: String;
  /**
   * Call the API and return an Observable
   * Perform as you want, no matter how the data are organized
   */
  findElement: (query: string) => Observable<any>;

  /**
   * Call the API and return an Observable
   */
  findById: (id: number | string) => Observable<any>;

  /**
   * Call the API and return an Observable
   */
  findByIdNomen: (id: number | string) => Observable<any>;

  /**
   * Call the API and return an Observable
   */
  findByIdTaxo: (id: number | string) => Observable<any>;

  /**
   * In case of the data are not ready to use (e.g. nested into another object)
   * Return results
   * Basicly, could return input data (return rawData)
   * @param rawData
   */
  filter: (rawData) => any;

  /**
   * The application processes each data form a repository of the same way
   * So these data must share a common model : RepositoryItemModel
   */
  standardize: (rawData: any) => Array<RepositoryItemModel>;

}
