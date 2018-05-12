import { Component, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { BaseChild } from '../base-child';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Http, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-fcm',
  templateUrl: './fcm.component.html',
  styleUrls: ['./fcm.component.scss'],
})
export class FcmComponent extends BaseChild implements OnInit, OnDestroy {
  url = "https://fcm.googleapis.com/fcm/send";
  headers = {
    "Authorization": "key=AAAAIx9XP-c:APA91bHdA8044HD4F7qsnMgXJp3kOmqWmQTGy9hrK44itPPRu7kkDfXqOmyX8QwWtkxosWyHx4psMWbCMwqqMrghGFj5dQzQCuwxvnVQGGrDn0tkgx32fWpErFBfVzXocYkDSZJJ7v2G",
    "Content-Type": "application/json"
  }
  fcmData = {
    "to" : "/topics/passok.kr",
    "data" : { "page" : "notice", "title" : "합격문에서 알립니다.", "message" : "" }
  };

  constructor(
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private http:Http
  ) {
    super('fcm');
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  sendMessage() {
    let headers = new Headers(this.headers);
    let options = new RequestOptions({headers: headers});
    this.http.post(this.url, this.fcmData, options)
             .subscribe(res => this.toastr.info("메시지를 보냈습니다."));
  }
}
