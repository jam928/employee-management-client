import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let fixture: ComponentFixture<AvatarComponent>;
  let component: AvatarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [AvatarComponent] }).compileComponents();
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
  });

  it('shows the photo when there is a valid URL', () => {
    component.imageUrl = 'http://localhost:9000/employee-images/a.png';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img')).toBeTruthy();
  });

  it('falls back to up to two initials', () => {
    component.imageUrl = 'not-a-url';
    component.name = 'daniel van soa';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(fixture.nativeElement.textContent.trim()).toEqual('DV');
  });

  it('falls back to initials when the photo fails to load', () => {
    component.imageUrl = 'http://localhost:9000/missing.png';
    component.name = 'Daniel Soa';
    fixture.detectChanges();
    fixture.nativeElement.querySelector('img').dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toEqual('DS');
  });

  it('shows the placeholder icon when there is no name', () => {
    component.placeholderIcon = 'fa-camera';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('i.fa-camera')).toBeTruthy();
  });
});
