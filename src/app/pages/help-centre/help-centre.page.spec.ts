
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpCentrePage } from './help-centre.page';

describe('HelpCentrePage', () => {
  let component: HelpCentrePage;
  let fixture: ComponentFixture<HelpCentrePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HelpCentrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
