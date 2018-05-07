import { Component, OnInit } from '@angular/core';

import { BaseChild } from '../base-child';

import { UsersService } from "../../services/users.service";
import * as ARR from 'lodash';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent extends BaseChild implements OnInit {
  users: any;
  numberItems = 3;
  nextKey: any;
  prevKeys: any[] = [];
  subscription: any;
  none_ticket = "사용권이 없습니다.";

  constructor(private usersService:UsersService) {
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
}
