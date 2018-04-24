import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';
import * as $ from 'jquery';
import 'bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '합격문 v1.0';

  constructor(
    public auth: AuthService
  ) {
  }

  signIn() {
    this.auth.googleLogin();
  }

  signOut() {
    this.auth.signOut();
  }

  openModal() {
    $('#myModal').modal('show');
  }

  confirmModal(res) {
    console.log("confirmModal:", res);
    $('#myModal').modal('hide');

    let key = $('#myModal').find('.modal-type').val();
    if (!key || key == '')
      key = "confirmModal";

    let data = {key: key, value: res === 1};
    this.auth.emit(data);
  }

  get isAdmin(): boolean {
    if (!this.auth.authState) { return false }
    else if (this.auth.currentUserInfo.level == '10')  { return true }
    return false;
  }
}
