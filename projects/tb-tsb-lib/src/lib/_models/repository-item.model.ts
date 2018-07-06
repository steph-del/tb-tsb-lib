/**
 * The application processes each data form a repository of the same way
 * So these data must share a common model
 *
 * Each data from a repository must follow (implements) this model
 */
export interface RepositoryItemModel {
  repository: string | 0;
  idNomen: number | string;
  idTaxo: number | string;
  name: string;
  author: string;
  isSynonym: boolean;
  rawData: any;
}
