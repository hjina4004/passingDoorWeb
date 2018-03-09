import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  title = "합겹문 관리자";
  authSubscribe = null;
  isSignedIn = false;

  constructor(
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.authSubscribe = this.afAuth.authState.subscribe(data => {
      console.log("authState:", data);
      if (data && data.email && data.uid) {
        this.isSignedIn = true;
        this.profile(data);
      } else {
        this.isSignedIn = false;
      }
    });
  }

  profile(auth) {
    console.log("profile:", auth);
  }
}
