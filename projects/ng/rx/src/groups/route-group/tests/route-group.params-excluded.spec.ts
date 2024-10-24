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

    testGroup.params.tap(data => {
      expect(data).toEqual({type: 'new'});
    });

    testGroup.queryParams.tap(data => {
      expect(data).toEqual({});
    });

    testGroup.allParams.tap(data => {
      expect(data).toEqual({type: 'new'});
    });

    testGroup.fragment.tap(data => {
      expect(data).toBe(null);
    });

    done();
  });

  it('The params state has no an excluded param after route change', done => {
    testGroup.initialize();

    setTimeout(() => {
      testGroup.changeUrl({id: 1, type: 'old'});

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({type: 'old'});
        });

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.allParams.tap(data => {
          expect(data).toEqual({type: 'old'});
        });

        testGroup.fragment.tap(data => {
          expect(data).toBe(null);
        });

        done();
      });
    });
  });

  it('The params state has no an excluded param after route reset', done => {
    testGroup.initialize();

    setTimeout(() => {
      testGroup.resetUrl();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({type: 'all'});
        });

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.allParams.tap(data => {
          expect(data).toEqual({type: 'all'});
        });

        testGroup.fragment.tap(data => {
          expect(data).toBe(null);
        });

        done();
      });
    });
  });

  it('The params state has no an excluded param after change', done => {
    testGroup.initialize();

    setTimeout(() => {
      testGroup.params.set({type: 'old'});

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({type: 'old'});
        });

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.allParams.tap(data => {
          expect(data).toEqual({type: 'old'});
        });

        testGroup.fragment.tap(data => {
          expect(data).toBe(null);
        });

        done();
      });
    });
  });

  it('The params state has no an excluded param after reset', done => {
    testGroup.initialize();

    setTimeout(() => {
      testGroup.params.reset();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({type: 'all'});
        });

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.allParams.tap(data => {
          expect(data).toEqual({type: 'all'});
        });

        testGroup.fragment.tap(data => {
          expect(data).toBe(null);
        });

        done();
      });
    });
  });
});
