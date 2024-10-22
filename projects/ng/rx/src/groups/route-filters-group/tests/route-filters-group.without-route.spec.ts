import {TestBed} from '@angular/core/testing';

import {RouteFiltersGroup} from '../../../';
import {
  createRouteFiltersStore, RouteParams, RouteQueryParams, TestRouteFiltersStore,
} from './test-route-filters-store';

describe('@bitfiber/ng/rx/routeFiltersGroup/withoutRoute', () => {
  let store: TestRouteFiltersStore<RouteQueryParams, RouteParams>;
  let testGroup: RouteFiltersGroup<RouteQueryParams, RouteParams>;

  beforeEach(() => {
    store = createRouteFiltersStore<RouteQueryParams, RouteParams>({
      initialParams: {id: 0, type: 'all'},
      initialQueryParams: {search: '', page: 1, groupId: null},
      segments: params => [params.type, params.id],
      hasFragment: true,
      withoutRoute: true,
    });
    testGroup = store.testGroup;
    testGroup.initialize();
    TestBed.flushEffects();
  });

  it('The filters state does not receive start route data', done => {
    testGroup.filters.tap(data => {
      expect(data).toEqual({id: 0, type: 'all', search: '', page: 1, groupId: null});
      expect(testGroup.form.value).toEqual({
        id: 0, type: 'all', search: '', page: 1, groupId: null,
      });
    });
    TestBed.flushEffects();

    setTimeout(() => {
      done();
    });
  });

  it('The filters state receives changed form data', done => {
    testGroup.form.patchValue({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});
    TestBed.flushEffects();

    setTimeout(() => {
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.filters.tap(data => {
          expect(data).toEqual({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});
          expect(testGroup.form.value).toEqual({
            id: 1, type: 'old', search: 'str2', page: 3, groupId: 10,
          });
        });
        TestBed.flushEffects();
        done();
      }, 30);
    }, 150);
  });

  it('The filters state and form receive changed data', done => {
    testGroup.filters.set({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});
    TestBed.flushEffects();

    setTimeout(() => {
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.filters.tap(data => {
          expect(data).toEqual({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});
          expect(testGroup.form.value).toEqual({
            id: 1, type: 'old', search: 'str2', page: 3, groupId: 10,
          });
        });
        TestBed.flushEffects();
        done();
      }, 30);
    });
  });

  it('The filters state and form reset to initial data', done => {
    testGroup.filters.reset();
    TestBed.flushEffects();

    setTimeout(() => {
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.filters.tap(data => {
          expect(data).toEqual({id: 0, type: 'all', search: '', page: 1, groupId: null});
          expect(testGroup.form.value).toEqual({
            id: 0, type: 'all', search: '', page: 1, groupId: null,
          });
        });
        TestBed.flushEffects();
        done();
      }, 30);
    });
  });

  it('The filters state and form do not receive changed route data', done => {
    testGroup.route.changeUrl({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.filters.tap(data => {
        expect(data).toEqual({id: 0, type: 'all', search: '', page: 1, groupId: null});
        expect(testGroup.form.value).toEqual({
          id: 0, type: 'all', search: '', page: 1, groupId: null,
        });
      });
      TestBed.flushEffects();
      done();
    });
  });

  it('The filters state and form do not reset to initial route data', done => {
    testGroup.form.patchValue({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});
    TestBed.flushEffects();

    setTimeout(() => {
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.route.resetUrl();
        TestBed.flushEffects();

        setTimeout(() => {
          testGroup.filters.tap(data => {
            expect(data).toEqual({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});
            expect(testGroup.form.value).toEqual({
              id: 1, type: 'old', search: 'str2', page: 3, groupId: 10,
            });
          });
          TestBed.flushEffects();
          done();
        });
      }, 30);
    }, 150);
  });
});
