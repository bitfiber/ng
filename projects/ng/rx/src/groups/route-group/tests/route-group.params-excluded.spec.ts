import {TestBed} from '@angular/core/testing';

import {RouteGroup} from '../../../';
import {createRouteStore, RouteParams, TestRouteStore} from './test-route-store';

describe('@bitfiber/ng/rx/routeGroup/params-excluded', () => {
  let store: TestRouteStore<object, RouteParams>;
  let testGroup: RouteGroup<object, RouteParams>;

  beforeEach(() => {
    store = createRouteStore<object, RouteParams>({
      initialParams: {id: 0, type: 'all'},
      excludedParams: ['id'],
      segments: params => [params.type, params.id],
    });
    testGroup = store.testGroup;
  });

  it('The params state has no an excluded param', done => {
    testGroup.initialize();
    TestBed.flushEffects();

    testGroup.params.tap(data => {
      expect(data).toEqual({type: 'new'});
    });
    TestBed.flushEffects();

    testGroup.queryParams.tap(data => {
      expect(data).toEqual({});
    });
    TestBed.flushEffects();

    testGroup.allParams.tap(data => {
      expect(data).toEqual({type: 'new'});
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

  it('The params state has no an excluded param after route change', done => {
    testGroup.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.changeUrl({id: 1, type: 'old'});
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({type: 'old'});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({type: 'old'});
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

  it('The params state has no an excluded param after route reset', done => {
    testGroup.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.resetUrl();
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({type: 'all'});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({type: 'all'});
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

  it('The params state has no an excluded param after change', done => {
    testGroup.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.params.set({type: 'old'});
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({type: 'old'});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({type: 'old'});
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

  it('The params state has no an excluded param after reset', done => {
    testGroup.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.params.reset();
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({type: 'all'});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({type: 'all'});
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
