import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WrittenJournalPage } from './written-journal.page';

describe('WrittenJournalPage', () => {
  let component: WrittenJournalPage;
  let fixture: ComponentFixture<WrittenJournalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WrittenJournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
