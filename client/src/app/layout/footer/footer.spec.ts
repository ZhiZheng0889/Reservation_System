import { TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Footer],
        }).compileComponents();
    });

    
    it('should create', () => {
        const fixture = TestBed.createComponent(Footer);
        
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render a footer element', () => {
        const fixture = TestBed.createComponent(Footer);
        fixture.detectChanges();
        const element = fixture.nativeElement as HTMLElement;
        expect(element.querySelector('footer')).toBeTruthy();
    });

    it('should display the application name', () => {
        const fixture = TestBed.createComponent(Footer);
        fixture.detectChanges();
        const element = fixture.nativeElement as HTMLElement;
        expect(element.textContent).toContain('Reservation System');
    });

    it('should not display generated placeholder text', () => {
        const fixture = TestBed.createComponent(Footer);
        fixture.detectChanges();
        const element = fixture.nativeElement as HTMLElement;
        expect(element.textContent).not.toContain('footer works!');
    });
});