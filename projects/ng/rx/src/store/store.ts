import {DestroyRef, inject} from '@angular/core';

import {Store} from '@bitfiber/rx';

/**
 * The `NgStore` class is a foundational component for implementing reactive state management and
 * handling asynchronous data flow in modules or entire applications. It serves as a central hub,
 * organizing and managing store items like emitters, states, and groups, ensuring seamless
 * interaction among them.
 *
 * Stores can also include methods to trigger specific actions, making them a powerful and
 * flexible tool for coordinating complex application logic. Their structured design simplifies
 * the development of scalable, maintainable, and reactive applications, ensuring consistency and
 * clarity in managing state and data flow.
 *
 * By implementing the `StoreHooks` interface, the store provides lifecycle hooks for executing
 * custom logic before and after key events, such as store initialization and completion.
 *
 * The `NgStore` class extends `Store` and serves as an abstract foundation designed to serve as
 * a base for specific store implementations in Angular applications that define concrete
 * collections of store items
 *
 * @abstract
 */
export abstract class NgStore extends Store {
  /**
   * Holds a cleanup function that cancels the registration of automatically completing the store
   * when the associated component or service is destroyed
   * @readonly
   */
  private readonly unregisterOnDestroyFn = inject(DestroyRef)
    .onDestroy(() => this.complete());

  /**
   * Cancels the registration of automatically completing the store
   * when the associated component or service is destroyed
   */
  unregisterOnDestroy(): this {
    this.unregisterOnDestroyFn();
    return this;
  }
}
