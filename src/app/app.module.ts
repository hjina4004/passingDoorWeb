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
import { FormsModule } from "@angular/forms";
import { AppService } from './services/app.service';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    AuthService,
    AppService,
    AngularFireDatabase
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
