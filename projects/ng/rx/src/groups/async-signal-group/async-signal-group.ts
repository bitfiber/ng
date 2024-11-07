import {AbstractAsyncGroup, AsyncData} from '@bitfiber/rx';

import {signalState} from '../../states/signal-state/signal-state';

/**
 * Creates a new `AsyncSignalGroup` instance that manages the lifecycle of an asynchronous action,
 * including emitters for launching the action, handling its success, dealing with failures,
 * and maintaining the signal state of the asynchronous action.
 *
 * The signal state can be used in Angular's `effect` or `computed` functions and in other places
 * where you would normally use a signal.
 *
 * This function also allows for an optional `onInit` callback, which can be used to perform
 * additional setup or configuration just before the group initialization.
 *
 * The fallback value is used as a default success value in case the asynchronous action fails,
 * ensuring that the success emitter always returns a value
 *
 * @template L - The type representing the data for the launch emitter
 * @template S - The type representing the data for the success emitter
 * @template F - The type representing the error data for the fail emitter
 *
 * @param [onInit] - An optional callback function executed just before the group initialization
 * @param [fallbackValue] - An optional fallback value of type `S` that will be used
 * as the default success value if the asynchronous action fails
 */
export function asyncSignalGroup<L, S, F>(
  onInit?: (group: AsyncSignalGroup<L, S, F>, sameGroup: AsyncSignalGroup<L, S, F>) => void,
  fallbackValue?: S,
): AsyncSignalGroup<L, S, F> {
  const group = new AsyncSignalGroup<L, S, F>(fallbackValue);
  return onInit ? group.onInit(onInit) : group;
}

/**
 * Represents an asynchronous group that manages the lifecycle of an asynchronous action,
 * including emitters for launching the action, handling its success, dealing with failures,
 * and maintaining the signal state of the asynchronous action.
 *
 * The signal state can be used in Angular's `effect` or `computed` functions and in other places
 * where you would normally use a signal.
 *
 * The `AsyncSignalGroup` class extends `AbstractAsyncGroup` and is designed to facilitate
 * the management of asynchronous actions. This structure allows for organized
 * and efficient management of complex asynchronous workflows
 *
 * @template L - The type representing the data for the launch emitter
 * @template S - The type representing the data for the success emitter
 * @template F - The type representing the error data for the fail emitter
 */
export class AsyncSignalGroup<L, S, F> extends AbstractAsyncGroup<L, S, F> {
  /**
   * The signal state that tracks the status of an asynchronous action,
   * including counters for successes and failures, as well as flags indicating whether the action
   * is in progress, has completed successfully, or has failed
   * @readonly
   */
  readonly state = signalState<AsyncData>(this.initialState);

  /**
   * Flag indicating that the group is ready and all group items, such as emitters, states,
   * and groups, have been defined
   */
  private ready = this.markAsReady();
}
