import { Component, OnInit } from '@angular/core';

import { BaseChild } from '../base-child';

@Component({
  selector: 'app-notice-usage',
  templateUrl: './notice-usage.component.html',
  styleUrls: ['./notice-usage.component.scss']
})
export class NoticeUsageComponent extends BaseChild implements OnInit {
  constructor() {
     super();
     this.setTitle('usage');
  }

  ngOnInit() {
  }
}
