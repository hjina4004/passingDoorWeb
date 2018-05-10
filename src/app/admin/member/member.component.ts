import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { BaseChild } from '../base-child';

import { UsersService } from "../../services/users.service";
import * as ARR from 'lodash';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  providers: [DatePipe]
})
export class MemberComponent extends BaseChild implements OnInit {
  users: any;
  numberItems = 10;
  nextKey: any;
  prevKeys: any[] = [];
  subscription: any;
  none_ticket = "사용권이 없습니다.";

  constructor(
    private datePipe: DatePipe,
    private usersService:UsersService
  ) {
     super('member');
  }

  ngOnInit() {
    this.getUsersList();
  }

  getUsersList(key?) {
    if (this.subscription)
      this.subscription.unsubscribe();

    this.subscription = this.usersService.getUsers(this.numberItems, key).snapshotChanges()
      .subscribe(map => {
        this.users = ARR.slice(map.map(value => ({key: value.key, ...value.payload.val()})), 0, this.numberItems);
        this.nextKey = ARR.get(map[this.numberItems], 'key');

        console.log("nextKey:", this.nextKey);
      });
  }

  onNext() {
    this.prevKeys.push(ARR.first(this.users)['key']);
    this.getUsersList(this.nextKey);
  }

  onPrev() {
    const prevKey = ARR.last(this.prevKeys);      // get last key
    this.prevKeys = ARR.dropRight(this.prevKeys); // delete last key

    this.getUsersList(prevKey);
  }

  tableTicket(user) {
    let str = "<table class='table table-bordered'><tbody>";

    str += "<tr><td>부동산학 개론</td><td>" + this.getTicketDate(user.ticket.ticket_re) + "</td></tr>";
    str += "<tr><td>민법 및 민사 특별법</td><td>" + this.getTicketDate(user.ticket.ticket_cl) + "</td></tr>";
    str += "<tr><td>중개사 법령 및 실무</td><td>" + this.getTicketDate(user.ticket.ticket_bs) + "</td></tr>";
    str += "<tr><td>부동산 공법</td><td>" + this.getTicketDate(user.ticket.ticket_pl) + "</td></tr>";
    str += "<tr><td>공시법 및 세법</td><td>" + this.getTicketDate(user.ticket.ticket_dtl) + "</td></tr>";

    str += "</tbody></table>";
    this.showModal({title:"과목별 사용권 만료일", message:str});
  }

  getTicketDate(ticket) {
    return (ticket)? this.datePipe.transform(ticket.expiry_date, "y년 M월 d일"):this.none_ticket;
  }
}
