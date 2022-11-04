import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetGridComponent } from './dataset-grid.component';

describe('DatasetGridComponent', () => {
  let component: DatasetGridComponent;
  let fixture: ComponentFixture<DatasetGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatasetGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
