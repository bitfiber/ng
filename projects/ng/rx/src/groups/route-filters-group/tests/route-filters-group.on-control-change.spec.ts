import {TestBed} from '@angular/core/testing';

import {RouteFiltersGroup} from '../../../';
import {
  createRouteFiltersStore, RouteParams, RouteQueryParams, TestRouteFiltersStore,
} from './test-route-filters-store';

describe('@bitfiber/ng/rx/routeFiltersGroup/onControlChange', () => {
  let store: TestRouteFiltersStore<RouteQueryParams, RouteParams>;
  let testGroup: RouteFiltersGroup<RouteQueryParams, RouteParams>;

  beforeEach(() => {
    store = createRouteFiltersStore<RouteQueryParams, RouteParams>({
      initialParams: {id: 0, type: 'all'},
      initialQueryParams: {search: '', page: 1, groupId: null},
      segments: params => [params.type, params.id],
      onControlChange: ({controls}, key) => (key !== 'page' && controls.page?.setValue(1)),
      hasFragment: true,
    });
    testGroup = store.testGroup;
    testGroup.initialize();
    TestBed.flushEffects();
  });

  it('The page filter is reset to 1 if any other filter is changed', done => {
    testGroup.form.patchValue({search: 'str2'});
    TestBed.flushEffects();

    setTimeout(() => {
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.filters.tap(data => {
          expect(data).toEqual({id: 1, type: 'new', search: 'str2', page: 1, groupId: 7});
          expect(testGroup.form.value).toEqual({
            id: 1, type: 'new', search: 'str2', page: 1, groupId: 7,
          });
        });
        TestBed.flushEffects();
        done();
      }, 30);
    }, 150);
  });

  it('If the page filter is changed other filters are not changed ', done => {
    testGroup.form.patchValue({page: 3});
    TestBed.flushEffects();

    setTimeout(() => {
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.filters.tap(data => {
          expect(data).toEqual({id: 1, type: 'new', search: 'str', page: 3, groupId: 7});
          expect(testGroup.form.value).toEqual({
            id: 1, type: 'new', search: 'str', page: 3, groupId: 7,
          });
        });
        TestBed.flushEffects();
        done();
      }, 30);
    }, 150);
  });
});
