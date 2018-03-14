import { Component, OnInit } from '@angular/core';

import { BaseChild } from '../base-child';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent extends BaseChild implements OnInit {
  constructor() {
     super('member');
  }

  ngOnInit() {
  }
}
