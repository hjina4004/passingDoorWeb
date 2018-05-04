import { Component, ViewContainerRef, OnInit, Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

import { Router } from "@angular/router";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as firebase from 'firebase';

const STORAGE_KEY = 'pure-awesomeness';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@Injectable()
export class LoginComponent implements OnInit {
  user = {name:"", password:""};
  dataManager = {name:"", password:""};

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private router: Router
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.infoManager();
  }

  login() {
    if (this.user.name != this.dataManager.name || this.user.password != this.dataManager.password) {
      this.toastr.warning('아이디와 비밀번호를 확인하십시오.', null);
      return;
    }

    this.storage.set(STORAGE_KEY, this.user.name);
    this.router.navigate(['/'+this.user.name]);
  }

  infoManager() {
    firebase.database().ref('/manager').once('value').then((snapshot) => {
      this.allocateManager(snapshot.val());
    });
  }

  allocateManager(data) {
    this.dataManager.name = data.name;
    this.dataManager.password = data.password;
  }
}
