import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-test-app',
  templateUrl: './test-app.component.html',
  styleUrls: ['./test-app.component.css']
})
export class TestAppComponent {

  taxons: Array<any> = [];
  _updateData = null;

  constructor() { }

  /**
   * When user has entered a new data
   */
  newData(data: TaxonType) {
    console.log('Event \'newData\' :');
    console.log(data);
    this.addTaxon(data);
  }

  addTaxon(taxon: TaxonType) {
    taxon.occurenceId = this.taxons.length;
    this.taxons.push(taxon);
  }

  updateData(taxon: TaxonType): void {
    this._updateData = {
      occurenceId: taxon.occurenceId,
      repository: taxon.repository,
      idNomen: taxon.idNomen,
      idTaxo: taxon.idTaxo,
      name: taxon.name,
      author: taxon.author
    };
  }

  /**
   * When user has updated a data
   */
  updatedData(data: TaxonType) {
    console.log('Event \'updatedData\' :');
    console.log(data);

    /**
     * Here, you should register the updated data in db
     */

    // for demo, we only update the data in taxons[]
    let taxonToUpdate: TaxonType;
    this.taxons.forEach(taxon => {
      if (data.occurenceId === taxon.occurenceId) {
        taxonToUpdate = taxon;
      }
    });

    taxonToUpdate.repository = data.repository;
    taxonToUpdate.idTaxo = data.idTaxo;
    taxonToUpdate.idNomen = data.idNomen;
    taxonToUpdate.name = data.name;
    taxonToUpdate.author = data.author;
  }

  /**
   * if user has cancelled
   */
  cancelUpdateData(data: { occurenceId: number }) {
    console.log(`Event 'cancelUpdateData' for occurenceId ${data.occurenceId}`);
  }
}

interface TaxonType {
  occurenceId: number;
  repository: string;
  idTaxo: string;
  idNomen: string;
  name: string;
  author: string;
}
