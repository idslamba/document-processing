import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedDocumentComponent } from './selected-document.component';

describe('SelectedDocumentComponent', () => {
  let component: SelectedDocumentComponent;
  let fixture: ComponentFixture<SelectedDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectedDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
