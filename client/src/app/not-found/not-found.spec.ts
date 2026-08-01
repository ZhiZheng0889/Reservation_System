import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { NotFound } from './not-found';

describe('NotFound', () => {
  it('should create', async () => {
    TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [provideRouter([{ path: 'not-found', component: NotFound }])],
    });

    const harness = await RouterTestingHarness.create();

    const component = await harness.navigateByUrl('/not-found', NotFound);

    expect(component).toBeTruthy();

  });
});
