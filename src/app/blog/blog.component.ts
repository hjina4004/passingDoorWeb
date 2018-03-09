import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  title = "족보와 기출문제로 한방에~! 합격문입니다.";

  constructor(
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
  }

  signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider)
      .then((credential) =>  {
          console.log(credential);
      })
      .catch(error => console.log(error));
  }
}
