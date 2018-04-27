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
  img = {
    intro: "https://firebasestorage.googleapis.com/v0/b/passingdoor-f3b31.appspot.com/o/images%2Fscreen-intro.png?alt=media",
    keyword: "https://firebasestorage.googleapis.com/v0/b/passingdoor-f3b31.appspot.com/o/images%2Fscreen-keyword.png?alt=media",
    note: "https://firebasestorage.googleapis.com/v0/b/passingdoor-f3b31.appspot.com/o/images%2Fscreen-note.png?alt=media",
    problem_status: "https://firebasestorage.googleapis.com/v0/b/passingdoor-f3b31.appspot.com/o/images%2Fscreen-problem-status.png?alt=media",
    problem: "https://firebasestorage.googleapis.com/v0/b/passingdoor-f3b31.appspot.com/o/images%2Fscreen-problem.png?alt=media",
    search: "https://firebasestorage.googleapis.com/v0/b/passingdoor-f3b31.appspot.com/o/images%2Fscreen-search.png?alt=media",
    solve: "https://firebasestorage.googleapis.com/v0/b/passingdoor-f3b31.appspot.com/o/images%2Fscreen-solve.png?alt=media",
    study_graph: "https://firebasestorage.googleapis.com/v0/b/passingdoor-f3b31.appspot.com/o/images%2Fscreen-study-graph.png?alt=media",
    study_status: "https://firebasestorage.googleapis.com/v0/b/passingdoor-f3b31.appspot.com/o/images%2Fscreen-study-status.png?alt=media",
    icon: "https://firebasestorage.googleapis.com/v0/b/passingdoor-f3b31.appspot.com/o/images%2Ficon.png?alt=media"
  };

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
