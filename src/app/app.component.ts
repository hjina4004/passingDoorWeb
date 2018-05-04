import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
  img = {
    logo: "https://firebasestorage.googleapis.com/v0/b/passingdoor-f3b31.appspot.com/o/images%2Flogo.png?alt=media",
    icon: "https://firebasestorage.googleapis.com/v0/b/passingdoor-f3b31.appspot.com/o/images%2Ficon.png?alt=media"
  };

  constructor(
    public auth: AuthService,
    private router: Router
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

  get isShowNav(): boolean {
    if (this.router.url == "/blog")
      return true;

    return false;
  }

  goToAnchor(fragment): void {
    var scmove = $('#'+fragment).offset().top;
    $('html, body').animate({scrollTop : scmove}, 500);
  }
}
