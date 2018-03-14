import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeEventComponent } from './notice-event.component';

describe('NoticeEventComponent', () => {
  let component: NoticeEventComponent;
  let fixture: ComponentFixture<NoticeEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
