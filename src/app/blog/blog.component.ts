import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";

import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {
  private subscription: ISubscription;

  itemQnA = {name:"", phone:"", content:""};

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.subscription = this.auth.emitChange.subscribe(data => {
      console.log(data);
    });
    console.log("blog - ngOnInit done");
  }

  ngOnDestroy() {
    console.log("blog - ngOnDestroy ...");
    this.subscription.unsubscribe();
    console.log("blog - ngOnDestroy done");
  }

  mailto() {
    const strMail = 'mailto:help@passok.kr';
    let subject = '?subject=' + encodeURI(this.itemQnA.name + '이 합격문에 문의드립니다.');
    let body = '&body=' + encodeURI('이름: ' + this.itemQnA.name + '\n전화번호: ' + this.itemQnA.phone + '\n\n' + this.itemQnA.content);
    window.location.href = strMail + subject + body;
  }
}
