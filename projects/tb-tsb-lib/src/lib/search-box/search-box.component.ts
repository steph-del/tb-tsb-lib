import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { RepositoryService } from '../_services/repository.service';
import { RepositoryItemModel } from '../_models/repository-item.model';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * Override default Angular Material ErrorState
 * Default ErrorState == touched && invalid
 * Setting ErrorState to touched && dirty && invalid
 */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl): boolean {
    return !!(control && control.dirty && control.invalid);
  }
}

@Component({
  selector: 'tb-tsb-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {
  // INPUT OUTPUT
  @Input() set level(value: string) {                 // value = idiotaxon, synusy, microcenosis...
    this._level = value;
    this.initRepo();
  }
  @Input() defaultRepository = '';                    // set a default repository (auto selected)
  @Input() set fixedRepository(value: string | number) {  // fix a choosen repository (0 == noOne/unknow)
    this._fixedRepository = value;
    value !== '' || +value !== 0 ? this.form.controls.repository.disable() : this.form.controls.repository.enable();
  }
  @Input() set allowUnvalidatedData(value: boolean) { // user can enter data that is not present in a repository
    this._allowUnvalidatedData = value;
    this.initRepo();
  }
  @Input() autoComplete = true;                       // should the component show an autocomplete ? If false, just show an input and @output all results
  @Input() autoResetWhenSelected = true;              // reset the input after a data is selected
  @Input() showRepositoryInput = true;                // show / hide repository input
  @Input() inputFullWidth = true;                     // width = 100%
  @Input() floatLabel = 'auto';                       // auto | always | never
  @Input() hintRepoLabel = true;                      // label below search box input = repo name
  @Input() placeholder = '';                          // to change the default placeholder ("Taxon" | "Syntaxon")
  @Input() showAuthor = true;                         // show author into search box
  @Input() showRepositoryDescription = false;
  @Input() attachRawData = false;                     // rawData is the set of data before passing through the standardize() method

  @Output() selectedData = new EventEmitter<RepositoryItemModel | null>();
  @Output() selectedRepository = new EventEmitter<string | number>();
  @Output() allResults = new EventEmitter<any>();

  // VARS
  _level = 'idiotaxon';                               // default value
  _allowUnvalidatedData = true;
  _fixedRepository: string | number;

  noOneRepositoryError = false;
  noOneRepositoryErrorMessage: string;
  form: FormGroup;
  dataFromRepo: Array<RepositoryItemModel> = [];
  listRepo: Array<{value: string | 0, label: string}> = [{value: '', label: ''}];
  currentRepository: string | number;
  isLoading = false;
  matcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder, private repositoryService: RepositoryService) {
    // Create the form
    // This code is not inside the ngOnInit function because it's called by @Input set level() before ngOnInit is call
    this.form = this.fb.group({
      repository: this.fb.control({value: '', disabled: false}),
      input: this.fb.control('', [Validators.required])
    });
  }

  /**
   * Initializes the repositories and watch for inputs changes
   */
  ngOnInit() {
    // Initialize repositories list and configuration
    this.initRepo();
    // Watch repository change
    this.form.controls.repository.valueChanges.subscribe(
      (repoValue) => {
        this.currentRepository = repoValue;
        this.resetInput();
        this.dataFromRepo = [];
        this.selectedRepository.next(repoValue);
      }
    );

    // Watch input change
    this.form.controls.input.valueChanges
    .pipe(debounceTime(400))
    .pipe(distinctUntilChanged())
    .pipe(switchMap(
      (value) => {
        // value is a string = user types on keyboard,
        // request the server via repositoryService
        if (typeof(value) === 'string' && !this.allowUnvalidatedData && this.currentRepository !== 0) {
          // loading...
          this.isLoading = true;

          // get the results
          return this.repositoryService.findDataFromRepo(this.currentRepository, value, this.attachRawData);

        // value is an object = user has selected a data (Material Autocomplete returns an object, not a string)
        // no need to request the server
        } else if (typeof(value) === 'object') {
          value.repository = this.currentRepository;
          this.selectedData.next(value as RepositoryItemModel);
          this.dataFromRepo = [];
          this.isLoading = false;

          // if autoReset, reset the input
          if (this.autoResetWhenSelected) { this.resetInput(); }

          // Return empty Observable because we are in the switchMap function, must returns an Observable !
          return of([]);
        //
        // otherwise
        } else {
          return of([]);
        }
      }
    ))
    .pipe(catchError(error => of([])))
    .subscribe((results: Array<RepositoryItemModel>) => {
      if (results !== []) {
        this.dataFromRepo = results;
        this.isLoading = false;
        // If there is no autocomplete, we send all results through @Output allResults
        if (!this.autoComplete) {
          this.allResults.next(results);
        }
      }
    });
  }

  /**
   * When user keyDown Enter
   */
  keyDownEnter() {
    if (this._allowUnvalidatedData && this.currentRepository === 0) {
      // response model
      const rimResponse: RepositoryItemModel = {repository: null, idNomen: null, idTaxo: null, name: null, author: null, isSynonym: null, rawData: null};

      // send new response
      rimResponse.name = this.form.controls.input.value;
      rimResponse.repository = this.currentRepository;
      this.selectedData.next(rimResponse);

      // if autoReset, reset the input
      if (this.autoResetWhenSelected) { this.resetInput(); }
    }

  }

  initRepo() {
    // Reset noOneRepository flag
    this.noOneRepositoryError = false;

    // Get available repositories
    try {
      this.listRepo = this.repositoryService.getRepoAccordingToLevel(this._level);
    } catch (e) {
      this.noOneRepositoryError = true;
      this.noOneRepositoryErrorMessage = e;
    }

    // Allow unvalided data ?
    if (this._allowUnvalidatedData) {
      this.listRepo.push({value: 0, label: 'Autre/inconnu'});
    }

    // Default repository
    let defaultRepoHasBeenSet = false;

    this.listRepo.forEach(repo => {
      if (repo.value === this.defaultRepository) {
        defaultRepoHasBeenSet = true;
        this.currentRepository = this.defaultRepository;
        this.form.controls.repository.setValue(this.defaultRepository);
        this.selectedRepository.next(this.defaultRepository);
      }
    });

    if (defaultRepoHasBeenSet === false) {
      // console.log(`Default repository '${this.defaultRepository}' could not be set. It's not listed within available repositories for the '${this._level}' level !`);
      const firstAvailableRepo = this.listRepo[0];
      this.currentRepository = firstAvailableRepo.value;
      this.form.controls.repository.setValue(this.currentRepository);
      this.selectedRepository.next(this.currentRepository);
      // console.log(`As the repository can't be chosen, falling back to '${firstAvailableRepo.label}'`);
    }

    // If we force a repository
    if (this._fixedRepository) {
      let foundedRepository = false;
      this._fixedRepository = (this._fixedRepository === '0' ? 0 : this._fixedRepository);
      this.listRepo.forEach(repo => {
        if (repo.value === this._fixedRepository) { foundedRepository = true; }
      });
      if (!foundedRepository) {
        this.noOneRepositoryError = true;
        this.noOneRepositoryErrorMessage = `
          Le module tente de forcer le référentiel '${this._fixedRepository}' pour le niveau '${this._level}' mais ces
          valeurs ne semblent pas compatibles.
          `;
      }

      this.currentRepository = this._fixedRepository;
      this.form.controls.repository.setValue(this._fixedRepository);
    } else {
      this.form.controls.repository.setValidators([Validators.required]);
    }

  }

  inputPlaceholder = () => {
    let placeholder: string;
    if (this._level === 'idiotaxon') {
      placeholder = 'Taxon';
    } else if (this._level === 'synusy' || this._level === 'microcenosis') {
      placeholder = 'Syntaxon';
    }
    if (this.placeholder !== '') {
      placeholder = this.placeholder;
    }

    return placeholder;
  }

  /**
   * Be careful, this method and the next one are called by Angular Material Autocomplete component
   * and can't access to 'this'. That's why there is 2 methods regarding of this.showAuthor value (checked in the view)
   * Alternative : could .bind(this) from the view (not tested)
   * @param value could be a string or an object from Angular Material
   */
  displayInputWithAuthor(value): string {
    if (typeof(value) === 'object') {
      if (value.author &&  value.author !== '') {
        return value.name + ' ' + value.author;
      } else {
        return value.name;
      }
    } else {
      return value;
    }
  }

  /**
   * @param value coul be a string or an object from Angular Material
   */
  displayInputWithoutAuthor(value): string {
    return typeof(value) === 'object' ? value.name : value;
  }

  switchRepositoryIsHidden() {
    this.showRepositoryInput = !this.showRepositoryInput;
  }

  hintRepoLabelMessage() {
    if (!this.showRepositoryInput) {
      return `référentiel en cours : ${this.currentRepository}`;
    } else {
      return '';
    }
  }

  repositoryDescriptionTooltip(): String {
    return this.repositoryService.getRepositoryDescription(this.currentRepository);
  }

  resetInput() {
    this.form.controls.input.reset('', {emitEvent: false});
    this.form.controls.input.markAsUntouched();
    this.form.controls.input.markAsPristine();
  }

}
