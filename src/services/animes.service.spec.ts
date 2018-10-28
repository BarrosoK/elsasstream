import { TestBed } from '@angular/core/testing';

import { AnimesService } from './animes.service';

describe('AnimesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnimesService = TestBed.get(AnimesService);
    expect(service).toBeTruthy();
  });
});
