import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-shadow-card',
  templateUrl: './shadow-card.html',
  styleUrl: './shadow-card.css',
  // ShadowDom asks the browser to create a real shadow root for this component view.
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ShadowCard {}
