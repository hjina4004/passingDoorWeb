import { Component, OnInit } from '@angular/core';

import { BaseChild } from '../base-child';

@Component({
  selector: 'app-notice-event',
  templateUrl: './notice-event.component.html',
  styleUrls: ['./notice-event.component.scss']
})
export class NoticeEventComponent extends BaseChild implements OnInit {
  constructor() {
     super();
     this.setTitle('event');
  }

  ngOnInit() {
  }
}
