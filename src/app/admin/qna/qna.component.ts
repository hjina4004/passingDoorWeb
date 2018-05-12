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

import { IComment, IQnA } from '../../models/qna.m';

@Component({
  selector: 'app-qna',
  templateUrl: './qna.component.html',
  styleUrls: ['./qna.component.scss']
})
export class QnaComponent extends BaseChild implements OnInit, OnDestroy {
  private subscription: ISubscription;
  private selectedItem: IQnA = null;
  private newItem = {} as IQnA;

  qnas: Observable<IQnA[]>;

  constructor(
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private app: AppService,
    private auth: AuthService,
    private afDB: AngularFireDatabase
  ) {
     super('qna');
     this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.subscription = this.auth.emitChange.subscribe(data => {
      this.responseDialog(data);
    });
    this.loadData();
  }

  ngOnDestroy() {
    // console.log("QnaComponent - ngOnDestroy ...");
    this.subscription.unsubscribe();
    // console.log("QnaComponent - ngOnDestroy done");
  }

  loadData() {
    const itemsRef = this.afDB.list('/qna');
    this.qnas = itemsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({key: c.key,  ...c.payload.val(), expanded: false, editing: false, editedContent:'' }));
    });
  }

  responseDialog(data) {
    // console.log(data);
    if (data && data.key == "prepareDeleteItem" && data.value) {
      this.deleteItem(this.selectedItem);
    }
  }

  expandItem(item) {
    item.expanded = !item.expanded;
    // console.log("item:", item);
  }

  prepareDeleteItem(item, ev) {
    ev.stopPropagation();
    let msg = '<p style="text-align:center;color:red;">'+ item.title + '</p>';
    msg += '<div style="text-align:center;">위 1:1 질문을 삭제합니다.</div>';
    this.showConfirmModal({title:"1:1 질문", message:msg, type:"prepareDeleteItem"});
    this.selectedItem = item;
  }

  deleteItem(item) {
    // console.log("deleteItem", item);
    const itemsRef = this.afDB.list('/qna');
    itemsRef.remove(item.key);
  }

  publicItem(item, isPublic) {

  }

  prepareEditItem(item) {
    if (!item.comment || !item.comment.content)
      item.comment = {content:"", reg_date:""};

    item.editedContent = item.comment.content;
    item.editing = true;
  }

  editItem(item) {
    item.comment.reg_date = new Date().toISOString().slice(0,16);
    item.comment.content = item.editedContent
      .replace(/<script/g,"&lt;script")
      .replace(/<\/script/g,"&lt;/script")
      .replace(/\r\n/g,"<br/>")
      .replace(/\n/g,"<br/>");

    let data = {} as IQnA;
    let comment = {} as IComment;
    data.writer = item.writer;
    data.reg_date = item.reg_date;
    data.title = item.title;
    data.content = item.content;
    comment.content = item.comment.content;
    comment.reg_date = item.comment.reg_date;
    data.comment = comment;

    const itemsRef = this.afDB.list('/qna');
    itemsRef.set(item.key, data);

    this.cancelEditItem(item);
  }

  cancelEditItem(item) {
    item.editing = false;
  }

  doTextareaValueChange(item, ev) {
    item.editedContent = ev.target.value;
  }

  labelBtnWrite(item) {
    if (item.comment) {
      return "답변 수정";
    }

    return "답변 쓰기";
  }
}
