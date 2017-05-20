import { TestBed, inject } from '@angular/core/testing';

import { LoopService } from './loop.service';

describe('LoopService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoopService]
    });
  });

  it('should be created', inject([LoopService], (service: LoopService) => {
    expect(service).toBeTruthy();
  }));
});
