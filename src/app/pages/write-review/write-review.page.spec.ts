
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WriteReviewPage } from './write-review.page';

describe('WriteReviewPage', () => {
  let component: WriteReviewPage;
  let fixture: ComponentFixture<WriteReviewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WriteReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
