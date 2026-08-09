import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LocalCounter } from '../local-counter/local-counter';
import { SharedCounterPanel } from '../shared-counter-panel/shared-counter-panel';

@Component({
  selector: 'app-services-vs-component-state-page',
  imports: [LocalCounter, SharedCounterPanel],
  templateUrl: './services-vs-component-state-page.html',
  styleUrl: './services-vs-component-state-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesVsComponentStatePage {}
