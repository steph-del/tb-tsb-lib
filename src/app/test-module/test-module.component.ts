import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RepositoryItemModel } from 'tb-tsb-lib';
import { RepositoryService } from 'tb-tsb-lib';

@Component({
  selector: 'app-test-module',
  templateUrl: './test-module.component.html',
  styleUrls: ['./test-module.component.css']
})
export class TestModuleComponent implements OnInit {
  inputForm: FormGroup;
  _selectedData: RepositoryItemModel;
  _allResults: [RepositoryItemModel];
  _defaultRepository = 'bdtfx';

  constructor(private fb: FormBuilder, private repoService: RepositoryService) { }

  ngOnInit() {
    this.inputForm = this.fb.group({
      level: this.fb.control('idiotaxon', null),
      autoComplete: this.fb.control(true, null),
      autoResetWhenSelected: this.fb.control(true, null),
      showRepositoryInput: this.fb.control(false, null),
      showRepositoryDescription: this.fb.control(false, null),
      hintRepoLabel: this.fb.control(true, null),
      inputFullWidth: this.fb.control(true, null),
      allowUnvalidatedData: this.fb.control(true, null),
      placeholder: this.fb.control('', null),
      floatLabel: this.fb.control('float', null),
      showAuthor: this.fb.control(true, null),
      attachRawData: this.fb.control(true, null)
    });

    console.log(`Liste des référentiels disponibles :`);
    console.log(this.repoService.listAllRepositories());
  }

  selectedData(repositoryData: RepositoryItemModel) {
    this._selectedData = repositoryData;
  }

  receviedAllResults(data) {
    this._allResults = data;
  }

  printObject(obj): Array<any> {
    if (!obj) { return []; }
    const props = Object.keys(obj);
    const response = [];
    for (const prop of props) {
      response.push(prop + ' : ' + obj[prop]);
    }
    return response;
  }

}
