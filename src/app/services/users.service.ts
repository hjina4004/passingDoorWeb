import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { IUserInfo } from '../models/user.m'

@Injectable()
export class UsersService {
  private dbPath: string = '/users';
  users: AngularFireList<IUserInfo> = null;

  constructor(private db: AngularFireDatabase) { }

  getUsers(numberItems, startKey?, orderBy?, endKey?): AngularFireList<IUserInfo> {
    if (startKey === undefined || startKey == null) {
      if (orderBy === undefined || orderBy == null || orderBy == "key")
        this.users = this.db.list(this.dbPath, ref => ref.orderByKey().limitToFirst(numberItems + 1));
      else if (orderBy == "last_login")
        this.users = this.db.list(this.dbPath, ref => ref.orderByChild(orderBy).limitToLast(numberItems + 1));
      else
        this.users = this.db.list(this.dbPath, ref => ref.orderByChild(orderBy).limitToFirst(numberItems + 1));
    } else {
      if (orderBy === undefined || orderBy == null || orderBy == "key")
        this.users = this.db.list(this.dbPath, ref => ref.orderByKey().startAt(startKey).limitToFirst(numberItems + 1));
      else if (orderBy == "last_login")
        this.users = this.db.list(this.dbPath, ref => ref.orderByChild(orderBy).endAt(startKey).limitToLast(numberItems + 1));
      else if (endKey)
        this.users = this.db.list(this.dbPath, ref => ref.orderByChild(orderBy).startAt(startKey).endAt(endKey).limitToFirst(numberItems + 1));
      else
        this.users = this.db.list(this.dbPath, ref => ref.orderByChild(orderBy).startAt(startKey).limitToFirst(numberItems + 1));
    }

    return this.users;
  }

  updateUser(data) {
    const itemsRef = this.db.object(this.dbPath+"/"+data.key+"/ticket");
    itemsRef.set(data.ticket);
  }

  deleteUser(data) {
    const itemsRef = this.db.object(this.dbPath+"/"+data.key);
    itemsRef.remove();
  }
}
