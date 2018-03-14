import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FIREBASE_CONFIG } from './firebase.credentials';

import { AppRoutingModule } from './/app-routing.module';

import { AppComponent } from './app.component';
import { BlogComponent } from './blog/blog.component';
import { AdminComponent } from './admin/admin.component';

import { AuthService } from './services/auth.service';
import { MemberComponent } from './admin/member/member.component';
import { NoticeComponent } from './admin/notice/notice.component';
import { NoticeUsageComponent } from './admin/notice-usage/notice-usage.component';
import { NoticeEventComponent } from './admin/notice-event/notice-event.component';
import { ProblemComponent } from './admin/problem/problem.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    BlogComponent,
    AdminComponent,
    MemberComponent,
    NoticeComponent,
    NoticeUsageComponent,
    NoticeEventComponent,
    ProblemComponent
  ],
  imports: [
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    AngularFireDatabase
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
