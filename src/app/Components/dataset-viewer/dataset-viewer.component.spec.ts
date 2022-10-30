import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSetViewerComponent } from './dataset-viewer.component';

describe('DataSetViewerComponent', () => {
  let component: DataSetViewerComponent;
  let fixture: ComponentFixture<DataSetViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DataSetViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataSetViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
