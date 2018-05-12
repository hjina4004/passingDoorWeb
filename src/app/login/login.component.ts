import { Component, ViewContainerRef, OnInit, Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

import { Router } from "@angular/router";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as firebase from 'firebase';

import { AuthService } from '../services/auth.service';

const STORAGE_KEY = 'pure-awesomeness';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@Injectable()
export class LoginComponent implements OnInit {
  user = {email:"", password:""};
  dataManager = {email:""};
  private subscription: any;

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private auth: AuthService,
    private router: Router
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.infoManager();
  }

  responseDialog(data) {
    // console.log(data);
    if (data && data.key == "authState" && data.value) {
      if (this.auth.currentUserEmail == this.dataManager.email) {
        this.storage.set(STORAGE_KEY, this.dataManager.email);
      } else {
        this.auth.signOut();
        return;
      }

      this.router.navigate(['/admin']);
      if (this.subscription) this.subscription.unsubscribe();
    } else if (data && data.key == "message" && data.value) {
      this.toastr.warning(data.value, null);
    }
  }

  login() {
    if (this.user.email != this.dataManager.email) {
      this.toastr.warning('아이디와 비밀번호를 확인하십시오.', null);
      return;
    }

    this.auth.emailLogin(this.user.email, this.user.password);
    this.storage.set(STORAGE_KEY, this.user.email);
  }

  infoManager() {
    firebase.database().ref('/manager').once('value').then((snapshot) => {
      // console.log("manager:", ...snapshot.val());
      this.allocateManager(snapshot.val());
    });
  }

  allocateManager(data) {
    this.dataManager.email = data.email;
    this.subscription = this.auth.emitChange.subscribe(data => {
      this.responseDialog(data);
    });
  }
}
