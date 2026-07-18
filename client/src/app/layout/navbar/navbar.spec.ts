import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Navbar } from './navbar';

describe('Navbar', () => {
    beforeEach(() => {async () => {
        await TestBed.configureTestingModule({
            imports: [Navbar],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    it('should create', () => { 
        const fixture = TestBed.createComponent(Navbar);

        expect(fixture.componentInstance).toBeTruthy();

    });

    it('should display the application name', () => {
        const fixture = TestBed.createComponent(Navbar);
        fixture.detectChanges();

        const element = fixture.nativeElement as HTMLElement;

        expect(element.textContent).toContain('Reservation System');

    });

    it('should link to the dashboard', () => {
        const fixture = TestBed.createComponent(Navbar);
        fixture.detectChanges();

        const element = fixture.nativeElement as HTMLElement;

        const link = element.querySelector('a[href ="/dashboard"]') as HTMLAnchorElement | null;
        expect(link).toBeTruthy();
        expect(link?.textContent?.trim()).toBe('Dashboard');
    });

    it('should link to the new reservations page', () => {
        const fixture = TestBed.createComponent(Navbar);
        fixture.detectChanges();

        const element = fixture.nativeElement as HTMLElement;
        const link = element.querySelector('a[href ="/reservations/new"]') as HTMLAnchorElement | null;
        expect(link).toBeTruthy();
        expect(link?.textContent?.trim()).toBe('New Reservation');
    })
});