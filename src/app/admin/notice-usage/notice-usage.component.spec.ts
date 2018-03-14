import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeUsageComponent } from './notice-usage.component';

describe('NoticeUsageComponent', () => {
  let component: NoticeUsageComponent;
  let fixture: ComponentFixture<NoticeUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
