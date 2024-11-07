import {TestBed} from '@angular/core/testing';

import {RouteGroup} from '../../../';
import {createRouteStore, TestRouteStore} from './test-route-store';

describe('@bitfiber/ng/rx/routeGroup/fragment', () => {
  let store: TestRouteStore;
  let testGroup: RouteGroup;

  beforeEach(() => {
    store = createRouteStore({hasFragment: true});
    testGroup = store.testGroup;
  });

  it('The fragment state receives start route value', done => {
    store.initialize();
    TestBed.flushEffects();

    testGroup.params.tap(data => {
      expect(data).toEqual({});
    });
    TestBed.flushEffects();

    testGroup.queryParams.tap(data => {
      expect(data).toEqual({});
    });
    TestBed.flushEffects();

    testGroup.allParams.tap(data => {
      expect(data).toEqual({});
    });
    TestBed.flushEffects();

    testGroup.fragment.tap(data => {
      expect(data).toBe('fr');
    });
    TestBed.flushEffects();

    setTimeout(() => {
      done();
    });
  });

  it('The fragment state receives changed route value', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.fragment.set('fr2');
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.fragment.tap(data => {
          expect(data).toBe('fr2');
        });
        TestBed.flushEffects();

        done();
      });
    });
  });

  it('The fragment state resets to initial route value', done => {
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
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({});
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

  it('The fragment state receives changed value', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.fragment.set('fr2');
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.fragment.tap(data => {
          expect(data).toBe('fr2');
        });
        TestBed.flushEffects();

        done();
      });
    });
  });

  it('The fragment state resets to initial value', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.fragment.reset();
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({});
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
