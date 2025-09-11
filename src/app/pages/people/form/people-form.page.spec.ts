
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PeopleFormPage } from './people-form.page';

describe('PeopleFormPage', () => {
  let component: PeopleFormPage;
  let fixture: ComponentFixture<PeopleFormPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PeopleFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
