import { Component, OnInit } from '@angular/core';

import { BaseChild } from '../base-child';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent extends BaseChild implements OnInit {
  constructor() {
     super('problem');
  }

  ngOnInit() {
  }
}
