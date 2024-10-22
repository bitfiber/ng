import {inject} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Params, Router} from '@angular/router';

import {filter, map, tap} from 'rxjs';
import {Obj, Index, copy, equals, isEmpty, isString, keys, hasOwn, exclude} from '@bitfiber/utils';
import {AbstractGroup} from '@bitfiber/rx';

import {signalState, SignalStateType} from '../../states/signal-state/signal-state';

/**
 * Defines the settings for configuring a `RouteGroup`
 * @template Q - The type representing the query params of the route
 * @template P - The type representing the params of the route
 */
export interface RouteGroupSettings<Q extends Index = object, P extends Index = object> {
  /**
   * Initial values for the route params
   */
  initialParams?: P;

  /**
   * Initial values for the query params
   */
  initialQueryParams?: Q;

  /**
   * A list of param or query param keys that should be excluded from the route
   */
  excludedParams?: (keyof (Q & P))[];

  /**
   * A function that generates an array of route segments from the provided params
   * @param params - A record of param keys and their corresponding values
   * @returns An array of route segments
   */
  segments?: (params: Record<keyof P, string>) => string[];

  /**
   * A boolean flag indicating whether the route has a fragment
   */
  hasFragment?: boolean;

  /**
   * Additional options for configuring the Angular navigation behavior.
   * These extras correspond to Angular's `NavigationExtras` interface
   */
  navigationExtras?: NavigationExtras;
}

/**
 * Creates a new `RouteGroup` instance that facilitates the reactive management of Angular's
 * route data, including params, query params, and the fragment, within the current route.
 *
 * Route elements are represented as signal states, making them usable in Angular's
 * reactive constructs such as `effect` or `computed` functions, and other places where
 * signals are typically used.
 *
 * The properties of the generic types `Q` and `P` can be any type because, before being set to
 * the route, they are converted to strings using `JSON.stringify`. When states receive parameters
 * from the route, they are converted back to their respective types using `JSON.parse`.
 *
 * This function also allows for an optional `onInit` callback, which can be used to perform
 * additional setup or configuration just before the group initialization
 *
 * @template Q - The type representing the query params of the route
 * @template P - The type representing the params of the route
 *
 * @param settings - the settings for configuring a `RouteGroup`
 *
 * @param [onInit] - An optional callback function executed just before the group initialization
 */
export function routeGroup<Q extends Index = object, P extends Index = object>(
  settings: RouteGroupSettings<Q, P>,
  onInit?: (group: RouteGroup<Q, P>, sameGroup: RouteGroup<Q, P>) => void,
): RouteGroup<Q, P> {
  const group = new RouteGroup<Q, P>(settings);
  return onInit ? group.onInit(onInit) : group;
}

/**
 * Represents a route group that facilitates the reactive management of Angular's route data,
 * including params, query params, and the fragment, within the current route.
 *
 * Route elements are represented as signal states, making them usable in Angular's reactive
 * constructs such as `effect` or `computed` functions, and other places where signals are
 * typically used.
 *
 * The properties of the generic types `Q` and `P` can be any type because, before being set to
 * the route, they are converted to strings using `JSON.stringify`. When states receive parameters
 * from the route, they are converted back to their respective types using `JSON.parse`.
 *
 * This class extends `AbstractGroup` to provide a structured way to organize and manage
 * route-related states within the Rx store
 *
 * @template Q - The type representing the query params of the route
 * @template P - The type representing the params of the route
 */
export class RouteGroup<Q extends Index = object, P extends Index = object> extends AbstractGroup {
  /**
   * A signal state that represents the route params
   * @readonly
   */
  readonly params: SignalStateType<P>;

  /**
   * A signal state that represents the query params
   * @readonly
   */
  readonly queryParams: SignalStateType<Q>;

  /**
   * A signal state that includes the route params and query params
   * @readonly
   */
  readonly allParams: SignalStateType<Q & P>;

  /**
   * A signal state that represents the route fragment
   * @readonly
   */
  readonly fragment: SignalStateType<string | null>;

  /**
   * The initial values of the route params
   * @readonly
   */
  readonly #initialParams: P;

  /**
   * The initial values of the query params
   * @readonly
   */
  readonly #initialQueryParams: Q;

  /**
   * A list of param keys that are excluded from the route params and query params
   * @readonly
   */
  readonly #excludedParams: (keyof (Q & P))[];

  /**
   * A function that generates an array of route segments based on the provided route params
   * @readonly
   */
  readonly #segments: (params: Record<keyof P, string>) => string[];

  /**
   * Additional options for configuring the Angular navigation behavior.
   * These options correspond to Angular's `NavigationExtras` interface
   * @readonly
   */
  readonly #navigationExtras: NavigationExtras;

