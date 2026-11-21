import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PhotoChange } from '../../model/photo-change';
import { isStoredImageUrl } from '../../util/image-url';
import { ALLOWED_PHOTO_TYPES, validatePhoto } from './photo-validation';

let nextId = 0;

/** Lets the user pick, preview or remove a photo; reports the choice through photoChange. */
@Component({
  selector: 'app-photo-picker',
  templateUrl: './photo-picker.component.html',
  styleUrls: ['./photo-picker.component.css']
})
export class PhotoPickerComponent implements OnInit, OnDestroy {
  /** The photo the employee already has, if any. */
  @Input() imageUrl: string | null = null;
  @Input() name = '';
  @Output() photoChange = new EventEmitter<PhotoChange>();

  public readonly inputId = `photo-input-${nextId++}`;
  public readonly accept = ALLOWED_PHOTO_TYPES.join(',');
  public preview: string | null = null;
  public error: string | null = null;
  private objectUrl: string | null = null;

  ngOnInit(): void {
    this.preview = isStoredImageUrl(this.imageUrl) ? this.imageUrl : null;
  }

  ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    // Clear the input so picking the same file again still fires a change event
    input.value = '';
    if (!file) {
      return;
    }
    this.error = validatePhoto(file);
    if (this.error) {
      return;
    }
    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(file);
    this.preview = this.objectUrl;
    this.photoChange.emit({ kind: 'replace', file });
  }

  public onRemove(): void {
    this.revokeObjectUrl();
    this.preview = null;
    this.error = null;
    this.photoChange.emit({ kind: 'remove' });
  }

  private revokeObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
