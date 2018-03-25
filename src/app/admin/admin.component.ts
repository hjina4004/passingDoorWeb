import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";

import { BaseChild } from "./base-child"
import { MemberComponent } from "./member/member.component"
import { NoticeComponent } from "./notice/notice.component"
import { NoticeEventComponent } from "./notice-event/notice-event.component"
import { NoticeUsageComponent } from "./notice-usage/notice-usage.component"
import { ProblemComponent } from "./problem/problem.component"


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  @ViewChild(MemberComponent) memberComponent: MemberComponent;
  @ViewChild(NoticeComponent) noticeComponent: NoticeComponent;
  @ViewChild(NoticeEventComponent) noticeEventComponent: NoticeEventComponent;
  @ViewChild(NoticeUsageComponent) noticeUsageComponent: NoticeUsageComponent;
  @ViewChild(ProblemComponent) problemComponent: ProblemComponent;

  title = "합격문 관리자";
  private currentMenu: BaseChild = null;

  constructor(
    private auth: AuthService,
    private router:Router
  ) { }

  ngOnInit() {
    console.log("admin - ngOnInit done");

    this.crrentAuthState();
    this.currentMenu = this.memberComponent;
    this.goToMenu('notice');
  }

  ngOnDestroy() {
    console.log("admin - ngOnDestroy done");
  }

  crrentAuthState() {
    if (!this.auth.authenticated) {
      this.router.navigate(['/']);
    }
  }

  get stringCurrentMenu() {
    return this.currentMenu.title;
  }

  goToMenu(menu) {
    this.currentMenu.show(false);

    if (menu == 'member') {
      this.currentMenu = this.memberComponent;
    } else if (menu == 'event') {
      this.currentMenu = this.noticeEventComponent;
    } else if (menu == 'notice') {
      this.currentMenu = this.noticeComponent;
    } else if (menu == 'usage') {
      this.currentMenu = this.noticeUsageComponent;
    } else if (menu == 'problem') {
      this.currentMenu = this.problemComponent;
    }

    this.currentMenu.show(true);
  }
}
