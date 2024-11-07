import {TestBed} from '@angular/core/testing';

import {RouteGroup} from '../../../';
import {createRouteStore, RouteQueryParams, TestRouteStore} from './test-route-store';

describe('@bitfiber/ng/rx/routeGroup/query-params-excluded', () => {
  let store: TestRouteStore<RouteQueryParams>;
  let testGroup: RouteGroup<RouteQueryParams>;

  beforeEach(() => {
    store = createRouteStore<RouteQueryParams>({
      initialQueryParams: {search: '', page: 1, groupId: null},
      excludedParams: ['page'],
    });
    testGroup = store.testGroup;
  });

  it('The query params state has no an excluded param', done => {
    store.initialize();
    TestBed.flushEffects();

    testGroup.params.tap(data => {
      expect(data).toEqual({});
    });
    TestBed.flushEffects();

    testGroup.queryParams.tap(data => {
      expect(data).toEqual({search: 'str', groupId: 7});
    });
    TestBed.flushEffects();

    testGroup.allParams.tap(data => {
      expect(data).toEqual({search: 'str', groupId: 7});
    });
    TestBed.flushEffects();

    testGroup.fragment.tap(data => {
      expect(data).toBe(null);
    });
    TestBed.flushEffects();

    setTimeout(() => {
      done();
    });
  });

  it('The query params state has no an excluded param after route change', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.changeUrl({search: 'str2', page: 3, groupId: 10});
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: 'str2', groupId: 10});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({search: 'str2', groupId: 10});
        });
        TestBed.flushEffects();

        testGroup.fragment.tap(data => {
          expect(data).toBe(null);
        });
        TestBed.flushEffects();

        done();
      });
    });
  });

  it('The query params state has no an excluded param after route reset', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.resetUrl();
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: '', groupId: null});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({search: '', groupId: null});
        });
        TestBed.flushEffects();

        testGroup.fragment.tap(data => {
          expect(data).toBe(null);
        });
        TestBed.flushEffects();

        done();
      });
    });
  });

  it('The query params state has no an excluded param after change', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.queryParams.set({search: 'str2', groupId: 10});
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: 'str2', groupId: 10});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({search: 'str2', groupId: 10});
        });
        TestBed.flushEffects();

        testGroup.fragment.tap(data => {
          expect(data).toBe(null);
        });
        TestBed.flushEffects();

        done();
      });
    });
  });

  it('The query params state has no an excluded param after reset', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.queryParams.reset();
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: '', groupId: null});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({search: '', groupId: null});
        });
        TestBed.flushEffects();

        testGroup.fragment.tap(data => {
          expect(data).toBe(null);
        });
        TestBed.flushEffects();

        done();
      });
    });
  });
});
