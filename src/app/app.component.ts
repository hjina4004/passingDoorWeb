import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '합격문 v1.0';

  constructor(
    private auth: AuthService
  ) {
  }

  signIn() {
    this.auth.googleLogin();
  }

  signOut() {
    this.auth.signOut();
  }
}
