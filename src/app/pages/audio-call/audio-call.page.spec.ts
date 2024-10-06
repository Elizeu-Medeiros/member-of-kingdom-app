
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioCallPage } from './audio-call.page';

describe('AudioCallPage', () => {
  let component: AudioCallPage;
  let fixture: ComponentFixture<AudioCallPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AudioCallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
