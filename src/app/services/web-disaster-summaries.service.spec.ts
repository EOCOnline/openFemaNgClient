import { TestBed } from '@angular/core/testing';

import { WebDisasterSummariesService } from './web-disaster-summaries.service';

describe('WebDisasterSummariesService', () => {
  let service: WebDisasterSummariesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebDisasterSummariesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
