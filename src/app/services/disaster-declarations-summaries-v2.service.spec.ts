import { TestBed } from '@angular/core/testing';

import { DisasterDeclarationsSummariesV2Service } from './disaster-declarations-summaries-v2.service';

describe('DisasterDeclarationsSummariesV2Service', () => {
  let service: DisasterDeclarationsSummariesV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisasterDeclarationsSummariesV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
