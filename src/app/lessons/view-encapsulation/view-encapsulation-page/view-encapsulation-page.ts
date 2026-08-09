import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmulatedCard } from '../emulated-card/emulated-card';
import { NoneCard } from '../none-card/none-card';
import { ShadowCard } from '../shadow-card/shadow-card';

@Component({
  selector: 'app-view-encapsulation-page',
  // The page imports one component for each encapsulation mode being compared.
  imports: [EmulatedCard, NoneCard, ShadowCard],
  templateUrl: './view-encapsulation-page.html',
  styleUrl: './view-encapsulation-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewEncapsulationPage {}
