import { Component, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';

import { AppService } from '../../services/app.service';
import * as $ from 'jquery';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AuthService } from '../../services/auth.service';
import { ISubscription } from "rxjs/Subscription";

import { BaseChild } from '../base-child';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { INotice } from '../../models/notice.m';


@Component({
  selector: 'app-notice-usage',
  templateUrl: './notice-usage.component.html',
  styleUrls: ['./notice-usage.component.scss']
})
export class NoticeUsageComponent extends BaseChild implements OnInit, OnDestroy {
  private subscription: ISubscription;
  private selectedItem: INotice = null;
  private newItem = {} as INotice;

  notices: Observable<INotice[]>;
  modeAdd = false;

  constructor(
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private app: AppService,
    private auth: AuthService,
    private afDB: AngularFireDatabase
  ) {
     super('usage');
     this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.subscription = this.auth.emitChange.subscribe(data => {
      this.responseDialog(data);
    });
    this.loadData();
  }

  ngOnDestroy() {
    console.log("NoticeUsageComponent - ngOnDestroy ...");
    this.subscription.unsubscribe();
    console.log("NoticeUsageComponent - ngOnDestroy done");
  }

  loadData() {
    const itemsRef = this.afDB.list('/usage');
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
    $("#titleItem").val("");
    $("#contentItem").val("");

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
    msg += '<div style="text-align:center;">위 이용 방법을 삭제합니다.</div>';
    this.showConfirmModal({title:"이용 방법", message:msg, type:"prepareDeleteItem"});
    this.selectedItem = item;
  }

  addEditItem() {
    let titleItem = $("#titleItem").val();
    let contentItem = $("#contentItem").val()
      .replace(/<script/g,"&lt;script")
      .replace(/<\/script/g,"&lt;/script")
      .replace(/\r\n/g,"<br/>")
      .replace(/\n/g,"<br/>");

    if (titleItem.length < 4){
      this.toastr.warning('제목을 입력하세요.', null);
      return;
    } else if (contentItem.length < 4){
      this.toastr.warning('내용을 입력하세요.', null);
      return;
    }

    let regDate = this.app.getDateWithUTCOffset();
    let writer  = this.auth.currentUserEmail.split('@')[0];

    this.newItem.idx = writer + "-" + regDate.replace(/[^0-9]/g,"");
    this.newItem.writer = writer;
    this.newItem.reg_date = regDate;
    this.newItem.update_date = regDate;
    this.newItem.title = titleItem;
    this.newItem.content = contentItem;
    this.newItem.level = 0;
    this.newItem.order = 0;

    const itemsRef = this.afDB.list('/usage');
    itemsRef.push(this.newItem);

    this.modeAdd = false;
  }

  deleteItem(item) {
    console.log("deleteItem", item);
    const itemsRef = this.afDB.list('/usage');
    itemsRef.remove(item.key);
  }

  publicItem(item, isPublic) {

  }

  prepareEditItem(item) {
    item.editedContent = item.content;
    item.editing = true;
  }

  editItem(item) {
    item.content = item.editedContent
      .replace(/<script/g,"&lt;script")
      .replace(/<\/script/g,"&lt;/script")
      .replace(/\r\n/g,"<br/>")
      .replace(/\n/g,"<br/>");

    let data = {} as INotice;
    data.idx = item.idx;
    data.writer = item.writer;
    data.reg_date = item.reg_date;
    data.update_date = new Date().toISOString().slice(0,16);
    data.title = item.title;
    data.content = item.content;
    data.level = item.level;
    data.order = item.order;

    const itemsRef = this.afDB.list('/usage');
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
