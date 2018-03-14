import { Component, OnInit } from '@angular/core';

import { BaseChild } from '../base-child';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { INotice } from '../../models/notice.m';


@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent extends BaseChild implements OnInit {
  private notices: Observable<INotice[]>;

  constructor(
    private afDB: AngularFireDatabase
  ) {
     super();
     this.setTitle('notice');
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const itemsRef = this.afDB.list('/notice');

    this.notices = itemsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ ...c.payload.val(), expanded: false, mIdx: '#'+c.payload.child('idx').val() }));
    });
  }

  expandItem(item) {
    item.expanded = !item.expanded;
    console.log("content:", item.content);
  }

  doTextareaValueChange(item, ev) {
    item.content = ev.target.value;
  }
}
