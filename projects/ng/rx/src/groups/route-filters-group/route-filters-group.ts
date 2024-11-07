import {AbstractControl, FormControl, FormGroup} from '@angular/forms';

import {map, merge, OperatorFunction, Observable, buffer, tap, Subject} from 'rxjs';
import {Index, copy, mapObjToArr, mapObj, extend} from '@bitfiber/utils';
import {AbstractGroup} from '@bitfiber/rx';

import {signalState, SignalStateType} from '../../states/signal-state/signal-state';
import {routeGroup, RouteGroup, RouteGroupSettings} from '../route-group/route-group';

/**
 * Represents a set of form control objects for managing filters, where each key corresponds to
 * a specific filter and its associated control
 */
export type FilterControls<T extends Index> = {
  [K in keyof T]: AbstractControl<T[K], T[K]>;
};

/**
 * Represents a set of RxJS operator functions for managing controls, where each key corresponds to
 * a specific control and its associated array of RxJS operator functions
 */
export type ControlOperators<T extends Index> = {
  [K in keyof T]: OperatorFunction<T[K], T[K]>[];
};

/**
 * Defines the settings for configuring a `RouteFiltersGroup`, which manages the synchronization
 * between form-based filters and the current route's query and route parameters.
 *
 * This interface extends `RouteGroupSettings` and provides additional configuration options
 * specific to filter controls, allowing customization of how the form controls interact with
 * the route parameters and how their values are processed
 *
 * @template Q - The type representing the query params of the route
 * @template P - The type representing the route params of the route
 */
export interface RouteFiltersGroupSettings<
  Q extends Index = object, P extends Index = object,
> extends RouteGroupSettings<Q, P> {
  /**
   * A function that redefines the base flow of control values and returns an observable
   * that emits the form values as a partial object containing both query and route params
   * @param form - The form group containing the filter controls
   */
  controlsFlow?: (form: FormGroup<FilterControls<Q & P>>) => Observable<Partial<Q & P>>;

  /**
   * A set of RxJS operator functions for the base control flow that define how control values
   * are processed before being applied to the filters state, query and route params
   */
  controlOperators?: ControlOperators<Partial<Q & P>>;

  /**
   * A callback function that is triggered whenever a control's value changes in the base
   * control flow. This function provides access to the form, the name of the control that changed,
   * and the new control data. It can be used to apply additional logic or side effects
   * when form controls are updated
   *
   * @param form - The form group containing the filter controls
   * @param controlName - The name of the control that triggered the change
   * @param data - The new control data
   */
  onControlChange?: (
    form: FormGroup<FilterControls<Q & P>>, controlName: keyof (Q & P), data: Partial<Q & P>,
  ) => void;

  /**
   * A boolean flag that indicates whether the filter changes should be synchronized with the route.
   * When set to `true`, filter changes are applied without updating the route params.
   * Defaults to `false`, meaning changes are reflected in the route by default
   */
  withoutRoute?: boolean;
}

/**
 * Creates a new `RouteFiltersGroup` instance that facilitates the reactive management of Angular's
 * form-based filters and links these filters with the route.
 *
 * The `RouteFiltersGroup` class allows for managing form filters as reactive state that
 * is synchronized with the current route's query and route params. The filters are
 * represented as signal state, making it usable in Angular's reactive constructs such as
 * `effect` or `computed` functions, and other places where signals are typically used.
 *
 * The properties of the generic types `Q` and `P` can be any type because, before being set to
 * the route, they are converted to strings using `JSON.stringify`. When filters receive parameters
 * from the route, they are converted back to their respective types using `JSON.parse`.
 *
 * This function also allows for an optional `onInit` callback, which can be used to perform
 * additional setup or configuration just before the group initialization
 *
 * @template Q - The type representing the query params of the route
 * @template P - The type representing the params of the route
 *
 * @param settings - the settings for configuring a `RouteFiltersGroup`
 *
 * @param [onInit] - An optional callback function executed just before the group initialization
 */
export function routeFiltersGroup<Q extends Index = object, P extends Index = object>(
  settings: RouteFiltersGroupSettings<Q, P>,
  onInit?: (group: RouteFiltersGroup<Q, P>, sameGroup: RouteFiltersGroup<Q, P>) => void,
): RouteFiltersGroup<Q, P> {
  const group = new RouteFiltersGroup<Q, P>(settings);
  return onInit ? group.onInit(onInit) : group;
}

/**
 * Represents a route filters group that facilitates the reactive management of Angular's
 * form-based filters and links these filters with the route.
 *
 * The `RouteFiltersGroup` class allows for managing form filters as reactive state that
 * is synchronized with the current route's query and route params. The filters are represented
 * as signal state, making it usable in Angular's reactive constructs such as `effect` or
 * `computed` functions, and other places where signals are typically used.
 *
 * The properties of the generic types `Q` and `P` can be any type because, before being set to
 * the route, they are converted to strings using `JSON.stringify`. When filters receive parameters
 * from the route, they are converted back to their respective types using `JSON.parse`.
 *
 * This class extends `AbstractGroup` to provide a structured way to organize and manage
 * the filters state within the Rx store
 *
 * @template Q - The type representing the query params of the route
 * @template P - The type representing the params of the route
 */
export class RouteFiltersGroup<
  Q extends Index = object, P extends Index = object,
