import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { BaseChild } from '../base-child';

import { UsersService } from "../../services/users.service";
import * as ARR from 'lodash';
import * as $ from 'jquery';

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
  none_ticket = "이용권이 없습니다.";

  selected_user = null;
  selected_ticket = '';

  currentSortBy = "key";

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

    this.subscription = this.usersService.getUsers(this.numberItems, key, this.currentSortBy).snapshotChanges()
      .subscribe(map => {
        let data = map.map(value => ({key: value.key, ...value.payload.val()}));
        if (this.currentSortBy == "last_login")
          data = this.reverseObject(data);
        this.users = ARR.slice(data, 0, this.numberItems);
        this.nextKey = ARR.get(data[this.numberItems], this.currentSortBy);

        // console.log("data:", data[this.numberItems]);
        // console.log("nextKey:", this.nextKey);
      });
  }

  onNext() {
    this.prevKeys.push(ARR.first(this.users)[this.currentSortBy]);
    this.getUsersList(this.nextKey);
  }

  onPrev() {
    const prevKey = ARR.last(this.prevKeys);      // get last key
    this.prevKeys = ARR.dropRight(this.prevKeys); // delete last key

    this.getUsersList(prevKey);
  }

  tableTicket(user) {
    this.selected_ticket = JSON.stringify(user.ticket);
    this.selected_user = user;

    let title = user.display_name + " (" + user.key + ")";
    let str = "<p>과목별 이용권</p><table class='table table-bordered'><tbody>";
    str += "<tr><td>부동산학 개론</td><td id='ticket_re'>" + this.getTicketDate(user.ticket.ticket_re) + "</td></tr>";
    str += "<tr><td>민법 및 민사 특별법</td><td id='ticket_cl'>" + this.getTicketDate(user.ticket.ticket_cl) + "</td></tr>";
    str += "<tr><td>중개사 법령 및 실무</td><td id='ticket_bs'>" + this.getTicketDate(user.ticket.ticket_bs) + "</td></tr>";
    str += "<tr><td>부동산 공법</td><td id='ticket_pl'>" + this.getTicketDate(user.ticket.ticket_pl) + "</td></tr>";
    str += "<tr><td>공시법 및 세법</td><td id='ticket_dtl'>" + this.getTicketDate(user.ticket.ticket_dtl) + "</td></tr>";
    str += "</tbody></table>";
    str += "<button id='tableTicket-apply' class='btn btn-danger btn-block d-none'>적용</button>";

    this.showModal({title:title, message:str, type:"tableTicket"});

    let ids = ["ticket_re", "ticket_cl", "ticket_bs", "ticket_pl", "ticket_dtl"];
    let parent = this;
    for (let i = 0; i < ids.length; i++) {
      let strID = ids[i];
      $('#'+strID).click(function() { parent.editTicket(strID); });
    }
    $('#tableTicket-apply').click(function() { parent.applyTicket(); });
  }

  getTicketDate(ticket) {
    return (ticket)? this.datePipe.transform(ticket.expiry_date, "y년 M월 d일"):this.none_ticket;
  }

  editTicket(elID) {
    let txtHtml = '<input type="text" class="form-control" value="' + this.selected_user.ticket[elID].expiry_date + '">';
    $('#'+elID).off();
    $('#'+elID).html(txtHtml);
    $('#tableTicket-apply').removeClass('d-none');
  }

  applyTicket() {
    let ids = ["ticket_re", "ticket_cl", "ticket_bs", "ticket_pl", "ticket_dtl"];
    for (let i = 0; i < ids.length; i++) {
      let strID = ids[i];
      let objInput = $('#'+strID).find('input');
      if (objInput.length == 0)
        continue;

      this.selected_user.ticket[strID].expiry_date = objInput.val();
    }

    const modified_ticket = JSON.stringify(this.selected_user.ticket);
    if (modified_ticket != this.selected_ticket) {
      this.usersService.updateUser(this.selected_user);
    }
    this.hideModal();
  }

  sortTable(sortBy) {
    if (this.currentSortBy == sortBy) {
      return;
    }

    this.currentSortBy = sortBy;
    this.prevKeys = [];

    this.getUsersList();
  }
}
