
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
