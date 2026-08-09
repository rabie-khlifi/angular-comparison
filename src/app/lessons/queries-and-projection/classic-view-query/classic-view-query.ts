import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-classic-view-query',
  templateUrl: './classic-view-query.html',
  styleUrl: './classic-view-query.css',
})
export class ClassicViewQuery {
  // Before signal queries, @ViewChild assigned a matching view element to a property.
  @ViewChild('nameInput', { static: false }) private nameInput?: ElementRef<HTMLInputElement>;

  protected focusInput(): void {
    // nativeElement is appropriate here because focus() is a browser DOM API.
    this.nameInput?.nativeElement.focus();
  }
}
