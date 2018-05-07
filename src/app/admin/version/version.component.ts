import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseChild } from '../base-child';

import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent extends BaseChild implements OnInit, OnDestroy {
  private dbPath: string = '/version';
  infoVersion: any;

  constructor(
    private afDB: AngularFireDatabase
  ) {
    super('version');
  }

  ngOnInit() {
    this.getVersion();
  }

  ngOnDestroy() {}

  getVersion() {
    this.afDB.object(this.dbPath).snapshotChanges().subscribe(action => {
      this.infoVersion = {...action.payload.val()};
    });
  }
}
