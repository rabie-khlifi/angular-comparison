import { TestBed } from '@angular/core/testing';
import { ClassicTestCounter, SignalTestCounter } from './testing-fundamentals-page';

describe('Lesson 24 counter examples', () => {
  it('renders a modern signal state update', async () => {
    // ARRANGE: TestBed creates the component and its Angular testing environment.
    const fixture = TestBed.createComponent(SignalTestCounter);
    // ACT: set() changes state directly, just as application code may do.
    fixture.componentInstance.count.set(2);
    // WAIT: zoneless rendering is scheduled, so the test waits instead of forcing detection.
    await fixture.whenStable();
    // ASSERT: visible output is the behavior a learner or user actually experiences.
    expect(fixture.nativeElement.textContent).toContain('Signal count: 2');
  });

  it('renders a classic property update caused by a user click', async () => {
    // ARRANGE: create the classic component and wait for its first render.
    const fixture = TestBed.createComponent(ClassicTestCounter);
    await fixture.whenStable();
    // ACT: clicking the DOM tests template binding and the handler together.
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    // WAIT: Angular schedules the view update after the event handler completes.
    await fixture.whenStable();
    // ASSERT: classic non-signal state still renders correctly.
    expect(button.textContent).toContain('Classic count: 1');
  });
});
