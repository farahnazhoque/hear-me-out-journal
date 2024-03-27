import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoiceFolderPage } from './voice-folder.page';

describe('VoiceFolderPage', () => {
  let component: VoiceFolderPage;
  let fixture: ComponentFixture<VoiceFolderPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VoiceFolderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
