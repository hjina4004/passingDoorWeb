import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { ISubscription } from "rxjs/Subscription";

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
export class NoticeComponent extends BaseChild implements OnInit, OnDestroy {
  private notices: Observable<INotice[]>;
  private subscription: ISubscription;
  private selectedItem: INotice = null;
  private newItem = {} as INotice;
  private modeAdd = false;

  constructor(
    private auth: AuthService,
    private afDB: AngularFireDatabase
  ) {
     super('notice');
  }

  ngOnInit() {
    this.subscription = this.auth.emitChange.subscribe(data => {
      this.responseDialog(data);
    });
    this.loadData();
  }

  ngOnDestroy() {
    console.log("NoticeComponent - ngOnDestroy ...");
    this.subscription.unsubscribe();
    console.log("NoticeComponent - ngOnDestroy done");
  }

  loadData() {
    const itemsRef = this.afDB.list('/notice');
    this.notices = itemsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({key: c.key,  ...c.payload.val(), expanded: false, editing: false, editedContent:'' }));
    });
  }

  responseDialog(data) {
    console.log(data);
    if (data && data.key == "prepareDeleteItem" && data.value) {
      this.deleteItem(this.selectedItem);
    }
  }

  expandItem(item) {
    item.expanded = !item.expanded;
  }

  prepareAddEditItem() {
    this.newItem.idx = "";
    this.newItem.writer = "";
    this.newItem.reg_date = "";
    this.newItem.update_date = "";
    this.newItem.title = "제목을 입력하세요.";
    this.newItem.content = "내용을 입력하세요.";
    this.newItem.level = 0;
    this.newItem.order = 0;

    this.modeAdd = true;
  }

  prepareDeleteItem(item, ev) {
    ev.stopPropagation();
    let msg = '<p style="text-align:center;color:red;">'+ item.title + '</p>';
    msg += '<div style="text-align:center;">위 공지사항을 삭제합니다.</div>';
    this.showConfirmModal({title:"공지사항", message:msg, type:"prepareDeleteItem"});
    this.selectedItem = item;
  }

  addEditItem() {
    /***
    content:
    "안녕하세요.<br><font color=\"red\">합격문</font>에서 알려 드립니다."
    idx:
    "admin-20180306145700"
    level:
    0
    order:
    0
    reg_date:
    "2018-03-06 14:57:00"
    title:
    "합격문 서비스 준비 중입니다."
    update_date:
    "2018-03-14T16:39"
    writer:
    "admin"
    ***/
    let regDate = new Date().toISOString().slice(0,16);
  }

  deleteItem(item) {
    console.log("deleteItem", item);
    const itemsRef = this.afDB.list('/notice');
    itemsRef.remove(item.key);
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
