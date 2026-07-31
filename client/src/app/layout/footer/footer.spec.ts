import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
    let fixture: ComponentFixture<Footer>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Footer],
        }).compileComponents();

        fixture =TestBed.createComponent(Footer);
        await fixture.whenStable();
    });

    
    it('should create', () => {
        fixture.whenStable();
        
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render a footer element', () => {
        fixture.whenStable();
        const element = fixture.nativeElement as HTMLElement;
        expect(element.querySelector('footer')).toBeTruthy();
    });

    it('should display the application name', () => {
        fixture.whenStable();
        const element = fixture.nativeElement as HTMLElement;
        expect(element.textContent).toContain('Reservation System');
    });

    it('should not display generated placeholder text', () => {
        fixture.whenStable();
        const element = fixture.nativeElement as HTMLElement;
        expect(element.textContent).not.toContain('footer works!');
    });
});