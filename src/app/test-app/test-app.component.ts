import { Component } from '@angular/core';

@Component({
  selector: 'app-test-app',
  templateUrl: './test-app.component.html',
  styleUrls: ['./test-app.component.css']
})
export class TestAppComponent {

  taxons: Array<any> = [];
  constructor() { }
  selectedData(data: TaxonType) {
    this.addTaxon(data);
  }

  addTaxon(taxon) {
    this.taxons.push(taxon);
  }
}

interface TaxonType {
  repository: string | 0;
  idTaxo: any;
  idNomen: any;
  name: any;
  author: any;
}
