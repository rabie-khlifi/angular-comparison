import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injectable, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

interface TodoItem {
  id: number;
  label: string;
  done: boolean;
}

@Injectable()
export class ClassicTodoStore {
  // BehaviorSubject is the classic RxJS store primitive: it has a current value and emits updates.
  private readonly itemsSubject = new BehaviorSubject<TodoItem[]>([]);
  // Expose an Observable so consumers cannot call next() and bypass store methods.
  readonly items$ = this.itemsSubject.asObservable();
  // Derived state is another Observable pipeline in the pre-signals approach.
  readonly remaining$ = this.items$.pipe(map((items) => items.filter((item) => !item.done).length));

  add(label: string): void {
    const current = this.itemsSubject.value;
    this.itemsSubject.next([...current, { id: Date.now(), label, done: false }]);
  }

  toggle(id: number): void {
    this.itemsSubject.next(
      this.itemsSubject.value.map((item) => item.id === id ? { ...item, done: !item.done } : item),
    );
  }
}

@Injectable()
export class SignalTodoStore {
  // Writable state stays private; callers receive only a readonly signal.
  private readonly _items = signal<TodoItem[]>([]);
  readonly items = this._items.asReadonly();
  // computed is lazy and memoized derived state—no manual subscription is required.
  readonly remaining = computed(() => this.items().filter((item) => !item.done).length);

  add(label: string): void {
    this._items.update((items) => [...items, { id: Date.now(), label, done: false }]);
  }

  toggle(id: number): void {
    this._items.update((items) =>
      items.map((item) => item.id === id ? { ...item, done: !item.done } : item),
    );
  }
}

@Component({
  selector: 'app-state-management-page',
  imports: [AsyncPipe],
  // Component providers isolate this playground; root providers would share state application-wide.
  providers: [ClassicTodoStore, SignalTodoStore],
  templateUrl: './state-management-page.html',
  styleUrl: './state-management-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateManagementPage {
  protected readonly classicStore = inject(ClassicTodoStore);
  protected readonly signalStore = inject(SignalTodoStore);

  protected addClassic(input: HTMLInputElement): void {
    if (input.value.trim()) this.classicStore.add(input.value.trim());
    input.value = '';
  }

  protected addModern(input: HTMLInputElement): void {
    if (input.value.trim()) this.signalStore.add(input.value.trim());
    input.value = '';
  }
}
