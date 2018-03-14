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
     super('notice');
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const itemsRef = this.afDB.list('/notice');
    this.notices = itemsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({key: c.key,  ...c.payload.val(), expanded: false, editing: false, editedContent:'' }));
    });
  }

  expandItem(item) {
    item.expanded = !item.expanded;
  }

  prepareAddEditItem() {

  }

  prepareDeleteItem(item, ev) {
    ev.stopPropagation();
    let msg = '<p style="text-align:center;color:red;">'+ item.title + '</p>';
    msg += '<div style="text-align:center;">위 공지사항을 삭제합니다.</div>';
    this.confirmModal({title:"공지사항", message:msg});
  }

  addEditItem() {

  }

  deleteItem(item) {

  }

  publicItem(item, isPublic) {

  }

  prepareEditItem(item) {
    item.editedContent = item.content;
    item.editing = true;
  }

  editItem(item) {
    item.content = item.editedContent;

    let data = {} as INotice;
    data.idx = item.idx;
    data.writer = item.writer;
    data.reg_date = item.reg_date;
    data.update_date = new Date().toISOString().slice(0,16);
    data.title = item.title;
    data.content = item.content;
    data.level = item.level;
    data.order = item.order;

    const itemsRef = this.afDB.list('/notice');
    itemsRef.set(item.key, data);

    this.cancelEditItem(item);
  }

  cancelEditItem(item) {
    item.editing = false;
  }

  doTextareaValueChange(item, ev) {
    item.editedContent = ev.target.value;
  }
}