  /**
   * A boolean flag indicating whether the route includes a fragment
   * @readonly
   */
  readonly #hasFragment: boolean = false;

  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);

  /**
   * A boolean flag indicating whether the route has defined params
   */
  #hasParams = false;

  /**
   *  An array of keys representing the available route params
   */
  #paramKeys: (keyof P)[] = [];

  /**
   * A boolean flag indicating whether the route has defined query params
   */
  #hasQueryParams = false;

  /**
   * An array of keys representing the available query params
   */
  #queryParamKeys: (keyof Q)[] = [];

  /**
   * Stores the last known values of the route params
   */
  #lastParamsData = {} as P;

  /**
   * Stores the last known values of the query params
   */
  #lastQueryParamsData = {} as Q;

  /**
   * Stores the last known fragment value
   */
  #lastFragment: string | null = null;

  /**
   * Creates a new `RouteGroup` instance that facilitates the reactive management of Angular's
   * route data, including params, query params, and the fragment, within the current route
   * @param settings - the settings for configuring a `RouteGroup`
   */
  constructor(settings: RouteGroupSettings<Q, P>) {
    super();
    const {
      initialParams,
      initialQueryParams,
      excludedParams,
      hasFragment,
      navigationExtras,
      segments,
    } = settings;

    this.#excludedParams = excludedParams || [];
    this.#hasParams = !!initialParams;
    this.#initialParams = this.#getInitialData(initialParams);
    this.#hasQueryParams = !!initialQueryParams;
    this.#initialQueryParams = this.#getInitialData(initialQueryParams);
    this.#hasFragment = !!hasFragment;
    this.#navigationExtras = navigationExtras || {};
    this.#segments = segments || (() => []);

    this.params = this.#createParamsState();
    this.queryParams = this.#createQueryParamsState();
    this.allParams = this.#createAllParamsState();
    this.fragment = this.#createFragmentState();

    this.setItems([this.params, this.queryParams, this.allParams, this.fragment]);
  }

  /**
   * Determines whether the current route has defined params
   */
  hasParams(): boolean {
    return this.#hasParams;
  }

  /**
   * Determines whether the current route has defined query params
   */
  hasQueryParams(): boolean {
    return this.#hasQueryParams;
  }

  /**
   * Determines whether the current route has defined params or query params
   */
  hasAnyParams(): boolean {
    return this.#hasParams || this.#hasQueryParams;
  }

  /**
   * Determines whether the current route includes a fragment
   */
  hasFragment(): boolean {
    return this.#hasFragment;
  }

  /**
   * Updates the current URL by modifying the query params, route params, or fragment
   * @param data - A partial object containing the query or route params to update
   * @param [fragment] - An optional string to update the URL fragment
   */
  changeUrl(data: Partial<Q | P>, fragment?: string): void {
    const allData = {...this.allParams(), ...data};
    const params = (this.hasParams()
      ? this.#convertDataToParams(allData, this.#paramKeys)
      : {}) as Record<keyof P, string>;

    const queryParams = this.hasQueryParams()
      ? this.#convertDataToParams(allData, this.#queryParamKeys)
      : null;

    this.#router.navigate(this.#segments(params), {
      ...this.#navigationExtras, queryParams,
      fragment: isString(fragment) ? fragment : this.fragment() || undefined,
    }).then();
  }

  /**
   * Resets the current URL to the initial values of the route params, query params, and fragment
   */
  resetUrl(): void {
    this.changeUrl({...this.#initialParams, ...this.#initialQueryParams}, '');
  }

  /**
   * Executes inner group actions that were deferred until the initialization of the group.
   * This method is called just before the group is fully initialized
   */
  protected override executeInnerDeferredActions(): void {
    if (this.hasParams()) {
      this.params
        .receive(this.#activatedRoute.params.pipe(
          map(params => this.#convertParamsToData(params, this.#paramKeys)),
          filter(data => !equals(data, this.params())),
          tap(data => this.#lastParamsData = data),
        ))
        .useLazyEmissionOnce()
        .tap(data => {
          if (data !== this.#lastParamsData) {
            this.#lastParamsData = data;
            this.changeUrl(data);
          }
        });

      this.allParams
        .receive(this.params.useLazyEmissionOnce(), (value, state) => ({...state, ...value}));
    }

    if (this.hasQueryParams()) {
      this.queryParams
        .receive(this.#activatedRoute.queryParams.pipe(
          map(params => this.#convertParamsToData(params, this.#queryParamKeys)),
          filter(data => !equals(data, this.queryParams())),
          tap(data => this.#lastQueryParamsData = data),
        ))
        .useLazyEmissionOnce()
        .tap(data => {
          if (data !== this.#lastQueryParamsData) {
            this.#lastQueryParamsData = data;
            this.changeUrl(data);
          }
        });

      this.allParams
        .receive(this.queryParams.useLazyEmissionOnce(), (value, state) => ({...state, ...value}));
    }

    if (this.hasAnyParams()) {
      this.allParams
        .useLazyEmissionOnce()
        .tap(data => {
          if (!equals(data, {...this.#lastParamsData, ...this.#lastQueryParamsData})) {
            this.changeUrl(data);
          }
        });
    }

    if (this.hasFragment()) {
      this.fragment
        .receive(this.#activatedRoute.fragment.pipe(
          filter(fragment => fragment !== this.fragment()),
          tap(fragment => this.#lastFragment = fragment),
        ))
        .useLazyEmissionOnce()
        .tap(fragment => {
          if (fragment !== this.#lastFragment) {
            this.#lastFragment = fragment;
            this.changeUrl({}, fragment || '');
          }
        });
    }
  }

  /**
   * Creates a signal state representing the route params
   */
  #createParamsState(): SignalStateType<P> {
    if (this.hasParams()) {
      const {params} = this.#activatedRoute.snapshot;
      this.#paramKeys = keys(this.#initialParams);
      const routeData = this.#convertParamsToData(params, this.#paramKeys);
      this.#lastParamsData = {...this.#initialParams, ...routeData};
      return signalState(this.#initialParams)
        .set(this.#lastParamsData);
    } else {
      return signalState<P>({} as P);
    }
  }

  /**
   * Creates a signal state representing the query params
   */
  #createQueryParamsState(): SignalStateType<Q> {
    if (this.hasQueryParams()) {
      const {queryParams} = this.#activatedRoute.snapshot;
      this.#queryParamKeys = keys(this.#initialQueryParams);
      const routeData = this.#convertParamsToData(queryParams, this.#queryParamKeys);
      this.#lastQueryParamsData = {...this.#initialQueryParams, ...routeData};
      return signalState(this.#initialQueryParams)
        .set(this.#lastQueryParamsData);
    } else {
      return signalState<Q>({} as Q);
    }
  }

  /**
   * Creates a signal state representing both the route params and query params
   */
  #createAllParamsState(): SignalStateType<Q & P> {
    if (this.hasAnyParams()) {
      return signalState({...this.#initialParams, ...this.#initialQueryParams})
        .set({...this.queryParams(), ...this.params()});
    } else {
      return signalState({} as Q & P);
    }
  }

  /**
   * Creates a signal state representing the current fragment of the route
   */
  #createFragmentState(): SignalStateType<string | null> {
    const {fragment} = this.#activatedRoute.snapshot;
    this.#lastFragment = fragment;
    return signalState<string | null>(null)
      .set(fragment);
  }

  /**
   * Retrieves the initial data for the given parameters
   *
   * @template T - The type of the parameters object
   *
   * @param [params] - An optional object containing the parameters to retrieve the initial data for
   */
  #getInitialData<T extends Obj>(params?: T): T {
    return params ? exclude(copy(params), ...this.#excludedParams) as T : {} as T;
  }

  /**
   * Converts the provided data into route params based on the specified param keys
   *
   * @template T - The type representing the index of the parameter keys
   *
   * @param data - The data object containing both query params and route params
   * @param paramKeys - An array of keys representing the params to extract from the data
   */
  #convertDataToParams<T extends Index>(data: Q & P, paramKeys: (keyof T)[]): Params {
    const params = {} as Record<keyof T, string>;

    paramKeys.forEach(key => {
      const dataKey = key as keyof (Q & P);

      if (!this.#excludedParams.includes(dataKey) && !isEmpty(data[dataKey])) {
        if (isString(data[dataKey])) {
          params[key] = data[dataKey];
        } else {
          params[key] = JSON.stringify(data[dataKey]);
        }
      }
    });

    return params;
  }

  /**
   * Converts route parameters into a data object based on the specified parameter keys
   *
   * @template T - The type representing the data object that will be constructed from the params
   *
   * @param routeParams - The object containing the route params
   * @param paramKeys - An array of keys representing the params to extract and convert
   */
  #convertParamsToData<T extends Index>(routeParams: Params, paramKeys: (keyof T)[]): T {
    const data = {} as T;

    paramKeys.forEach(key => {
      const paramKey = key as string;

      if (!this.#excludedParams.includes(paramKey)) {
        if (routeParams[paramKey]) {
          try {
            data[key] = JSON.parse(routeParams[paramKey]);
          } catch (e) {
            data[key] = routeParams[paramKey];
          }
        } else {
          data[key] = this.hasParams() && hasOwn(this.#initialParams, key)
            ? this.#initialParams[key as any]
            : this.#initialQueryParams[key as any];
        }
      }
    });

    return data;
  }
}