> extends AbstractGroup {
  /**
   * A signal state that represents the combined filter values from both the query and route params,
   * and is synchronized with the form controls. This signal state can be used in Angular's
   * reactive constructs such as `effect` or `computed` functions
   * @readonly
   */
  readonly filters: SignalStateType<Q & P>;

  /**
   * An instance of `RouteGroup` that manages the route's query and route params
   * @readonly
   */
  readonly route: RouteGroup<Q, P>;

  /**
   * A `FormGroup` instance that manages the filter controls, where each control corresponds to
   * either a query param or a route param.
   *
   * This form group is responsible for handling both user input and programmatic updates.
   * Changes made in the form controls are automatically reflected in the filters state and
   * synchronized with the route params, ensuring consistency between the form, filters state,
   * and the route
   * @readonly
   */
  readonly form: FormGroup<FilterControls<Q & P>>;

  /**
   * A property that holds the initial value of the filters state
   * @readonly
   */
  readonly #initialValue: Q & P;

  /**
   * An observable that emits the flow of control values from the form controls
   * @readonly
   */
  readonly #controlsFlow: Observable<Partial<Q & P>>;

  /**
   * Holds the most recent data of the form controls
   */
  #lastFormData = {} as Q & P;

  /**
   * Holds the most recent data of the route
   */
  #lastRouteData = {} as Q & P;

  /**
   * Creates a new `RouteFiltersGroup` instance that facilitates the reactive management of
   * Angular's form-based filters and links these filters with the route
   * @param settings - the settings for configuring a `RouteFiltersGroup`
   */
  constructor(settings: RouteFiltersGroupSettings<Q, P>) {
    super();
    const {initialParams, initialQueryParams, withoutRoute} = settings;
    const routeSettings = withoutRoute
      ? {...settings, initialParams: undefined, initialQueryParams: undefined}
      : settings;

    this.#initialValue = {
      ...(initialParams ? copy(initialParams) : {}),
      ...(initialQueryParams ? copy(initialQueryParams) : {}),
    } as Q & P;

    this.route = routeGroup<Q, P>(routeSettings);
    this.filters = this.#createFiltersState();
    this.markAsReady();

    this.form = this.#createForm();
    this.#controlsFlow = this.#getControlsFlow(settings);
  }

  /**
   * Executes inner group actions that were deferred until the initialization of the group.
   * This method is called just before the group is fully initialized
   */
  protected override executeInnerDeferredActions(): void {
    if (this.route.hasAnyParams()) {
      this.route.allParams
        .useLazyEmissionOnce()
        .transmit(this.filters, (data, state) => {
          this.#lastRouteData = {...state, ...data};
          return this.#lastRouteData;
        });
    }

    this.filters
      .receive(this.#controlsFlow, (data, state) => {
        this.#lastFormData = {...state, ...data};
        return this.#lastFormData;
      })
      .useLazyEmissionOnce()
      .tap(filters => {
        if (filters !== this.#lastFormData) {
          this.#lastFormData = filters;
          this.form.patchValue(filters, {emitEvent: false});
        }

        if (this.route.hasAnyParams() && filters !== this.#lastRouteData) {
          this.#lastRouteData = filters;
          this.route.changeUrl(filters);
        }
      });
  }

  /**
   * Retrieves the initial route data, combining both the query and route params
   * with the initial filters value
   */
  #getInitialRouteData(): Q & P {
    return {...this.#initialValue, ...this.route.allParams()};
  }

  /**
   * Creates a signal state that represents the filters state
   */
  #createFiltersState(): SignalStateType<Q & P> {
    this.#lastRouteData = this.#getInitialRouteData();
    return signalState<Q & P>(this.#initialValue)
      .set(this.#lastRouteData);
  }

  /**
   * Creates a `FormGroup` instance that contains form controls.
   * This form synchronizes with the filters state and allows both user input and
   * programmatic changes to be reflected in the filters state and the route params
   */
  #createForm(): FormGroup<FilterControls<Q & P>> {
    this.#lastFormData = this.#getInitialRouteData();

    const controls = mapObj(this.#lastFormData, value => {
      return new FormControl(value);
    }) as any as FilterControls<Q & P>;

    return new FormGroup(controls);
  }

  /**
   * Retrieves an observable that defines the flow of control values for the form,
   * based on the provided settings
   * @param settings - The settings that configure the control flow for the form
   */
  #getControlsFlow(settings: RouteFiltersGroupSettings<Q, P>): Observable<Partial<Q & P>> {
    const {controlsFlow} = settings;
    const controlOperators = settings.controlOperators || {} as ControlOperators<Q & P>;
    const onControlChange = settings.onControlChange || (() => undefined);
    const flusher = new Subject<void>();
    let timeoutId: any = null;

    return controlsFlow
      ? controlsFlow(this.form)
      : merge<Partial<Q & P>[]>(
        ...mapObjToArr(this.form.controls, (control, key) => control.valueChanges.pipe(
          ...(controlOperators[key as keyof (Q & P)] || []),
          map(value => ({[key]: value}) as Partial<Q & P>),
          tap((data: Partial<Q & P>) => onControlChange(this.form, key as keyof (Q & P), data)),
        )),
      )
        .pipe(
          tap(() => {
            if (!timeoutId) {
              timeoutId = setTimeout(() => {
                timeoutId = null;
                flusher.next();
              }, 50);
            }
          }),
          buffer(flusher),
          map(bufferData => extend({}, ...bufferData)),
        );
  }
}
