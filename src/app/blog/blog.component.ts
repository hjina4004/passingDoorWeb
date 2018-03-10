import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";

import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {
  title = "족보와 기출문제로 한방에~! 합격문입니다.";
  private subscription: ISubscription;

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
}
