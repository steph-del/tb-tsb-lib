import { Component, OnInit, OnDestroy, EventEmitter, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { RepositoryService } from '../_services/repository.service';
import { RepositoryItemModel } from '../_models/repository-item.model';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';

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
export class SearchBoxComponent implements OnInit, OnDestroy {
  @ViewChild('taxoInput') taxoInput: ElementRef;

  //
  // INPUT OUTPUT
  //
  @Input() set level(value: string) {                 // value = idiotaxon, synusy, microcenosis...
    this._level = value;
    this.initRepo();
  }
  @Input() defaultRepository = '';                    // set a default repository (auto selected)
  @Input() set fixedRepository(value: string) {       // fix a choosen repository (0 == noOne/unknow)
    this._fixedRepository = value;
    value !== '' ? this.form.controls.repository.disable() : this.form.controls.repository.enable();
  }
  @Input() set allowEmptyRepository(value: boolean) { // user can enter data that is not present in a repository
    this._allowEmptyRepository = value;
    this.initRepo();
  }
  @Input() allowFreeValueIfNoResults = true;          // if there is no results, user can manually enter a value
  @Input() autoComplete = true;                       // should the component show an autocomplete ? If false, just show an input and @output all results
  @Input() autoResetWhenSelected = true;              // reset the input after a data is selected
  @Input() showRepositoryInput = true;                // show / hide repository input
  @Input() inputFullWidth = true;                     // width = 100%
  @Input() floatLabel = 'auto';                       // auto | always | never
  @Input() hintRepoLabel = true;                      // label below search box input = repo name
  @Input() placeholder = '';                          // to change the default placeholder ("Taxon" | "Syntaxon")
  @Input() editingPlaceholder = 'Modifier une donnée';  // placeholder while editing a data
  @Input() showAuthor = true;                         // show author into search box
  @Input() showRepositoryDescription = false;
  @Input() attachRawData = false;                     // rawData is the set of data before passing through the standardize() method
  @Input() set updateData(value: RepositoryItemModel) {
    if (value !== null) { this.startEditingTaxo(value); }
  }

  @Output() newData = new EventEmitter<RepositoryItemModel>();
  @Output() updatedData = new EventEmitter<RepositoryItemModel>();
  @Output() cancelUpdateData = new EventEmitter<{occurenceId: number}>();
  @Output() selectedRepository = new EventEmitter<string | number>();
  @Output() allResults = new EventEmitter<any>();

  //
  // VARS
  //
  _level = 'idiotaxon';                               // default value
  _allowEmptyRepository = true;
  _fixedRepository: string;

  noOneRepositoryError = false;
  noOneRepositoryErrorMessage: string;
  form: FormGroup;
  dataFromRepo: Array<RepositoryItemModel> = [];
  listRepo: Array<{value: string, label: string}> = [{value: '', label: ''}];
  currentRepository: string;
  lastUsedRepositoryValue: string;               // used when updateTaxo
  lastPlaceholderValue: string;                  // idem
  isSearching = false;                           // true as soon as the user begin to type and false when loading data is finished (isLoading = false)
  isLoading = false;                             // wait for http response, with a starter delay (see debounceTime delay)
  matcher = new MyErrorStateMatcher();
  isEditingData = false;
  editingOccurenceId: number;                    // id of the occurence that is being edited

  subscription1: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;

  //
  // METHODS
  //
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
    this.subscription1 = this.form.controls.repository.valueChanges.subscribe(
      (repoValue) => {
        this.currentRepository = repoValue;
        this.resetInput();
        this.dataFromRepo = [];
        this.selectedRepository.next(repoValue);
      }
    );

    // First watcher. Need to rapidly set isSearching to true. No better solution because of the debounceTime of the second watcher.
    this.subscription2 = this.form.controls.input.valueChanges.subscribe(() => {
      this.isSearching = true;
    });

    // Second watcher
    this.subscription3 = this.form.controls.input.valueChanges
    .pipe(debounceTime(400))
    .pipe(distinctUntilChanged())
    .pipe(switchMap(
      (value) => {
        // value is a string = user types on keyboard,
        // request the server via repositoryService
        if (typeof(value) === 'string' && this.currentRepository !== 'otherunknow') {
          // loading...
          this.isLoading = true;

          // get the results
          return this.repositoryService.findDataFromRepo(this.currentRepository, value, this.attachRawData);

        // value is an object = user has selected a data (Material Autocomplete returns an object, not a string)
        // no need to request the server
        } else if (typeof(value) === 'object') {
          value.repository = this.currentRepository;
          if (!this.isEditingData) {
            this.dataFromRepo = [];
            this.newData.next(value as RepositoryItemModel);
          } else {
            value.occurenceId = this.editingOccurenceId;
            this.dataFromRepo = [];
            this.updatedData.next(value as RepositoryItemModel);
            this.stopEditingTaxo();
          }
          this.dataFromRepo = [];
          this.isLoading = false;
          this.isSearching = false;

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
        this.isSearching = false;
        // If there is no autocomplete, we send all results through @Output allResults
        if (!this.autoComplete) {
          this.dataFromRepo = [];
          this.allResults.next(results);
        }
      }
    });
  }

  /**
   * Unsubscribe
   */
  ngOnDestroy() {
    try { this.subscription1.unsubscribe(); } catch (error) { }
    try { this.subscription2.unsubscribe(); } catch (error) { }
    try { this.subscription3.unsubscribe(); } catch (error) { }
  }

  /**
   * When user keyDown Enter
   */
  keyDownEnter() {
    //
    // current repository is other/unknow
    // or there is no results for the search && allowFreeValueIfNoResults
    if (
      (this._allowEmptyRepository && this.currentRepository === 'otherunknow')
      || (this.currentRepository !== 'otherunknow' && this.allowFreeValueIfNoResults && this.dataFromRepo.length === 0 && !this.isSearching)
    ) {

      // if input value is empty, return
      if (this.form.controls.input.value.replace(' ', '') === '') { return; }

      // response model
      const rimResponse: RepositoryItemModel = {occurenceId: null, repository: null, idNomen: null, idTaxo: null, name: null, author: null};

      // if we are editing data
      // emit an updatedData event
      if (this.isEditingData) {
        this.dataFromRepo = [];
        this.updatedData.next({
          occurenceId: this.editingOccurenceId,
          repository: 'otherunknow',
          idTaxo: null,
          idNomen: null,
          name: this.form.controls.input.value,
          author: null
        });
        this.stopEditingTaxo();
      // else
      // emit a selectedData event
      } else {
        rimResponse.name = this.form.controls.input.value;
        rimResponse.repository = 'otherunknow';
        this.dataFromRepo = [];
        this.newData.next(rimResponse);
      }

      // if autoReset, reset the input
      if (this.autoResetWhenSelected) { this.resetInput(); }
    }

  }

  /**
   * Initialize the repositories list
   */
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
    if (this._allowEmptyRepository) {
      this.listRepo.push({value: 'otherunknow', label: 'Autre/inconnu'});
    }

    // Set default repository
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
    if (this.isEditingData) { return; }
    this.form.controls.input.reset('', {emitEvent: false});
    this.form.controls.input.markAsUntouched();
    this.form.controls.input.markAsPristine();
  }

  /**
   * Set the repository. Throw an error if repository can't be found.
   */
  setRepository(repository: string): void {
    let foundedRepository = false;

    this.listRepo.forEach(repo => {
      if (repo.value === repository) {
        foundedRepository = true;
        this.currentRepository = repository;
        this.form.controls.repository.setValue(repo.value, {emitEvent: false});
      }
    });

    if (!foundedRepository) {
      throw new Error(`Le référentiel ${repository} ne peut pas être utilisé.`);
    }
  }

  /**
   * Start editing data : set flags, change repository and keep initial options and values.
   * @param value { occurenceId: number, repository: string, idNomen: string, name: string, author?: string, idTaxo?: string }
   */
  startEditingTaxo(value: RepositoryItemModel): void {
    // Should first do an http request to check if value exists in db ?

    // Check if there is already an edition in progress
    // If true, cancel before continuing
    if (this.isEditingData) { this.cancelEditingTaxo(); }

    this.isEditingData = true;
    this.editingOccurenceId = value.occurenceId;
    this.lastPlaceholderValue = this.placeholder;
    this.placeholder = this.editingPlaceholder;
    this.lastUsedRepositoryValue = this.currentRepository;
    this.setRepository(value.repository);
    // patch input data
    const inputValue = (this.showAuthor && value.author && value.author !== '') ? value.name + ' ' + value.author : value;
    this.form.patchValue({'input': inputValue}, {emitEvent: false});

    this.taxoInput.nativeElement.focus();
  }

  /**
   * Stop editing data : reverse what startEditingTaxo() did.
   */
  stopEditingTaxo(): void {
    this.isEditingData = false;
    this.editingOccurenceId = null;
    this.placeholder = this.lastPlaceholderValue;
    this.setRepository(this.lastUsedRepositoryValue);
  }

  /**
   * Cancel editing data : reset and emit null event.
   */
  cancelEditingTaxo(): void {
    this.cancelUpdateData.next({occurenceId: this.editingOccurenceId});
    this.stopEditingTaxo();
    this.resetInput();
  }

}
