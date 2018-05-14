import { Component, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { BaseChild } from '../base-child';

import { AppService } from '../../services/app.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { ICoupon } from '../../models/coupon.m';

import * as ARR from 'lodash';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent extends BaseChild implements OnInit, OnDestroy {
  private dbPath: string = '/coupon';
  private modeAdd = false;
  private newCoupon = {} as ICoupon;

  numberItems = 15;
  nextKey: any;
  prevKeys: any[] = [];
  subscription: any;

  coupons: AngularFireList<ICoupon[]>;
  currentSortBy = "key";
  s_use_user = "";
  s_use_date = "";
  s_message = "";

  constructor(
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private app: AppService,
    private afDB: AngularFireDatabase
  ) {
    super('coupon');
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.getCouponList();
  }

  ngOnDestroy() {
  }

  getCouponList(key?, endKey?) {
    if (this.subscription)
      this.subscription.unsubscribe();

    let observaberCoupon;
    if (key === undefined) {
      if (this.currentSortBy == "key") {
        observaberCoupon = this.afDB.list(this.dbPath, ref => ref.orderByKey().limitToFirst(this.numberItems + 1));
      } else {
        observaberCoupon = this.afDB.list(this.dbPath, ref => ref.orderByChild(this.currentSortBy).limitToFirst(this.numberItems + 1));
      }
    } else {
      if (this.currentSortBy == "key") {
        observaberCoupon = this.afDB.list(this.dbPath, ref => ref.orderByKey().startAt(key).limitToFirst(this.numberItems + 1));
      } else if (endKey) {
        observaberCoupon = this.afDB.list(this.dbPath, ref => ref.orderByChild(this.currentSortBy).startAt(key).endAt(endKey).limitToFirst(this.numberItems + 1));
      } else {
        observaberCoupon = this.afDB.list(this.dbPath, ref => ref.orderByChild(this.currentSortBy).startAt(key).limitToFirst(this.numberItems + 1));
      }
    }
    this.subscription = observaberCoupon.snapshotChanges().subscribe(map => {
      let data = map.map(value => ({key: value.key, ...value.payload.val()}));
      this.coupons = ARR.slice(data, 0, this.numberItems);
      this.nextKey = ARR.get(data[this.numberItems], this.currentSortBy);

      this.s_message = "";
      // console.log("nextKey:", this.nextKey);
    });
  }

  onNext() {
    this.prevKeys.push(ARR.first(this.coupons)[this.currentSortBy]);
    this.getCouponList(this.nextKey);
  }

  onPrev() {
    const prevKey = ARR.last(this.prevKeys);      // get last key
    this.prevKeys = ARR.dropRight(this.prevKeys); // delete last key

    this.getCouponList(prevKey);
  }

  prepareAddItem() {
    this.newCoupon.code_number = "";
    this.newCoupon.reg_date = "";
    this.newCoupon.use_user = "";
    this.newCoupon.use_date = "";

    this.modeAdd = true;
  }

  addItem() {
    if (this.newCoupon.code_number.length < 16){
      this.toastr.warning('쿠폰 번호를 다시 입력하세요.', null);
      return;
    }

    this.newCoupon.reg_date = this.app.getDateWithUTCOffset();

    const itemsRef = this.afDB.list(this.dbPath);
    itemsRef.push(this.newCoupon);

    this.modeAdd = false;
  }

  sortTable(sortBy) {
    if (this.currentSortBy == sortBy) {
      return;
    }

    this.currentSortBy = sortBy;
    this.prevKeys = [];
    this.getCouponList();
  }

  dataChanged(newObj) {
    let startKey = this.s_use_user;
    let endKey = this.s_use_user + "\uf8ff";
    if (this.currentSortBy == "use_date") {
      startKey = this.s_use_date;
      endKey = this.s_use_date + "\uf8ff";
    }
    this.s_message = "검색 중입니다."

    this.prevKeys = [];
    this.getCouponList(startKey, endKey);
  }
}
