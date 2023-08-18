import { TestBed } from '@angular/core/testing';

import { StatusCategoryService } from './status-category.service';

describe('StatusCategoryService', () => {
  let service: StatusCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
