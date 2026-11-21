import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isStoredImageUrl } from '../../util/image-url';

/** Shows a photo, falling back to the person's initials (or an icon) when there is none or it fails to load. */
@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnChanges {
  @Input() imageUrl: string | null = null;
  @Input() name = '';
  @Input() size: 'md' | 'lg' = 'md';
  @Input() placeholderIcon = 'fa-user';

  public broken = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.imageUrl) {
      this.broken = false;
    }
  }

  get showImage(): boolean {
    // blob: URLs are previews of a picked-but-unsaved photo
    const url = this.imageUrl || '';
    return !this.broken && (isStoredImageUrl(url) || url.startsWith('blob:'));
  }

  get initials(): string {
    return (this.name || '')
      .split(' ')
      .filter(part => part)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join('');
  }
}
