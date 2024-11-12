# @bitfiber/ng/rx - Reactive State and Async Workflow Management Library for Angular

[![Release Notes](https://img.shields.io/github/release/bitfiber/ng)](https://github.com/bitfiber/ng/releases)
[![GitHub star chart](https://img.shields.io/github/stars/bitfiber/ng?style=social)](https://star-history.com/#bitfiber/ng)
[![GitHub fork](https://img.shields.io/github/forks/bitfiber/ng?style=social)](https://github.com/bitfiber/ng/fork)

`@bitfiber/ng/rx` is an Angular-specific extension of [@bitfiber/rx](https://github.com/bitfiber/rx) built on top of [RxJS](https://github.com/ReactiveX/rxjs),
designed to manage reactive state, asynchronous workflows, and events in Angular applications.
It provides a structured approach to handling complex data flows using emitters, states, groups,
and stores, allowing seamless integration of various reactive sources like emitters, states,
and observables. Emitters and states can be organized into groups and stores, enabling efficient
management and lifecycle control of related reactive sources.

---

## Key Components

1. **NgStore**  
   Extends the base store for improved integration with Angular’s service lifecycle.


2. **Signal State**  
   Manages reactive data that can be used like Angular signals.


3. **Async Signal Group**  
   Manages asynchronous workflows and stores their state in the signal state.


4. **Route Group**  
   Provides reactive management of route params, query params, and fragments.


5. **Route Filters Group**  
   Manages route-based filters as the signal state, ensuring synchronization with the route.


6. **Form Source**  
   Integrates Angular form controls with states, ensuring seamless synchronization between
   form data and state.

---

## Key Features

1. **Integration with RxJS**  
   Since `@bitfiber/ng/rx` is built on top of RxJS, it integrates smoothly with the RxJS ecosystem.
   Emitters and states can easily interact with observables and subjects, and can also create
   effects using RxJS operators.


2. **Signal Integration**  
   Designed specifically for Angular, `@bitfiber/ng/rx` integrates with Angular's signals.
   Signal states can be used within Angular’s reactive constructs like `effect`, `computed`,
   and other areas where signals are commonly used, ensuring seamless reactivity with the UI.


3. **Route Management**  
   The `Route Group` and `Route Filters Group` provide reactive management of route params
   and filters.


4. **Form Synchronization**  
   The `Form Source` feature synchronizes Angular forms with state, ensuring that form controls
   remain in sync with application state.


5. **Stream Connections**  
   Easily connects multiple emitters, states, and observables to each other.


6. **Readable Code Structure**  
   Produces clear, traceable code, making connections between emitters, states, and
   observables easy to follow.


7. **Automatic Subscription Management**  
   Simplifies handling reactive streams, freeing you from managing manual subscriptions
   and completions.


8. **Synchronization with Data Sources**  
   States can synchronize with data sources like local storage, cookies, and
   other external data sources.


9. **Strict Typing**  
   The library leverages TypeScript to enforce strict typing, ensuring robust type checking
   at compile time. This reduces the likelihood of runtime errors and enhances code reliability.
   TypeScript's powerful type inference also makes it easier to write cleaner, more maintainable code,
   providing developers with strong guarantees about the structure and behavior of their reactive
   components.


10. **Tree Shaking**  
    The modular design of `@bitfiber/ng` enables tree shaking, allowing developers to optimize
    bundle sizes by importing only the required functionalities. This eliminates unused code from
    the final build, leading to smaller, more efficient applications, which is particularly useful
    for performance-sensitive environments.

---

## Installation

```bash
# NPM
npm install @bitfiber/ng

# YARN
yarn add @bitfiber/ng
```

---

## Contributing

We welcome contributions from the community. Before contributing, please take the time to read
our [contributing guide](https://github.com/bitfiber/ng/blob/main/CONTRIBUTING.md) to familiarize yourself with our
contribution process.
This guide can help you understand our expectations and save you time in the long run.

---

## Support

Have questions, encountered problems, or want to request new features?
Feel free to start a [discussion in our community forum](https://github.com/bitfiber/ng/discussions).
Your feedback is valuable to us!

---

## Found an Issue or Bug?

If you've found a bug or issue, please report it using [GitHub Issues](https://github.com/bitfiber/ng/issues).
Your reports help us improve the project for everyone.

---

## Code of Conduct

This project adheres to the [Code of Conduct](https://github.com/bitfiber/ng/blob/main/CODE_OF_CONDUCT.md) to ensure
a welcoming and inclusive community for all participants.
By participating, you are expected to uphold this code.

---

## License

This project is released under the Apache 2.0 License.  
You can find the full text of the license in the [LICENSE](https://github.com/bitfiber/ng/blob/main/LICENSE.txt)
file.  
Copyright © 2023-2024 Oleksandr Zmanovskyi. All rights reserved.

---

## Table of Contents

### Store

* [`NgStore`](#id-ng-store)
* [`signalState`](#id-signal-state-fn)
* [`SignalState`](#id-signal-state)
* [`asyncSignalGroup`](#id-async-signal-group-fn)
* [`AsyncSignalGroup`](#id-async-signal-group)
* [`routeGroup`](#id-route-group-fn)
* [`RouteGroup`](#id-route-group)
* [`RouteGroupSettings`](#id-route-group-settings)
* [`routeFiltersGroup`](#id-route-filters-group-fn)
* [`RouteFiltersGroup`](#id-route-filters-group)
* [`RouteFiltersGroupSettings`](#id-route-filters-group-settings)
* [`formSource`](#id-form-source-fn)
* [`FormSource`](#id-form-source)

---

## Store

---
<a id="id-ng-store"></a>

### `@class NgStore`

Extends `Store (@bitfiber/rx)` and provides functionality for managing store items such as
emitters, states, and groups within an Angular context.

The `NgStore` class manages the lifecycle of store items, including their initialization and
completion. It provides lifecycle hooks `StoreHooks (@bitfiber/rx)` that allow custom logic to be
executed before and after key events such as store initialization and completion. This class serves
as a base for creating specific store implementations in Angular applications

`@abstract`

---

`@method initialize(beforeInit?): this`  
Initializes the store and all of its items, preparing it for use. Optionally, a `beforeInit`
callback function can be provided, which will be executed before the store is initialized  
`@param beforeInit?: (store: this) => void` - An optional callback function that runs before
the store is initialized  
`@returns this` The current instance of the store, allowing for method chaining

---

`@method complete(): void`  
Completes the store and all of its items, signaling that the store has finished
its operations and is now in a completed state. Once the store is completed,
no further changes or updates will be made to it or its items.
This method is called automatically when the associated component or service is destroyed

---

`@method markAsReady(): void`  
Marks the store as ready, indicating that all store items, such as emitters, states, and groups,
have been defined. This method must be called after all store items are defined!

---

`@method unregisterOnDestroy(): this`  
Cancels the registration of automatically completing the store
when the associated component or service is destroyed  
`@returns this` The current instance of the store, allowing for method chaining

**Example:**

```ts
import {computed, inject, Injectable} from '@angular/core';
import {switchMap} from 'rxjs';
import {pluck} from '@bitfiber/utils';
import {emitter, transmit} from '@bitfiber/rx';
import {asyncSignalGroup, routeFiltersGroup, signalState, NgStore} from '@bitfiber/ng/rx';

interface ProductsFilters {
  search: string;
  page: number;
}

interface DictItem {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductsState {
  dict1: DictItem[];
  dict2: DictItem[];
  dict3: DictItem[];
  products: Product[];
}

// Products store service
@Injectable()
class ProductsStore extends NgStore {
  // Provides the start of the first data loading process
  start = emitter<ProductsFilters>();

  // Provides the filters state that is synchronized with the route and the filters form
  routeFilters = routeFiltersGroup<ProductsFilters>({
    initialQueryParams: {search: '', page: 1},
  }, ({filters}) => {
    filters
      // Will not emit data immediately upon subscription
      .useLazyEmission();
  })

  // Provides a group of emitters for managing the loading process of `dict1`
  dict1Req = asyncSignalGroup<ProductsFilters, DictItem[], Error>(dict1Req => {
    dict1Req.launch
      // Receives new data from the `start` emitter
      .receive(this.start)
      // Receives new data from the `filters` emitter
      .receive(this.routeFilters.filters)
      // Performs the effect each time new data is received
      .effect(
        switchMap(filters => dict1Service.get(filters)
          // 'transmit' operator takes either data or an error and transmits it to the `success`
          // or `fail` emitter of the async group, respectively
          .pipe(transmit(dict1Req))),
      );
  }, []);

  // Provides a group of emitters for managing the loading process of `dict2`
  dict2Req = asyncSignalGroup<ProductsFilters, DictItem[], Error>(dict2Req => {
    dict2Req.launch
      // Receives new data from the `start` emitter
      .receive(this.start)
      // Receives new data from the `filters` emitter
      .receive(this.routeFilters.filters)
      // Performs the effect each time new data is received
      .effect(
        switchMap(filters => dict2Service.get(filters)
          // 'transmit' operator takes either data or an error and transmits it to the `success`
          // or `fail` emitter of the async group, respectively
          .pipe(transmit(dict2Req))),
      );
  }, []);

  // Provides a group of emitters for managing the loading process of `dict3`
  dict3Req = asyncSignalGroup<[string[], string[]], DictItem[], Error>(dict3Req => {
    dict3Req.launch
      // Receives new data from the `dict1Req` group and `dict2Req` group
      .zip(this.dict1Req.success, this.dict2Req.success, (dict1, dict2) => {
        return [pluck(dict1, 'id'), pluck(dict2, 'id')];
      })
      // Performs the effect each time new data is received
      .effect(
        switchMap(data => dict3Service.get(data)
          // 'transmit' operator takes either data or an error and transmits it to the `success`
          // or `fail` emitter of the async group, respectively
          .pipe(transmit(dict3Req))),
      );
  }, []);

  // Provides a group of emitters for managing the loading process of `products`
  productsReq = asyncSignalGroup<ProductsFilters, Product[], Error>((productsReq, {launch}) => {
    launch
      // Receives new data from the `dict3Req` group
      .receive(this.dict3Req.success, () => this.routeFilters.filters())
      // Performs the effect each time new data is received
      .effect(
        switchMap(filters => productsService.get(filters)
          // 'transmit' operator takes either data or an error and transmits it to the `success`
          // or `fail` emitter of the async group, respectively
          .pipe(transmit(productsReq))),
      );
  }, []);

  // Updates the `isLoading` signal flag whenever any of the query states change
  isLoading = computed(() =>
    this.dict1Req.state().inProgress
    || this.dict2Req.state().inProgress
    || this.dict3Req.state().inProgress
    || this.productsReq.state().inProgress);

  // Provides the final state of the store data
  data = signalState<ProductsState>(
    // Will emit initial data to all subscribers upon subscription
    {dict1: [], dict2: [], dict3: [], products: []},
    data => data
      // Updates the store data when all success data is received from the success emitters,
      // and continues to update after subsequent changes
      .select(
        this.dict1Req.success,
        this.dict2Req.success,
        this.dict3Req.success,
        this.productsReq.success,
        (dict1, dict2, dict3, products) => {
          return {dict1, dict2, dict3, products};
        },
      ),
  );

  // Provides the store error handling
  error = emitter<Error>(error => error
    // Receives all errors from all async tasks
    .receive(this.dict1Req.fail, this.dict2Req.fail, this.dict3Req.fail, this.productsReq.fail)
    // Performs the tap callback each time new error is received
    .tap(error => {
      // Performs some error handling logic
    }));

  // Marks the store as ready, indicating that all store items, such as emitters, states,
  // and groups, have been defined
  #ready = this.markAsReady();
}

```

```ts
// Component of the products page
@Component({
  selector: 'bf-products',
  standalone: true,
  templateUrl: './products.component.html',
  imports: [
    ReactiveFormsModule,
  ],
  providers: [
    ProductsStore,
  ],
})
export class ProductsComponent {
  readonly store = inject(ProductsStore).initialize();
  readonly form = store.routeFilters.form;
}


```

```angular17html
<!-- products.component.html -->
@if (!store.isLoading()) {
  <div
    class="bf-filters"
    [formGroup]="form"
  >
    <input formControlName="search"/>
    <pagenator formControlName="page"/>
  </div>

  @for (product of store.data().products; track product.id) {
    <div class="bf-product">
      {{product.name}} - {{product.price}}
    </div>
  }
} @else {
  Data is loading...
}
```

---
<a id="id-signal-state-fn"></a>

### `@function signalState<T>`

Creates the signal state that combines the functionality of both the `SignalState` class
and the `Signal` interface, initialized with the provided `initialValue`.

This state can behave like a 'State' or as an Angular signal. It can be used in Angular's
`effect` or `computed` functions and in other places where you would normally use a signal.

Optionally, you can provide an `onInit` callback function, which is called just before
the initialization process, allowing you to perform setup tasks or configure the state before
it starts emitting values

`@template T` - The type of the state value

`@param initialValue: T` - The initial value of the state

`@param onInit?: (state: SignalStateType<T>) => void` - An optional callback function that is
executed just before the initialization of the state, allowing you to perform setup tasks or
configure the state before it starts emitting values

`@returns SignalStateType<T>` a new `State` instance that also acts as the `StateGetter` function
to get the current state value

**Example:**

```ts
import {computed} from '@angular/core';
import {take, filter, switchMap} from 'rxjs';
import {namedGroup} from '@bitfiber/rx';
import {signalState} from '@bitfiber/ng/rx';

// Creates a state that stores and emits the IDs
const currentId = signalState<number>(1, s => s
  // Uses a custom function for comparing values. By default, the 'equals' function is used
  .compareBy((a, b) => a === b)
  // Transmits all emitted data to the 'productReq' emitter
  .transmit(productReq));

// The observable of the state
const currentId$ = currentId.$;

// Creates a state that stores and emits the final ID
const lastId = signalState<number | null>(null, s => s
  // Uses '===' for comparing values. By default, the 'equals' function is used
  .compareBy('strict')
  // Forces the state not to emit a value at the time of subscription
  .useLazyEmission());

// Creates a state that receives transmitted 'currentId' data and performs an effect that calls an API
const productReq = signalState<number>(0, s => s
  // All streams created by this state will filter the data
  .manage(
    filter(id => !!(id % 2)),
  )
  // Performs a tap callback each time the state emits new filtered data
  .tap(id => {
    console.log(id);
  })
  // Performs a effect each time the state emits new filtered data
  .effect(
    switchMap(id => productsService.get(`api/product${id}`)),
  ));

// Creates a state that receives used IDs and logs them through an effect
const log = signalState<string>(0, s => s
  // Runs an effect when data is received from the `currentId` state
  .receive(currentId, id => `A new id ${id} was received`)
  // Runs an effect when data is received from the `lastId` state
  .receive(lastId, id => `the last id ${id} was received`)
  // Performs an effect each time the state emits newly received logged data
  .effect(
    switchMap(log => logService.post(`api/log`, {log})),
  ));

// Creates a state that performs a tap callback each time data is selected
const result1 = signalState<[number, number]>([0, 0], s => s
  // Runs a tap callback when all data is selected from the `currentId` and `lastId` states
  .select(currentId$, lastId, (currentId, lastId) => [currentId, lastId])
  // Performs a tap callback each time the state emits new data
  .tap(range => {
    console.log(range);
  }));

// Creates a state that performs a tap callback each time data is selected
const result2 = signalState<[number, number]>([0, 0], s => s
  // Runs a tap callback when all data is selected from the `currentId` and `lastId` states
  .zip(currentId$, lastId, (currentId, lastId) => [currentId, lastId])
  // Performs a tap callback each time the state emits new data
  .tap(range => {
    console.log(range);
  }));

// Creates a state that records the timestamp of the last received ID
const lastIdTime = signalState<number | null>(null, s => s
  // Waits for the first value from the `lastId` state, then completes the stream
  .wait(lastId, lastId => new Date().getTime()));

// Demonstrates the usage of signal states within Angular's `computed` function
const results = computed(() => result1().concat(result2()));

// Groups all emitters and states for mass initialization and completion
const group = namedGroup({currentId, lastId, productReq, log, result1, result2});

// Initializes the group and all items within the group
group.initialize();

// Subscribes to the observable of the state
currentId$
  .pipe(take(1))
  .subscribe(id => console.log(id));

// Sets the state value and emits the new value to subscribers
currentId.set(2);

// Updates the state value and emits the new value to subscribers
currentId.update(state => state + 1);

// Accesses the 'lastId' state through the group and sets data
group.lastId.set(4);

// Gets the current state value in two ways
const id1 = currentId();
const id2 = currentId.get();

// Completes the group and all items within the group
group.complete();

```

---
<a id="id-signal-state"></a>

### `@class SignalState<T>`

Represents a signal state in a reactive store, extending the functionality of `AbstractState`.
This class encapsulates the logic for updating, resetting and maintaining a state,
reacting to changes, and notifying subscribers whenever the state is updated.

This state can behave like a 'State' or as an Angular signal. It can be used in Angular's
`effect` or `computed` functions and in other places where you would normally use a signal.

It can also be connected to external data sources to synchronize its value with external data,
ensuring consistency across different parts of an application

`@template T` - The type of data managed and emitted by the state

---

`@property $: Observable<T>`
An observable that serves as the source for all state streams.
It allows subscribers to reactively observe changes or updates to the state, allowing them to
respond dynamically as new values are emitted

---

`@method manage(...operators): this`  
Defines management operators for all state streams.
These operators are applied to the streams managed by this state,
allowing you to modify or control their behavior, such as filtering,
mapping, or handling errors, without altering the type of the emitted values

`@param ...operators: OperatorFunction<T, T>[]` - One or more RxJS operators to apply to the state streams

`@returns this` the instance of the current state, allowing for method chaining

```ts
import {delay, filter} from 'rxjs';
import {signalState} from '@bitfiber/ng/rx';

const data = signalState<number>(0, s => s
  // All streams created by this state will delay and filter the data
  .manage(
    filter(id => !!(id % 2)),
    delay(100),
  ));

```

---

`@method get(): T`  
Returns the current value of the state.
This method is useful for accessing the state at any point in time,
allowing other store items or consumers to retrieve the latest value

```ts
import {signalState} from '@bitfiber/ng/rx';

const data = signalState<number>(10);

// Returns the current value
data.get(); // Output: 10

```

---

`@method set(value): this`  
Updates the state to the provided `value` immediately, but the emission of this
new value to subscribers will be performed asynchronously. This means that if multiple
synchronous updates are made in quick succession, only the last update will be emitted,
optimizing the emission process to prevent unnecessary updates

`@param value: T` - The new value to set as the current state

`@returns this` the instance of the current state, allowing for method chaining

```ts
import {signalState} from '@bitfiber/ng/rx';

const data = signalState<number>(0);

// Sets a new state value and emits the updated state to its subscribers
data.set(7);

```

---

`@method update(updater): this`  
Updates the current state using an updater function that takes the current state value as its
argument and returns the new state value. The state is updated immediately, but the emission
of this new value to subscribers will occur asynchronously. This means that if multiple
synchronous updates are made in quick succession, only the last update will be emitted,
optimizing the emission process to prevent unnecessary updates

`@param updater: (state: T) => T` - A function that takes the current state value as its argument
and returns the new state value

`@returns this` the instance of the current state, allowing for method chaining

```ts
import {signalState} from '@bitfiber/ng/rx';

const data = signalState<number>(0);

// Updates the current state and emits the updated state to its subscribers
data.update(state => state + 1);

```

---

`@method reset(): this`  
Resets the state to its original value that was set during initialization.
This is useful for reverting the state back to its starting condition, discarding any changes
that have occurred since the state was first established

`@returns this` the instance of the current state, allowing for method chaining

```ts
import {signalState} from '@bitfiber/ng/rx';

const data = signalState<number>(10);

data.set(20);

// Resets the current state to initial value '10'
data.reset();

```

---

`@method compareBy(comparison): this`  
Sets a custom comparison strategy that will be used to determine if the state has changed.
This comparison can be one of the predefined comparison types (`'equals'` or `'strict'`)
or a custom comparison function

`@param comparison: Comparison` - The comparison method to use for evaluating state changes

`@returns this` the instance of the current state, allowing for method chaining

```ts
import {changeDefaultComparison} from '@bitfiber/rx';
import {signalState} from '@bitfiber/ng/rx';

const data1 = signalState<number>(10, s => s
  // Uses the `equals` function from the package '@bitfiber/utils' for comparing values
  // this comparison is by default
  .compareBy('equals'));

const data2 = signalState<number>(10, s => s
  // Uses '===' for comparing values
  .compareBy('strict'));

const data3 = signalState<number | string>(10, s => s
  // Uses a custom function for comparing values
  .compareBy((a, b) => Number(a) === Number(b)));

// By default, uses the `equals` function for comparing values.
// To set a different comparison type for all states by default, use this function
changeDefaultComparison('strict');

```

---

`@method connect(source): this`  
Connects the state to an external data source `DataSource`, which provides the data
that the state will manage and emit. By connecting to a data source, the state can synchronize
with external data, ensuring it remains consistent with the source. This is useful in scenarios
where the state needs to reflect or react to data from an external provider.

Once connected, the state automatically updates from the data source whenever the source changes,
and conversely, updates the data source whenever the state value is changed. This bidirectional
synchronization ensures that both the state and the data source remain in sync

`@param source: DataSource<T>` - The external data source to connect to the state

`@returns this` the instance of the current state, allowing for method chaining

```ts
import {localStoragePart} from '@bitfiber/rx';
import {signalState} from '@bitfiber/ng/rx';

const theme = signalState<'dark' | 'light'>('dark', s => s
  // Connects the state with the local storage data stored under the key 'theme'.
  // Now, if you change the state, local storage will also be updated.
  // Conversely, if the local storage changes, the state will be updated.
  // Ensures two-way synchronization between the state and the 'theme' data in local storage
  .connect(localStoragePart('theme')));
```

---

`@method useLazyEmission(): this`  
Enables lazy emission for the state, meaning that the state will defer emitting its initial value
to subscribers until an explicit trigger occurs. This can be useful in scenarios where you want
more control over when the state emits its value, rather than emitting immediately

`@returns this` the instance of the current state, allowing for method chaining

```ts
import {signalState} from '@bitfiber/ng/rx';

const data = signalState<number>(0, s => s
  // Forces the state not to emit a value at the time of subscription
  .useLazyEmission());
```

---

`@method useLazyEmissionOnce(): this`  
Enables one-time lazy emission for the next created stream.

Once the `useLazyEmissionOnce` method is called, the state will defer emitting its initial value
until an explicit trigger occurs. This lazy emission behavior will apply only once for the next
stream that is created. After this initial deferred emission, subsequent streams will emit values
immediately as changes occur.

This method can be called multiple times before creating streams, allowing you to control
when the lazy emission behavior is applied.

By default, one-time lazy emission is disabled, meaning that streams will emit their initial
values immediately upon creation unless this behavior is explicitly overridden

`@returns this` the instance of the current state, allowing for method chaining

```ts
import {signalState} from '@bitfiber/ng/rx';

const data = signalState<number>(0, s => s
  // Forces the next stream not to emit a value at the time of subscription
  .useLazyEmissionOnce()
  // Will not emit a value at the time of subscription
  .effect()
  // Will emit a value at the time of subscription
  .transmit());
```

---

`@method select<I extends any[]>(...data): this`  
Combines values from multiple emitters, states, or observables, applies a reducer function to
these values, and emits the resulting value to all subscribers of this state.

The first emission occurs only after all values have been received from the sources,
ensuring that the reducer function operates on a complete set of inputs.
Subsequent emissions occur whenever any of the sources emit a new value,
triggering the reducer function to recompute the result based on the latest values.
Works similarly to the RxJs 'combineLatest' operator

`@param ...data: [...EmitterOrObservableTuple<I>, SpreadFn<I, T>]` - A spread of emitters, states,
or observables, followed by a reducer function. The reducer function takes the latest values from
each source as arguments and returns the value to be emitted

`@returns this` the instance of the current state, allowing for method chaining

```ts
import {of} from 'rxjs';
import {emitter} from '@bitfiber/rx';
import {signalState} from '@bitfiber/ng/rx';

type Result = {launchId: number; data: string; count: number};

const launch = emitter<number>();
const data = signalState<string>(1);
const count$ = of(1);

const result = signalState<Result>({launchId: 0, data: '', count: 0}, s => s
  // Selects data from all reactive sources and emits the result to its subscribers.
  // Works similarly to the RxJs 'combineLatest' operator
  .select(launch, data, count$, (launchId, data, count) => {
    launchId, data, count
  }));
```

---

`@method zip<I extends any[]>(...data): this`  
Combines values from multiple emitters, states, or observables, applies a reducer function to
these values, and emits the resulting value to all subscribers of this state.

The first emission occurs only after all values have been received from the sources,
ensuring that the reducer function operates on a complete set of inputs.
Subsequent emissions occur only when all sources emit new values,
triggering the reducer function to recompute the result based on the latest values.
Works similarly to the RxJs 'zip' operator

`@param ...data: [...EmitterOrObservableTuple<I>, SpreadFn<I, T>]` - A spread of emitters, states,
or observables, followed by a reducer function. The reducer function takes the latest values from
each source as arguments and returns the value to be emitted

`@returns this` the instance of the current state, allowing for method chaining

```ts
import {of} from 'rxjs';
import {emitter} from '@bitfiber/rx';
import {signalState} from '@bitfiber/ng/rx';

type Result = {launchId: number; data: string; count: number};

const launch = emitter<number>();
const data = signalState<string>(1);
const count$ = of(1);

const result = signalState<Result>({launchId: 0, data: '', count: 0}, s => s
  // Selects data from all reactive sources and emits the result to its subscribers.
  // Works similarly to the RxJs 'zip' operator
  .zip(launch, data, count$, (launchId, data, count) => {
    launchId, data, count
  }));
```

---

`wait<I extends any[]>(...data): this`  
Waits for the first values from multiple emitters, states, or observables, applies a reducer
function to these values, emits the resulting value to all subscribers of this state,
and completes the stream

`@param ...data: [...EmitterOrObservableTuple<I>, SpreadFn<I, T>]` - A spread of emitters, states,
or observables, followed by a reducer function. The reducer function takes the first values from
each source as arguments and returns the value to be emitted

`@returns this` the instance of the current emitter, allowing for method chaining

```ts
import {of} from 'rxjs';
import {emitter} from '@bitfiber/rx';
import {signalState} from '@bitfiber/ng/rx';

const launch = emitter<number>();
const data = signalState<string>(1);
const count$ = of(1);

const result = signalState<number>(0, s => s
  // Waits the first values from all reactive sources, emits the reducer function value to
  // the state subscribers, and completes the stream
  .wait(launch, data, count$, (launch, data, count) => count));
```

---

`@method receive(...inputs): this`  
Receives values from one or more emitters, states, or observables
and emits them to all subscribers of this state.

This method allows this state to listen to external sources and relay their
emitted values to its own subscribers, effectively linking multiple data streams together

`@param ...inputs: EmitterOrObservable<T>[]` - One or more emitters, states,
or observables that provide values to be emitted by this state

`@returns` the instance of the current state, allowing for method chaining

```ts
import {of} from 'rxjs';
import {emitter} from '@bitfiber/rx';
import {signalState} from '@bitfiber/ng/rx';

const source1 = emitter<number>();
const source2 = signalState<number>(1);
const source3$ = of(1);

const result = signalState<number>(0, s => s
  // Receives data from each reactive source separately and emits a value to its subscribers
  // immediately, without waiting for other sources to emit
  .receive(source1, source2, source3$));
```

`@method receive<I>(input, reducer): this`  
Receives a value from an emitter, state, or observable, applies a reducer function to convert
this value to the state's type, and emits the result to all subscribers of this state.

This method allows this state to listen to external source and relay the transformed
emitted value to its own subscribers, effectively linking data streams together

`@param input: EmitterOrObservable<I>` - an emitter, state or observable that provide values
to be emitted by this state

`@param reducer: (value: I, state: T) => T` - A function that converts or transforms
the received value from the input type to the type expected by this state.
This function takes the value emitted by the input and this state value as parameters,
and returns the new state value

`@returns` the instance of the current state, allowing for method chaining

```ts
import {emitter} from '@bitfiber/rx';
import {signalState} from '@bitfiber/ng/rx';

const source = signalState<number>(1);

const result = signalState<string>('', s => s
  // Receives data from a reactive source, converts the value, and emits the result to its subscribers
  .receive(source, value => String(value)));
```

---

`@method transmit(...outputs): this`  
Transmits values from the current state to one or more other emitters, states, or subjects.
It enables the propagation of data or events across multiple sources, effectively creating
a network of interconnected reactive sources

`@param ...outputs: (EmitterOrSubject<T> | EmitterOrSubject<void>)[]` - One or more emitters, states,
or subjects that will receive the transmitted values from this state

`@returns` the instance of the current state, allowing for method chaining

```ts
import {Subject} from 'rxjs';
import {emitter} from '@bitfiber/rx';
import {signalState} from '@bitfiber/ng/rx';

const receiver1 = emitter<number>();
const receiver2 = signalState<number>(0);
const receiver3 = new Subject<number>();

const source = signalState<number>(0, s => s
  // Transmits every emitted value to all reactive sources for further processing or handling
  .transmit(receiver1, receiver2, receiver3));
```

`@method transmit<O>(output, reducer): this`  
Transmits values from the current state to another state. By using a reducer function,
the emitted values can be transformed or customized to match the expected format of another state

`@param output: AbstractState<O>` - A state that will receive the transmitted values from this state

`@param reducer: (value: T, state: O) => O` - A function that converts or transforms the emitted value
from this state type to the type expected by another state

`@returns` the instance of the current state, allowing for method chaining

```ts
import {emitter} from '@bitfiber/rx';
import {signalState} from '@bitfiber/ng/rx';

const receiver = signalState<number>(0);

const source = signalState<string>(0, s => s
  // Transmits every emitted value to another state for further processing or handling
  .transmit(receiver, (value, state) => state + Number(value)));
```

`@method transmit<O>(output, reducer): this`  
Transmits values from the current state to another emitter or subject.
By using a reducer function, the emitted values can be transformed or customized to match
the expected format of the target emitter or subject

`@param output: EmitterOrSubject<O>` - An emitter or subject that will receive the transmitted values
from this state

`@param reducer: (value: T) => O` - A function that converts or transforms the emitted value from
the current state's type to the type expected by the receiving emitter or subject

`@returns` the instance of the current state, allowing for method chaining

```ts
import {emitter} from '@bitfiber/rx';
import {signalState} from '@bitfiber/ng/rx';

const receiver = emitter<number>();

const source = signalState<string>(0, s => s
  // Transmits every emitted value to another emitter for further processing or handling
  .transmit(receiver, value => Number(value)));
```

---

`@method effect(...operators): this`  
Creates a new stream with a side effect, similar to the RxJS `pipe` method.

This method allows you to apply a sequence of RxJS operators to the state's stream,
performing actions or side effects whenever the state emits a value. This can be
particularly useful for tasks like logging, debugging, or triggering external operations
in response to emitted values

`@param ...operators: OperatorFunction<any, any>[]` - A sequence of RxJS operators that define
the side effects to be applied to the emitted values

`@returns` the instance of the current state, allowing for method chaining

```ts
import {switchMap, of} from 'rxjs';
import {signalState} from '@bitfiber/ng/rx';

const openDialog = signalState<boolean>(false, s => s
  // Performs a effect each time the emitter emits new value
  .effect(
    switchMap(isOpened => !isOpened ? dialog.open() : of(false)),
  ));
```

---

`@method tap(observer): this`  
Creates a new stream with a side effect, similar to the RxJS `tap` operator.

This method allows you to perform actions or side effects whenever the state emits a value,
without altering the value itself. It is useful for tasks like logging, debugging,
or triggering external operations in response to emitted values

`@param observer: Partial<Observer<T>>` - a partial observer with lifecycle
methods (`next`, `error`, `complete`)

`@returns` the instance of the current state, allowing for method chaining

```ts
import {switchMap} from 'rxjs';
import {signalState} from '@bitfiber/ng/rx';

const log = signalState<number>(0, s => s
  // Performs a tap callback each time the state emits new data
  .tap({
    next: id => console.log(id),
    error: error => console.log(error),
  }));
```

`@method tap(next): this`  
Creates a new stream with a side effect, similar to the RxJS `tap` operator.

This method allows you to perform actions or side effects whenever the state emits a value,
without altering the value itself. It is useful for tasks like logging, debugging,
or triggering external operations in response to emitted values

`@param next: (value: T) => void` - a function that takes the emitted value and performs a side effect

`@returns` the instance of the current state, allowing for method chaining

```ts
import {switchMap} from 'rxjs';
import {signalState} from '@bitfiber/ng/rx';

const log = signalState<number>(0, s => s
  // Performs a tap callback each time the state emits new data
  .tap(id => console.log(id)));
```

---
<a id="id-async-signal-group-fn"></a>

### `@function asyncSignalGroup<L, S, F>`

Creates a new `AsyncSignalGroup` instance that manages the lifecycle of an asynchronous action,
including emitters for launching the action, handling its success, dealing with failures,
and maintaining the signal state of the asynchronous action.

The signal state can be used in Angular's `effect` or `computed` functions and in other places
where you would normally use a signal.

This function also allows for an optional `onInit` callback, which can be used to perform
additional setup or configuration just before the group initialization.

The fallback value is used as a default success value in case the asynchronous action fails,
ensuring that the success emitter always returns a value

`@template L` - The type representing the data for the launch emitter  
`@template S` - The type representing the data for the success emitter  
`@template F` - The type representing the error data for the fail emitter

`@param onInit?: (group: AsyncSignalGroup<L, S, F>, sameGroup: AsyncSignalGroup<L, S, F>) => void` -
An optional callback function executed just before the group initialization

`@param fallbackValue?: S` - An optional fallback value of type `S` that will be used
as the default success value if the asynchronous action fails

`@returns AsyncSignalGroup<L, S, F>`

**Example:**

```ts
import {computed} from '@angular/core';
import {namedGroup} from '@bitfiber/rx';
import {signalState, asyncSignalGroup} from '@bitfiber/ng/rx';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductsState {
  products: Product[];
  isLoading: booleang;
}

// Provides a group of emitters for managing the products loading process
const productsReq = asyncSignalGroup<number, Product[], Error>((group, {launch, fail, finish}) => {
  group
    // Keeps cached data for 120 seconds, with a maximum entry count of 10
    .useCache(120, 10);

  launch
    // Performs an effect each time the launch emits new data
    .effect(
      switchMap(page => productsService.get(`api/products?page=${page}`)
        // 'transmit' operator takes either data or an error and transmits it to the `success`
        // or `fail` emitter of the group, respectively
        .pipe(transmit(group))),
    );

  success
    // Performs a tap callback each time the request succeeds
    .tap(data => console.log(data));

  fail
    // Performs a tap callback each time the request fails
    .tap(error => console.log(error));

  finish
    // Performs a tap callback each time the request either fails or succeeds
    .tap(() => console.log('Request has been finished'));
}, []);

// Provides the final state
const data = signalState<ProductsState>({products: [], isLoading: false}, s => s
  // Receives request success data
  .receive(productsReq.success, (products, state) => ({...state, products}))
  // Receives the request state
  .receive(productsReq.state, ({inProgress}, state) => ({...state, isLoading: inProgress}))
);

// Demonstrates the usage of signal state of the async group within Angular's `computed` function
const isLoading = computed(() => productsReq.state().inProgress);

// Groups all emitters and states for mass initialization and completion
const group = namedGroup({productsReq, data});

// Initializes the group and all items within the group
group.initialize();

// Starts the products loading process
productsReq.launch.emit(1);

// Completes the group and all items within the group
group.complete();

```

---
<a id="id-async-signal-group"></a>

### `@class AsyncSignalGroup<L, S, F>`

Represents an asynchronous group that manages the lifecycle of an asynchronous action,
including emitters for launching the action, handling its success, dealing with failures,
and maintaining the signal state of the asynchronous action.

The signal state can be used in Angular's `effect` or `computed` functions and in other places
where you would normally use a signal.

The `AsyncSignalGroup` class extends `AbstractAsyncGroup` and is designed to facilitate
the management of asynchronous actions. This structure allows for organized
and efficient management of complex asynchronous workflows

`@template L` - The type representing the data for the launch emitter  
`@template S` - The type representing the data for the success emitter  
`@template F` - The type representing the error data for the fail emitter

---

`@property launch: Emitter<L>`  
An emitter that triggers the start of an asynchronous action.
This emitter takes a payload of type `L`, which contains the necessary data
to initiate the action  
`@readonly`

---

`@property success: Emitter<S>`  
An emitter that triggers when an asynchronous action completes successfully.
This emitter takes a payload of type `S`, which contains the result or data associated
with the successful completion of the action  
`@readonly`

---

`@property fail: Emitter<F>`  
An emitter that triggers when an asynchronous action fails.
This emitter takes a payload of type `F`, which contains the error information or data
related to the failure of the action  
`@readonly`

---

`@property finish: Emitter<void>`  
An emitter that triggers when the asynchronous action's entire lifecycle is completed,
whether it ends in success or failure. This emitter does not carry any payload (`void`),
as it simply serves as a notification that the process is fully complete  
`@readonly`

---

`@property state: SignalStateType<AsyncData>`  
The signal state that tracks the status of an asynchronous action,
including counters for successes and failures, as well as flags indicating whether the action
is in progress, has completed successfully, or has failed  
`@readonly`

---

`@method initialize(): this`  
Initiates the group and all its items.

In most cases, this method will be called automatically by a group or store managing
the group, so you generally don't need to call it manually unless you have a specific
reason to do so

`@returns` the instance of the current group, allowing for method chaining

**Example:**

```ts
import {asyncSignalGroup} from '@bitfiber/ng/rx';

// Creates an asynchronous group
const group = asyncSignalGroup<number, string[], Error>();

// Initializes the group and all items within the group
group.initialize();

```

---

`@method complete(): void`  
Completes the group and all its items,
signaling to all item subscribers that no more values will be emitted.

Once the group is completed, Its items will no longer emit any values, and any subsequent
subscriptions will immediately receive an error.

In most cases, this method will be called automatically by a group or store managing
the group, so you generally don't need to call it manually unless you have a specific
reason to do so

**Example:**

```ts
import {asyncSignalGroup} from '@bitfiber/ng/rx';

// Creates an asynchronous group
const group = asyncSignalGroup<number, string[], Error>();

// Completes the group and all items within the group
group.complete();

```

---

`@method useCache(secOrFn, cacheSize): this`  
Enables caching, allowing the results of the asynchronous action
to be stored and reused based on certain conditions. The cache can be configured to expire
after a specified lifetime or to be used conditionally based on a callback function

`@param secOrFn: number | (() => boolean)` - The lifetime of the cache in seconds, or a callback
function that returns a boolean value. If the callback returns `true`, the cache will be used

`@param cacheSize = 10` - The maximum number of entries in the cache. If the cache size
exceeds this limit, the earliest entries will be deleted following a FIFO strategy

`@returns` the instance of the current group, allowing for method chaining

**Example:**

```ts
import {asyncSignalGroup} from '@bitfiber/ng/rx';

// Creates an asynchronous group
const group = asyncSignalGroup<number, string[], Error>(group => {
  group
    // Keeps cached data for 60 seconds, with a maximum entry count of 5
    .useCache(60, 5);
});

```

---
<a id="id-route-group-fn"></a>

### `@function routeGroup<Q extends Index = object, P extends Index = object>`

Creates a new `RouteGroup` instance that facilitates the reactive management of Angular's
route data, including params, query params, and the fragment, within the current route.

Route elements are represented as signal states, making them usable in Angular's
reactive constructs such as `effect` or `computed` functions, and other places where
signals are typically used.

The properties of the generic types `Q` and `P` can be any type because, before being set to
the route, they are converted to strings using `JSON.stringify`. When states receive parameters
from the route, they are converted back to their respective types using `JSON.parse`.

This function also allows for an optional `onInit` callback, which can be used to perform
additional setup or configuration just before the group initialization

`@template Q` - The type representing the query params of the route  
`@template P` - The type representing the params of the route

`@param settings: RouteGroupSettings<Q, P>` - the settings for configuring a `RouteGroup`

`@param onInit?: (group: RouteGroup<Q, P>, sameGroup: RouteGroup<Q, P>) => void` - An optional
callback function executed just before the group initialization

`@returns RouteGroup<Q, P>`

**Example:**

```ts
import {computed} from '@angular/core';
import {emitter} from '@bitfiber/rx';
import {routeGroup} from '@bitfiber/ng/rx';

interface RouteParams {
  id: number;
  type: string;
}

interface RouteQueryParams {
  page: number;
  search: string;
  groupId: number | null;
}

// Provides a group of signal states for managing the route
const route = routeGroup<RouteQueryParams, RouteParams>({
  initialParams: {id: 0, type: 'all'},
  initialQueryParams: {search: '', page: 1, groupId: null},
  segments: params => [params.type, params.id],
  hasFragment: true,
  navigationExtras: {},
}, ({params, queryParams, allParams, fragment}) => {
  params
    // Performs a tap callback each time the route params change
    .tap(data => console.log(data));

  queryParams
    // Performs a tap callback each time the query params change
    .tap(data => console.log(data));

  allParams
    // Will not emit data immediately upon subscription
    .useLazyEmission()
    // Performs a tap callback each time either the route params or query params change
    .tap(data => console.log(data));

  fragment
    // Performs a tap callback each time the route fragment changes
    .tap(fragment => console.log(fragment));
}, []);

// Creates an emitter that receives the route params and performs an effect that calls an API
const productsReq = emitter<RouteQueryParams & RouteParams>(e => e
  // Receives the route params and emits them to its subscribers
  .receive(route.allParams)
  // Performs a effect each time the emitter emits new params
  .effect(
    switchMap(params => productsService.getAll(params)),
  ));

// Demonstrates the usage of signal states of the route group within Angular's `computed` function
const typeClass = computed(() => `bf-${route.params().type}`);

// Initializes the group and all items within the group
route.initialize();

// Updates both the params state and the route params
route.params.set({id: 2, type: 'new'});

// Updates both the query params state and the route query params
route.queryParams.update(state => ({...state, search: 'abc'}));

// Updates both the all params state and the route params and query params
route.allParams.update(state => ({...state, type: 'old', search: 'abc'}));

// Updates both the fragment state and the route fragment
route.fragment.set('someFragment');

// Updates all states, as well as the route params, query params and fragment
route.changeUrl({id: 2, type: 'new', search: 'abc'}, 'someFragment');

// Resets all states, as well as the route params, query params and fragment to their intial values
route.resetUrl();

// Completes the group and all items within the group
route.complete();

```

---
<a id="id-route-group"></a>

### `@class RouteGroup<Q extends Index = object, P extends Index = object>`

Represents a route group that facilitates the reactive management of Angular's route data,
including params, query params, and the fragment, within the current route.

Route elements are represented as signal states, making them usable in Angular's reactive
constructs such as `effect` or `computed` functions, and other places where signals are
typically used.

The properties of the generic types `Q` and `P` can be any type because, before being set to
the route, they are converted to strings using `JSON.stringify`. When states receive parameters
from the route, they are converted back to their respective types using `JSON.parse`.

This class extends `AbstractGroup` to provide a structured way to organize and manage
route-related states within the Rx store

`@template Q` - The type representing the query params of the route  
`@template P` - The type representing the params of the route

---

`@property params: SignalStateType<P>`  
A signal state that represents the route params  
`@readonly`

---

`@property queryParams: SignalStateType<Q>`  
A signal state that represents the query params  
`@readonly`

---

`@property allParams: SignalStateType<Q & P>`  
A signal state that includes the route params and query params  
`@readonly`

---

`@property fragment: SignalStateType<string | null>`  
A signal state that represents the route fragment  
`@readonly`

---

`@method initialize(): this`  
Initiates the group and all its items.

In most cases, this method will be called automatically by a group or store managing
the group, so you generally don't need to call it manually unless you have a specific
reason to do so

`@returns` the instance of the current group, allowing for method chaining

**Example:**

```ts
import {routeGroup} from '@bitfiber/ng/rx';

// Creates a route group
const route = routeGroup<RouteParams>({
  initialParams: {id: 0, type: 'all'},
});

// Initializes the group and all items within the group
route.initialize();

```

---

`@method complete(): void`  
Completes the group and all its items,
signaling to all item subscribers that no more values will be emitted.

Once the group is completed, Its items will no longer emit any values, and any subsequent
subscriptions will immediately receive an error.

In most cases, this method will be called automatically by a group or store managing
the group, so you generally don't need to call it manually unless you have a specific
reason to do so

**Example:**

```ts
import {routeGroup} from '@bitfiber/ng/rx';

// Creates a route group
const route = routeGroup<RouteParams>({
  initialParams: {id: 0, type: 'all'},
});

// Completes the group and all items within the group
route.complete();

```

---

`@method changeUrl(data, fragment): void`  
Updates the current URL by modifying the query params, route params, or fragment
`@param data: Partial<Q | P>` - A partial object containing the query or route params to update
`@param fragment?: string` - An optional string to update the URL fragment

**Example:**

```ts
import {routeGroup} from '@bitfiber/ng/rx';

// Creates a route group
const route = routeGroup<RouteParams>({
  initialParams: {id: 0, type: 'all'},
});

// Initializes the group and all items within the group
route.initialize();

// Updates all states, as well as the route params, query params and fragment
route.changeUrl({id: 2, type: 'new'}, 'someFragment');

```

---

`@method resetUrl(): void`  
Resets the current URL to the initial values of the route params, query params, and fragment

**Example:**

```ts
import {routeGroup} from '@bitfiber/ng/rx';

// Creates a route group
const route = routeGroup<RouteParams>({
  initialParams: {id: 0, type: 'all'},
});

// Initializes the group and all items within the group
route.initialize();

// Resets all states, as well as the route params, query params and fragment to their intial values
route.resetUrl();

```

---

`@method hasParams(): void`  
Determines whether the current route has defined params

**Example:**

```ts
import {routeGroup} from '@bitfiber/ng/rx';

// Creates a route group
const route = routeGroup<RouteParams>({
  initialParams: {id: 0, type: 'all'},
});

if (route.hasParams()) {
  // Some logic
}

```

---

`@method hasQueryParams(): void`  
Determines whether the current route has defined query params

**Example:**

```ts
import {routeGroup} from '@bitfiber/ng/rx';

// Creates a route group
const route = routeGroup<RouteParams>({
  initialParams: {id: 0, type: 'all'},
});

if (route.hasQueryParams()) {
  // Some logic
}

```

---

`@method hasAnyParams(): void`  
Determines whether the current route has defined params or query params

**Example:**

```ts
import {routeGroup} from '@bitfiber/ng/rx';

// Creates a route group
const route = routeGroup<RouteParams>({
  initialParams: {id: 0, type: 'all'},
});

if (route.hasAnyParams()) {
  // Some logic
}

```

---

`@method hasFragment(): void`  
Determines whether the current route includes a fragment

**Example:**

```ts
import {routeGroup} from '@bitfiber/ng/rx';

// Creates a route group
const route = routeGroup<RouteParams>({
  initialParams: {id: 0, type: 'all'},
});

if (route.hasFragment()) {
  // Some logic
}

```

---
<a id="id-route-group-settings"></a>

### `@interface RouteGroupSettings<Q extends Index = object, P extends Index = object>`

Defines the settings for configuring a `RouteGroup`  
`@template Q` - The type representing the query params of the route  
`@template P` - The type representing the params of the route

---

`@property initialParams?: P`  
Initial values for the route params

---

`@property initialQueryParams?: Q`  
Initial values for the query params

---

`@property excludedParams?: (keyof (Q & P))[]`  
A list of param or query param keys that should be excluded from the route

---

`@property segments?: (params: Record<keyof P, string>) => string[]`  
A function that generates an array of route segments from the provided params  
`@param params` - A record of param keys and their corresponding values  
`@returns` an array of route segments

---

`@property hasFragment?: boolean`  
A boolean flag indicating whether the route has a fragment

---

`@property navigationExtras?: NavigationExtras`  
Additional options for configuring the Angular navigation behavior.
These extras correspond to Angular's `NavigationExtras` interface

---
<a id="id-route-filters-group-fn"></a>

### `@function routeFiltersGroup<Q extends Index = object, P extends Index = object>`

Creates a new `RouteFiltersGroup` instance that facilitates the reactive management of Angular's
form-based filters and links these filters with the route.

The `RouteFiltersGroup` class allows for managing form filters as reactive state that
is synchronized with the current route's query and route params. The filters are
represented as signal state, making it usable in Angular's reactive constructs such as
`effect` or `computed` functions, and other places where signals are typically used.

The properties of the generic types `Q` and `P` can be any type because, before being set to
the route, they are converted to strings using `JSON.stringify`. When filters receive parameters
from the route, they are converted back to their respective types using `JSON.parse`.

This function also allows for an optional `onInit` callback, which can be used to perform
additional setup or configuration just before the group initialization

`@template Q` - The type representing the query params of the route  
`@template P` - The type representing the params of the route

`@param settings: RouteFiltersGroupSettings<Q, P>` - the settings for configuring a
`RouteFiltersGroup`

`@param onInit?: (group: RouteFiltersGroup<Q, P>, sameGroup: RouteFiltersGroup<Q, P>) => void` -
An optional callback function executed just before the group initialization

`@returns RouteFiltersGroup<Q, P>`

**Example:**

```ts
import {computed, inject, Injectable} from '@angular/core';
import {switchMap} from 'rxjs';
import {transmit} from '@bitfiber/rx';
import {asyncSignalGroup, routeFiltersGroup, signalState, NgStore} from '@bitfiber/ng/rx';

interface ProductsFilters {
  search: string;
  page: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductsState {
  products: Product[];
}

// Products store service with route filters
@Injectable()
class ProductsStore extends NgStore {

  // Provides the filters state that is synchronized with the route and the filters form
  routeFilters = routeFiltersGroup<ProductsFilters>({
    initialQueryParams: {search: '', page: 1},
  });

  // Provides a group of emitters for managing the loading process of `products`
  productsReq = asyncSignalGroup<ProductsFilters, Product[], Error>((productsReq, {launch}) => {
    launch
      // Receives data from the route filters and emits it to its subscribers
      .receive(this.routeFilters.filters)
      // Performs the effect each time new data is received
      .effect(
        switchMap(filters => productsService.get(filters)
          // 'transmit' operator takes either data or an error and transmits it to the `success`
          // or `fail` emitter of the async group, respectively
          .pipe(transmit(productsReq))),
      );
  }, []);

  // Updates the `isLoading` signal flag whenever the products request state changes
  isLoading = computed(() => this.productsReq.state().inProgress);

  // Provides the final state of the store data
  data = signalState<ProductsState>({products: []}, data => data
    // Updates the store data when the products request succeeds
    .receive(this.productsReq.success, products => ({products})),
  );
}

```

```ts
// Component of the products page
@Component({
  selector: 'bf-products',
  standalone: true,
  templateUrl: './products.component.html',
  imports: [
    ReactiveFormsModule,
  ],
  providers: [
    ProductsStore,
  ],
})
export class ProductsComponent {
  readonly store = inject(ProductsStore).initialize();
  readonly form = store.routeFilters.form;
}


```

```angular17html
<!-- products.component.html -->
@if (store.isLoading()) {
  <div
    class="bf-filters"
    [formGroup]="form"
  >
    <input formControlName="search"/>
    <pagenator formControlName="page"/>
  </div>

  @for (product of store.data().products) {
    <div class="bf-product">
      {{product.name}}
    </div>
  }
} @else {
  Data is loading...
}
```

---
<a id="id-route-filters-group"></a>

### `@class RouteFiltersGroup<Q extends Index = object, P extends Index = object>`

Represents a route filters group that facilitates the reactive management of Angular's
form-based filters and links these filters with the route.

The `RouteFiltersGroup` class allows for managing form filters as reactive state that
is synchronized with the current route's query and route params. The filters are represented
as signal state, making it usable in Angular's reactive constructs such as `effect` or
`computed` functions, and other places where signals are typically used.

The properties of the generic types `Q` and `P` can be any type because, before being set to
the route, they are converted to strings using `JSON.stringify`. When filters receive parameters
from the route, they are converted back to their respective types using `JSON.parse`.

This class extends `AbstractGroup` to provide a structured way to organize and manage
the filters state within the Rx store

`@template Q` - The type representing the query params of the route  
`@template P` - The type representing the params of the route

---

`@property filters: SignalStateType<Q & P>`  
A signal state that represents the combined filter values from both the query and route params,
and is synchronized with the form controls. This signal state can be used in Angular's
reactive constructs such as `effect` or `computed` functions   
`@readonly`

---

`@property route: RouteGroup<Q, P>`  
An instance of `RouteGroup` that manages the route's query and route params  
`@readonly`

---

`@property form: FormGroup<FilterControls<Q & P>>`  
A `FormGroup` instance that manages the filter controls, where each control corresponds to
either a query param or a route param.
This form group is responsible for handling both user input and programmatic updates.
Changes made in the form controls are automatically reflected in the filters state and
synchronized with the route params, ensuring consistency between the form, filters state,
and the route  
`@readonly`

---

`@method initialize(): this`  
Initiates the group and all its items.

In most cases, this method will be called automatically by a group or store managing
the group, so you generally don't need to call it manually unless you have a specific
reason to do so

`@returns` the instance of the current group, allowing for method chaining

**Example:**

```ts
import {routeFiltersGroup} from '@bitfiber/ng/rx';

// Creates a route filters group
const routeFilters = routeFiltersGroup<RouteParams>({
  initialParams: {id: 0, type: 'all'},
});

// Initializes the group and all items within the group
routeFilters.initialize();

```

---

`@method complete(): void`  
Completes the group and all its items,
signaling to all item subscribers that no more values will be emitted.

Once the group is completed, Its items will no longer emit any values, and any subsequent
subscriptions will immediately receive an error.

In most cases, this method will be called automatically by a group or store managing
the group, so you generally don't need to call it manually unless you have a specific
reason to do so

**Example:**

```ts
import {routeFiltersGroup} from '@bitfiber/ng/rx';

// Creates a route filters group
const routeFilters = routeFiltersGroup<RouteParams>({
  initialParams: {id: 0, type: 'all'},
});

// Completes the group and all items within the group
routeFilters.complete();

```

---
<a id="id-route-filters-group-settings"></a>

### `@interface RouteFiltersGroupSettings<Q extends Index = object, P extends Index = object>`

Defines the settings for configuring a `RouteFiltersGroup`, which manages the synchronization
between form-based filters and the current route's query and route parameters.

This interface extends `RouteGroupSettings` and provides additional configuration options
specific to filter controls, allowing customization of how the form controls interact with
the route parameters and how their values are processed

`@template Q` - The type representing the query params of the route  
`@template P` - The type representing the params of the route

---

`@property controlsFlow?: (form) => Observable<Partial<Q & P>>`  
A function that redefines the base flow of control values and returns an observable
that emits the form values as a partial object containing both query and route params  
`@param form: FormGroup<FilterControls<Q & P>>` - The form group containing the filter controls

---

`@property controlOperators?: ControlOperators<Partial<Q & P>>`  
A set of RxJS operator functions for the base control flow that define how control values
are processed before being applied to the filters state, query and route params

---

`@property onControlChange?: (form, controlName, data) => void`  
A callback function that is triggered whenever a control's value changes in the base
control flow. This function provides access to the form, the name of the control that changed,
and the new control data. It can be used to apply additional logic or side effects
when form controls are updated  
`@param form: FormGroup<FilterControls<Q & P>>` - The form group containing the filter controls  
`@param controlName: keyof (Q & P)` - The name of the control that triggered the change  
`@param data: Partial<Q & P>` - The new control data

---

`@property withoutRoute?: boolean`  
A boolean flag that indicates whether the filter changes should be synchronized with the route.
When set to `true`, filter changes are applied without updating the route params.
Defaults to `false`, meaning changes are reflected in the route by default

---
<a id="id-form-source-fn"></a>

### `@function formSource<T>`

Creates an instance of `FormSource`, which provides streamlined access to the data
in an Angular form. It can handle any instance of `AbstractControl`, such as `FormControl`,
`FormGroup`, or `FormArray`

`@template T` - The type of data managed by the Angular form

`@param form: AbstractControl<T>` - An instance of `AbstractControl` that can be a `FormControl`,
`FormGroup`, or `FormArray`

`@returns FormSource<T>`

**Example:**

```ts
import {FormControl, FormGroup} from '@angular/forms';
import {state, emitter} from '@bitfiber/rx';
import {formSource} from '@bitfiber/ng/rx';

interface FormValue {
  itemId: number;
  search: string;
}

// Creates a form group
const formGroup = new FormGroup({
  itemId: new FormControl(1, {nonNullable: true}),
  search: new FormControl('', {nonNullable: true}),
});

// Creates a state and connects it with the form group through the form source
const formState = state<FormValue>({itemId: 1, search: ''}, s => s
  // Connects the state with the form group.
  // Now, if you change the state, the form group will also be updated.
  // Conversely, if the form group changes, the state will be updated.
  // Ensures two-way synchronization between the state and the form group
  .connect(formSource<FormValue>(formGroup)));

// Creates an emitter that receives the form value and performs an effect that calls an API
const productsReq = emitter<FormValue>(e => e
  // Receives the form value and emits it to its subscribers
  .receive(formState)
  // Performs a effect each time the emitter emits new value
  .effect(
    switchMap(data => productsService.getAll(data)),
  ));


```

---
<a id="id-form-source"></a>

### `@class FormSource<T>`

Implements the `DataSource` interface, providing a way to interact with the data
stored in an Angular form. This class offers functionality to retrieve, set, observe,
and remove data from any `AbstractControl`, including `FormControl`, `FormGroup`, and `FormArray`

`@template T` - The type of data managed by the Angular form

---

`@property $: Observable<T>`  
Allows subscribers to reactively observe changes or updates to the data in an Angular form  
`@readonly`

---

`@method get(): T`  
Retrieves the current value of the form control, form group, or form array  
`@returns T` the form data

**Example:**

```ts
import {FormControl, FormGroup} from '@angular/forms';
import {formSource} from '@bitfiber/ng/rx';

interface FormValue {
  itemId: number;
  search: string;
}

// Creates a form group
const formGroup = new FormGroup({
  itemId: new FormControl(1, {nonNullable: true}),
  search: new FormControl('', {nonNullable: true}),
});

// Creates a form source
const source = formSource<FormValue>(formGroup);

// Returns the form value
const value = source.get();

```

---

`@method set(value: T): void`  
Sets a new value for the form control, form group, or form array  
`@param value: T` - A new form value

**Example:**

```ts
import {FormControl, FormGroup} from '@angular/forms';
import {formSource} from '@bitfiber/ng/rx';

interface FormValue {
  itemId: number;
  search: string;
}

// Creates a form group
const formGroup = new FormGroup({
  itemId: new FormControl(1, {nonNullable: true}),
  search: new FormControl('', {nonNullable: true}),
});

// Creates a form source
const source = formSource<FormValue>(formGroup);

// Sets a new form value
const value = source.set({itemId: 2, search: 'abc'});

```

---

`@method remove(): void`  
Resets the current value of the form control, form group, or form array back
to its initial state

**Example:**

```ts
import {FormControl, FormGroup} from '@angular/forms';
import {formSource} from '@bitfiber/ng/rx';

interface FormValue {
  itemId: number;
  search: string;
}

// Creates a form group
const formGroup = new FormGroup({
  itemId: new FormControl(1, {nonNullable: true}),
  search: new FormControl('', {nonNullable: true}),
});

// Creates a form source
const source = formSource<FormValue>(formGroup);

// Resets the current form value to its initial state
const value = source.remove();

```

---
