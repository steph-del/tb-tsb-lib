import { Input, Output, ViewEncapsulation, Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ElementsComponent {
  @Input() level;
  @Input() defaultRepository;
  @Input() placeholder = 'Entrez une espèce';
  @Input() editingPlaceholder = 'Modifiez l\'espèce';

  @Output() publishNewData = new EventEmitter();

  _updateData = null;

  newData(data) {
    this.publishNewData.emit(data);
  }

  updatedData(data) { }

  cancelUpdateData(data) { }

  constructor() { }


}
