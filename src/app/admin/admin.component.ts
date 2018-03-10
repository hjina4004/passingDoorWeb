import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";

import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  title = "합격문 관리자";
  private subscription: ISubscription;

  constructor(
    private auth: AuthService,
    private router:Router
  ) { }

  ngOnInit() {
    this.subscription = this.auth.emitChange.subscribe(data => {
      console.log(data);
      // if (data == "authState") {
      //   this.crrentAuthState();
      // }
    });
    console.log("admin - ngOnInit done");
  }

  ngOnDestroy() {
    console.log("admin - ngOnDestroy ...");
    this.subscription.unsubscribe();
    console.log("admin - ngOnDestroy done");
  }

  crrentAuthState() {
    if (!this.auth.authenticated) {
      this.router.navigate(['/']);
    }
  }
}
