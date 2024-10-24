import {RouteGroup} from '../../../';
import {createRouteStore, RouteQueryParams, TestRouteStore} from './test-route-store';

describe('@bitfiber/ng/rx/routeGroup/query-params', () => {
  let store: TestRouteStore<RouteQueryParams>;
  let testGroup: RouteGroup<RouteQueryParams>;

  beforeEach(() => {
    store = createRouteStore<RouteQueryParams>({
      initialQueryParams: {search: '', page: 1, groupId: null},
    });
    testGroup = store.testGroup;
  });

  it('The query params state receives start route data', done => {
    testGroup.initialize();

    testGroup.params.tap(data => {
      expect(data).toEqual({});
    });

    testGroup.queryParams.tap(data => {
      expect(data).toEqual({search: 'str', page: 2, groupId: 7});
    });

    testGroup.allParams.tap(data => {
      expect(data).toEqual({search: 'str', page: 2, groupId: 7});
    });

    testGroup.fragment.tap(data => {
      expect(data).toBe(null);
    });

    done();
  });

  it('The query params state receives changed route data', done => {
    testGroup.initialize();

    setTimeout(() => {
      testGroup.changeUrl({search: 'str2', page: 3, groupId: 10});

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: 'str2', page: 3, groupId: 10});
        });

        testGroup.allParams.tap(data => {
          expect(data).toEqual({search: 'str2', page: 3, groupId: 10});
        });

        testGroup.fragment.tap(data => {
          expect(data).toBe(null);
        });

        done();
      });
    });
  });

  it('The query params state resets to initial route data', done => {
    testGroup.initialize();

    setTimeout(() => {
      testGroup.resetUrl();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: '', page: 1, groupId: null});
        });

        testGroup.allParams.tap(data => {
          expect(data).toEqual({search: '', page: 1, groupId: null});
        });

        testGroup.fragment.tap(data => {
          expect(data).toBe(null);
        });

        done();
      });
    });
  });

  it('The query params state receives changed data', done => {
    testGroup.initialize();

    setTimeout(() => {
      testGroup.queryParams.set({search: 'str2', page: 3, groupId: 10});

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: 'str2', page: 3, groupId: 10});
        });

        testGroup.allParams.tap(data => {
          expect(data).toEqual({search: 'str2', page: 3, groupId: 10});
        });

        testGroup.fragment.tap(data => {
          expect(data).toBe(null);
        });

        done();
      });
    });
  });

  it('The query params state resets to initial data', done => {
    testGroup.initialize();

    setTimeout(() => {
      testGroup.queryParams.reset();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: '', page: 1, groupId: null});
        });

        testGroup.allParams.tap(data => {
          expect(data).toEqual({search: '', page: 1, groupId: null});
        });

        testGroup.fragment.tap(data => {
          expect(data).toBe(null);
        });

        done();
      });
    });
  });
});
