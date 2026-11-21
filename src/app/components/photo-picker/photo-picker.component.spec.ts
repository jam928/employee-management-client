import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoChange } from '../../model/photo-change';
import { PhotoPickerComponent } from './photo-picker.component';

describe('PhotoPickerComponent', () => {
  let fixture: ComponentFixture<PhotoPickerComponent>;
  let component: PhotoPickerComponent;
  let changes: PhotoChange[];

  const png = () => new File(['png'], 'avatar.png', { type: 'image/png' });
  const select = (file: File) => component.onFileSelected(<any>{ target: { files: [file], value: 'x' } });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhotoPickerComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(PhotoPickerComponent);
    component = fixture.componentInstance;
    changes = [];
    component.photoChange.subscribe((change: PhotoChange) => changes.push(change));
  });

  it('previews the current photo', () => {
    component.imageUrl = 'http://localhost:9000/employee-images/a.png';
    fixture.detectChanges();
    expect(component.preview).toEqual(component.imageUrl);
  });

  it('treats a non-URL imageUrl as no photo', () => {
    component.imageUrl = 'avatar1.png';
    fixture.detectChanges();
    expect(component.preview).toBeNull();
  });

  it('previews and reports a valid image', () => {
    fixture.detectChanges();
    select(png());
    expect(component.preview).toMatch(/^blob:/);
    expect(component.error).toBeNull();
    expect(changes).toEqual([{ kind: 'replace', file: jasmine.any(File) as any }]);
  });

  it('rejects unsupported types and files over 5 MB', () => {
    fixture.detectChanges();
    select(new File(['<svg/>'], 'x.svg', { type: 'image/svg+xml' }));
    expect(component.error).toContain('JPEG, PNG, GIF or WebP');

    select(new File([new ArrayBuffer(5 * 1024 * 1024 + 1)], 'big.png', { type: 'image/png' }));
    expect(component.error).toContain('5 MB');
    expect(changes).toEqual([]);
  });

  it('reports removal', () => {
    component.imageUrl = 'http://localhost:9000/employee-images/a.png';
    fixture.detectChanges();
    component.onRemove();
    expect(component.preview).toBeNull();
    expect(changes).toEqual([{ kind: 'remove' }]);
  });
});
