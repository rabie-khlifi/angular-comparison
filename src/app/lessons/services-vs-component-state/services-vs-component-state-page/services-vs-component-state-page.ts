import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LocalCounter } from '../local-counter/local-counter';
import { LegacySharedCounterPanel } from '../legacy-shared-counter-panel/legacy-shared-counter-panel';
import { SharedCounterPanel } from '../shared-counter-panel/shared-counter-panel';

@Component({
  selector: 'app-services-vs-component-state-page',
  imports: [LocalCounter, SharedCounterPanel, LegacySharedCounterPanel],
  templateUrl: './services-vs-component-state-page.html',
  styleUrl: './services-vs-component-state-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesVsComponentStatePage {}
