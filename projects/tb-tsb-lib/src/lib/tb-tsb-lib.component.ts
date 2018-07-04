import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tb-tsb-lib',
  template: `
    <tb-tsb-search-box></tb-tsb-search-box>
  `,
  styleUrls: ['./tb-tsb-lib.component.scss']
})
export class TbTsbLibComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
