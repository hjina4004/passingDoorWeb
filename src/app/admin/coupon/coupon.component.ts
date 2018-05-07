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

  numberItems = 3;
  nextKey: any;
  prevKeys: any[] = [];
  subscription: any;

  coupons: AngularFireList<ICoupon[]>;

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

  getCouponList(key?) {
    if (this.subscription)
      this.subscription.unsubscribe();

    let observaberCoupon: any;
    if (key === undefined) {
      observaberCoupon = this.afDB.list(this.dbPath, ref =>
        ref.orderByKey().limitToFirst(this.numberItems + 1)
      );
    } else {
      observaberCoupon = this.afDB.list(this.dbPath, ref =>
        ref.orderByKey().startAt(key).limitToFirst(this.numberItems + 1)
      );
    }
    this.subscription = observaberCoupon.snapshotChanges().subscribe(map => {
      this.coupons = ARR.slice(map.map(value => ({key: value.key, ...value.payload.val()})), 0, this.numberItems);
      this.nextKey = ARR.get(map[this.numberItems], 'key');

      console.log("nextKey:", this.nextKey);
    });
  }

  onNext() {
    this.prevKeys.push(ARR.first(this.coupons)['key']);
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
}
