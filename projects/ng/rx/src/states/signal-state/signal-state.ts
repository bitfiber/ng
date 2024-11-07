import {signal, Signal, WritableSignal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';

import {filter, Observable, OperatorFunction} from 'rxjs';
import {copy} from '@bitfiber/utils';
import {AbstractState, completeWith, operator} from '@bitfiber/rx';

export type SignalStateType<T> = SignalState<T> & Signal<T>;

/**
 * Creates the signal state that combines the functionality of both the `SignalState` class
 * and the `Signal` interface, initialized with the provided `initialValue`.
 *
 * This state can behave like a 'State' or as an Angular signal. It can be used in Angular's
 * `effect` or `computed` functions and in other places where you would normally use a signal.
 *
 * Optionally, you can provide an `onInit` callback function, which is called just before
 * the initialization process, allowing you to perform setup tasks or configure the state before
 * it starts emitting values
 *
 * @template T - The type of the state value
 *
 * @param initialValue - The initial value of the state
 * @param [onInit] - An optional callback function that is executed just before
 * the initialization of the state, allowing you to perform setup tasks or configure
 * the state before it starts emitting values
 *
 * @returns - A new `SignalState` instance
 */
export function signalState<T>(
  initialValue: T,
  onInit?: (state: SignalStateType<T>) => void,
): SignalStateType<T> {
  const state = new SignalState<T>(initialValue) as SignalStateType<T>;
  return onInit ? state.onInit(onInit) : state;
}

/**
 * Represents a signal state in a reactive store, extending the functionality of `AbstractState`.
 * This class encapsulates the logic for updating, resetting and maintaining a state,
 * reacting to changes, and notifying subscribers whenever the state is updated.
 *
 * This state can behave like a 'State' or as an Angular signal. It can be used in Angular's
 * `effect` or `computed` functions and in other places where you would normally use a signal.
 *
 * It can also be connected to external data sources to synchronize its value with external data,
 * ensuring consistency across different parts of an application
 *
 * @template T - The type of data managed and emitted by the state
 */
export class SignalState<T> extends AbstractState<T> {
  /**
   * An observable that serves as the source for all state streams.
   * It allows subscribers to reactively observe changes or updates to the state, allowing them to
   * respond dynamically as new values are emitted
   */
  readonly $: Observable<T>;

  /**
   * The 'WritableSignal' instance that keeps the current value of the state
   */
  protected value!: WritableSignal<T>;

  /**
   * Creates a new instance that combines the functionality of both the `SignalState` class
   * and the `Signal` interface, allowing you to manage and retrieve the state value easily.
   * The constructor initializes the state with the provided `initialValue`,
   * which serves as the starting point for the state
   *
   * @param initialValue - The initial value of the state
   */
  constructor(initialValue: T) {
    super(initialValue);
    const state = ((): T => state.get()) as SignalStateType<T>;
    this.value = signal<T>(copy(initialValue), {equal: () => false});

    Object.setPrototypeOf(state, new.target.prototype);
    Object.assign(state, this);

    this.$ = (state as any).$ = toObservable(state.value).pipe(
      completeWith(state.subject),
      lazyEmission(state, () => {
        const {hasLazyEmission, hasLazyEmissionOnce} = state;
        state.hasLazyEmissionOnce = false;
        return hasLazyEmission || hasLazyEmissionOnce;
      }),
      state.manager(),
    );

    state.addToActiveGroup();
    return state;
  }

  /**
   * Returns the current value of the state.
   * This method is useful for accessing the state at any point in time,
   * allowing other store items or consumers to retrieve the latest value
   */
  get(): T {
    this.throwIfCompleted('get');
    return this.value();
  }

  /**
   * Updates the state to the provided `value` immediately, but the emission of this
   * new value to subscribers will be performed asynchronously. This means that if multiple
   * synchronous updates are made in quick succession, only the last update will be emitted,
   * optimizing the emission process to prevent unnecessary updates
   *
   * @param value - The new value to set as the current state
   *
   * @returns the instance of the current state, allowing for method chaining
   */
  set(value: T): this {
    this._emit(value);
    return this;
  }

  /**
   * Updates the current state using an updater function that takes the current state value as its
   * argument and returns the new state value. The state is updated immediately, but the emission
   * of this new value to subscribers will occur asynchronously. This means that if multiple
   * synchronous updates are made in quick succession, only the last update will be emitted,
   * optimizing the emission process to prevent unnecessary updates
   *
   * @param updater - A function that takes the current state value as its argument
   * and returns the new state value
   *
   * @returns the instance of the current state, allowing for method chaining
   */
  update(updater: (state: T) => T): this {
    return this.set(updater(this.get()));
  }

  /**
   * Updates the current state value and encapsulates the logic for managing state updates.
   * This method includes an optional `fromSource` flag that indicates whether the update
   * is originating from an external data source.
   *
   * When `fromSource` is `true`, it implies that the value is being set as a result
   * of synchronization with an external data source. This distinction is useful
   * for differentiating between internal updates and those triggered by external sources
   *
   * @param value - The new value to set for the state
   *
   * @param [fromSource=false] - Optional flag indicating whether the update is
   * from an external data source. If `true`, the update is considered to originate from the source
   */
  protected setValue(value: T, fromSource = false): void {
    if (!this.compare(value, this.value())) {
      this.value.set(value);
      if (this.source && !fromSource) {
        this.setValueForSource(value);
      }
    }
  }
}

/**
 * Creates an operator that conditionally emits values lazily based on the provided condition.
 * If the `condition` function returns `true`, the emission will be deferred (lazy emission).
 * Otherwise, the observable emits values immediately
 *
 * @template T - The type of the values emitted by the observable
 *
 * @param state - A signal state that applies lazy emission
 * @param condition - A function that returns `true` to enable lazy emission,
 * or `false` for immediate emission
 */
function lazyEmission<T>(
  state: SignalStateType<T>,
  condition: () => boolean,
): OperatorFunction<T, T> {
  return operator<T, T>((source, subscriber) => {
    const isLazy = condition();
    let startValue: T | null = state();
    return source
      .pipe(filter((_, index) => {
        const isEqual = startValue === state();
        startValue = null;
        return index > 0 || !isEqual || !isLazy;
      }))
      .subscribe(subscriber);
  });
}
