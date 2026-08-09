import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { LifecycleTimeline } from '../lifecycle-timeline';

@Component({
  selector: 'app-classic-lifecycle-card',
  templateUrl: './classic-lifecycle-card.html',
  styleUrl: './classic-lifecycle-card.css',
})
export class ClassicLifecycleCard implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  // Before signal inputs, Angular assigned incoming values to @Input-decorated properties.
  @Input({ required: true }) learnerName!: string;

  // Both children inherit the same timeline service from the lesson page's provider scope.
  private readonly timeline = inject(LifecycleTimeline);

  // A decorator query is populated after Angular creates this component's view.
  @ViewChild('statusText') private statusText?: ElementRef<HTMLParagraphElement>;

  // This ordinary property demonstrates initialization that belongs to this component instance.
  protected initializedAt = 'Waiting for ngOnInit';

  ngOnChanges(changes: SimpleChanges): void {
    // ngOnChanges runs before ngOnInit for the first input value and again for later input changes.
    const nameChange = changes['learnerName'];

    // SimpleChange contains the previous/current values and whether this is the first assignment.
    if (nameChange) {
      this.timeline.record(
        'Classic',
        `Classic ngOnChanges: ${String(nameChange.previousValue)} → ${String(nameChange.currentValue)}; first=${nameChange.firstChange}`,
      );
    }
  }

  ngOnInit(): void {
    // ngOnInit runs once after Angular has assigned all initial input values.
    this.initializedAt = `Initialized for ${this.learnerName}`;
    this.timeline.record('Classic', 'Classic ngOnInit: one-time input-dependent initialization');
  }

  ngAfterViewInit(): void {
    // ViewChild is available here because Angular has finished creating the component view.
    const renderedText = this.statusText?.nativeElement.textContent?.trim() ?? 'not found';
    this.timeline.record('Classic', `Classic ngAfterViewInit: read DOM text "${renderedText}"`);
  }

  ngOnDestroy(): void {
    // This hook is the traditional place to clear timers, subscriptions, and event listeners.
    this.timeline.record('Classic', 'Classic ngOnDestroy: release resources before removal');
  }
}
