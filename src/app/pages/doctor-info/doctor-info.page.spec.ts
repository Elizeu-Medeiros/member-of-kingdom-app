/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Doctor-Appointment - 1 This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorInfoPage } from './doctor-info.page';

describe('DoctorInfoPage', () => {
  let component: DoctorInfoPage;
  let fixture: ComponentFixture<DoctorInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DoctorInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
