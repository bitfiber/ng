import {DestroyRef, inject} from '@angular/core';

import {Store} from '@bitfiber/rx';

/**
 * Extends `Store` and provides functionality for managing store items such as emitters, states,
 * and groups within an Angular context.
 *
 * The `NgStore` class manages the lifecycle of store items, including their initialization and
 * completion. It provides lifecycle hooks that allow custom logic to be executed before and after
 * key events such as store initialization and completion. This class serves as a base for creating
 * specific store implementations in Angular applications
 *
 * @abstract
 */
export abstract class NgStore extends Store {
  /**
   * Holds a cleanup function that cancels the registration of automatically completing the store
   * when the associated component or service is destroyed
   * @readonly
   */
  readonly #unregisterOnDestroy = inject(DestroyRef)
    .onDestroy(() => this.complete());

  /**
   * Cancels the registration of automatically completing the store
   * when the associated component or service is destroyed
   */
  unregisterOnDestroy(): this {
    this.#unregisterOnDestroy();
    return this;
  }
}
