import { Component } from '@angular/core';
import { InteractiveHighlight } from '../interactive-highlight';
import { StatusCard } from '../status-card/status-card';

@Component({
  selector: 'app-components-vs-directives-page',
  // Standalone components import both components and directives used in their template.
  imports: [StatusCard, InteractiveHighlight],
  templateUrl: './components-vs-directives-page.html',
  styleUrl: './components-vs-directives-page.css',
})
export class ComponentsVsDirectivesPage {}
