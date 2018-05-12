import { Injectable } from '@angular/core';

import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from "@angular/router";
import * as firebase from 'firebase';

import { Subject, BehaviorSubject } from "rxjs/Rx";
import { ISubscription } from "rxjs/Subscription";
import { IUserInfo } from "../models/user.m"

@Injectable()
export class AuthService {
  authState: any = null;

  private subscription: ISubscription = null;
  userInfo = {} as IUserInfo;

  emitChange$: Subject<any> = new BehaviorSubject<any>(null);

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router:Router) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
      // console.log("AuthService authState: ", auth);
      let data = {key: "authState", value: this.authenticated};
      this.emit(data);
    });
  }

  emit(value: any) {
    this.emitChange$.next(value);
  }
  get emitChange(): BehaviorSubject<any> {
    return (this.emitChange$ as BehaviorSubject<any>);
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Returns current user email
  get currentUserEmail(): string {
    return this.authenticated ? this.authState.email : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.authState['displayName'] || 'User without a Name' }
  }

  //// Social Auth ////
  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  twitterLogin(){
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((credential) =>  {
      this.authState = credential.user
      this.updateUserData()
    })
    .catch(error => console.log(error));
  }

  //// Anonymous Auth ////
  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
    .then((user) => {
      this.authState = user
      this.updateUserData()
    })
    .catch(error => console.log(error));
  }

  //// Email/Password Auth ////
  emailSignUp(email:string, password:string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then((user) => {
      this.authState = user
      this.updateUserData()
    })
    .catch(error => console.log(error));
  }

  emailLogin(email:string, password:string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then((user) => {
      this.authState = user
      this.updateUserData()
    })
    .catch(error => {
      console.log(error);

      let data = {key: "message", value: error.message};
      this.emit(data);
    });
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    var auth = firebase.auth();

    return auth.sendPasswordResetEmail(email)
    .then(() => console.log("email sent"))
    .catch((error) => console.log(error))
  }

  //// Sign Out ////
  signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

  //// Helpers ////
  private updateUserData(): void {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features
    let path = `users/${this.currentUserId}`; // Endpoint on firebase
    let data = {
      email: this.authState.email,
      name: this.authState.displayName
    }

    this.db.object(path).update(data)
    .catch(error => console.log(error));

    if (this.subscription !== null) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    this.subscription = this.db.object(path).snapshotChanges().subscribe(action => {
      this.userInfo = action.payload.val();
    });
  }

  // Returns current user UID
  get currentUserInfo(): IUserInfo {
    return this.authenticated ? this.userInfo : null;
  }
}
