import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Navbar } from './navbar';

describe('Navbar', () => {
    
    let fixture: ComponentFixture<Navbar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Navbar],
            providers: [provideRouter([])],
        }).compileComponents();
        fixture = TestBed.createComponent(Navbar);
        await fixture.whenStable();
    });

    it('should create', () => { 
        expect(fixture.componentInstance).toBeTruthy();

    });

    it('should display the application name', () => {
        const element = fixture.nativeElement as HTMLElement;

        expect(element.textContent).toContain('Reservation System');

    });

    it('should link to the dashboard', () => {
        const element = fixture.nativeElement as HTMLElement;

        const links = Array.from(element.querySelectorAll('a'));
        const link = links.find(anchor => anchor.textContent?.trim() === 'Dashboard');
        expect(link).toBeTruthy();
        expect(link?.getAttribute('href')).toContain('/dashboard');
    });

    it('should link to the new reservations page', () => {
        const element = fixture.nativeElement as HTMLElement;
        const links = Array.from(element.querySelectorAll('a'));

        const link = links.find(anchor => anchor.textContent?.trim() === 'New Reservation');

        expect(link).toBeTruthy();
        expect(link?.getAttribute('href')).toContain('/reservations/new');
    });

        
});