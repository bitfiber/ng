import {TestBed} from '@angular/core/testing';

import {debounceTime} from 'rxjs';

import {RouteFiltersGroup} from '../../../';
import {
  createRouteFiltersStore, RouteParams, RouteQueryParams, TestRouteFiltersStore,
} from './test-route-filters-store';

describe('@bitfiber/ng/rx/routeFiltersGroup/controlOperators', () => {
  let store: TestRouteFiltersStore<RouteQueryParams, RouteParams>;
  let testGroup: RouteFiltersGroup<RouteQueryParams, RouteParams>;

  beforeEach(() => {
    store = createRouteFiltersStore<RouteQueryParams, RouteParams>({
      initialParams: {id: 0, type: 'all'},
      initialQueryParams: {search: '', page: 1, groupId: null},
      segments: params => [params.type, params.id],
      controlOperators: {search: [debounceTime(150)]},
      hasFragment: true,
    });
    testGroup = store.testGroup;
    testGroup.initialize();
    TestBed.flushEffects();
  });

  it('The search filter is changed after debounce time', done => {
    let counter = 0;
    testGroup.form.patchValue({search: 'str2'});
    TestBed.flushEffects();

    setTimeout(() => {
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.filters.tap(data => {
          ++counter;
          if (counter === 1) {
            expect(data).toEqual({id: 1, type: 'new', search: 'str', page: 2, groupId: 7});
            expect(testGroup.form.value).toEqual({
              id: 1, type: 'new', search: 'str2', page: 2, groupId: 7,
            });
            TestBed.flushEffects();

            setTimeout(() => {
              TestBed.flushEffects();
            }, 200);
          } else if (counter === 2) {
            expect(data).toEqual({id: 1, type: 'new', search: 'str2', page: 2, groupId: 7});
            expect(testGroup.form.value).toEqual({
              id: 1, type: 'new', search: 'str2', page: 2, groupId: 7,
            });
            done();
          }
        });
      }, 30);
    }, 100);
  });
});
