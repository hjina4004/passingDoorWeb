import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { IUserInfo } from '../models/user.m'

@Injectable()
export class UsersService {
  private dbPath: string = '/users';
  users: AngularFireList<IUserInfo> = null;

  constructor(private db: AngularFireDatabase) { }

  getUsers(numberItems, startKey?): AngularFireList<IUserInfo> {
    if (startKey === undefined) {
      this.users = this.db.list(this.dbPath, ref =>
        ref.orderByKey().limitToFirst(numberItems + 1)
      );
    } else {
      this.users = this.db.list(this.dbPath, ref =>
        ref.orderByKey().startAt(startKey).limitToFirst(numberItems + 1)
      );
    }

    return this.users;
  }

  updateUser(data) {
    const itemsRef = this.db.object(this.dbPath+"/"+data.key+"/ticket");
    itemsRef.set(data.ticket);
  }
}
