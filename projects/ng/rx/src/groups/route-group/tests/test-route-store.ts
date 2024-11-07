// eslint-disable-next-line max-classes-per-file
import {Injectable} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {ActivatedRoute, Router} from '@angular/router';

import {Subject} from 'rxjs';
import {Index, isString} from '@bitfiber/utils';

import {NgStore, RouteGroup, routeGroup, RouteGroupSettings} from '../../../';

export interface RouteParams {
  id?: number;
  type: string;
}

export interface RouteQueryParams {
  page?: number;
  search: string;
  groupId: number | null;
}

export function createRouteStore<Q extends Index = object, P extends Index = object>(
  settings: RouteGroupSettings<Q, P>,
): TestRouteStore<Q, P> {
  const params$ = new Subject<RouteParams>();
  const queryParams$ = new Subject<RouteQueryParams>();
  const fragment$ = new Subject<string | null>();

  class ActivatedRouteMock {
    params = params$.asObservable();
    queryParams = queryParams$.asObservable();
    fragment = fragment$.asObservable();

    snapshot = {
      params: (settings.initialParams ? {id: 1, type: 'new'} : {}) as RouteParams,
      queryParams: (
        settings.initialQueryParams ? {search: 'str', page: 2, groupId: 7} : {}
      ) as RouteQueryParams,
      fragment: (settings.hasFragment ? 'fr' : null) as string | null,
    };

    paramsSub = this.params.subscribe(v => this.snapshot.params = v);
    queryParamsSub = this.queryParams.subscribe(v => this.snapshot.queryParams = v);
    fragmentSub = this.fragment.subscribe(v => this.snapshot.fragment = v);
  }

  class RouterMock {
    navigate(
      segments: (keyof RouteParams)[],
      settings?: {queryParams?: RouteQueryParams; fragment?: string},
    ): Promise<any> {
      if (segments.length) {
        params$.next({type: segments[0], id: Number(segments[1])});
      }

      if (settings?.queryParams) {
        queryParams$.next(settings.queryParams);
      }

      if (isString(settings?.fragment)) {
        fragment$.next(settings?.fragment || null);
      }

      return Promise.resolve();
    }
  }

  TestBed.configureTestingModule({
    providers: [
      {
        provide: Router,
        useClass: RouterMock,
      },
      {
        provide: ActivatedRoute,
        useClass: ActivatedRouteMock,
      },
      {
        provide: TestRouteStore,
        useFactory: () => new TestRouteStore<Q, P>(settings),
      },
    ],
  });

  const store = TestBed.inject(TestRouteStore<Q, P>);
  store.unregisterOnDestroy();
  return store;
}

@Injectable()
export class TestRouteStore<Q extends Index = object, P extends Index = object> extends NgStore {
  testGroup: RouteGroup<Q, P>;

  constructor(settings: RouteGroupSettings<Q, P>) {
    super();
    this.testGroup = routeGroup<Q, P>(settings);
    this.markAsReady();
  }
}
