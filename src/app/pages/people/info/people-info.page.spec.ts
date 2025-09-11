
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeopleInfoPage } from './people-info.page';

describe('PeopleInfoPage', () => {
  let component: PeopleInfoPage;
  let fixture: ComponentFixture<PeopleInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PeopleInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
