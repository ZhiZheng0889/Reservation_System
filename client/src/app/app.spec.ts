import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    await fixture.whenStable();
  });

  it('should create the app', () => {
    fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the navbar', () => {
    fixture.whenStable();
    expect(
      fixture.nativeElement.querySelector('app-navbar')
    ).toBeTruthy();
  });

  it('should render the router outlet', () => {
    fixture.whenStable();
    expect(
      fixture.nativeElement.querySelector('router-outlet')
    ).toBeTruthy();
  });

  it('should render the footer', () => {
    fixture.whenStable();
    expect(
      fixture.nativeElement.querySelector('app-footer')
    ).toBeTruthy();
  });
});
