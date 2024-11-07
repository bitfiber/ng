import {RouteGroup} from '../../../';
import {createRouteStore, RouteParams, RouteQueryParams, TestRouteStore} from './test-route-store';

describe('@bitfiber/ng/rx/routeGroup/full', () => {
  let store: TestRouteStore<RouteQueryParams, RouteParams>;
  let testGroup: RouteGroup<RouteQueryParams, RouteParams>;

  beforeEach(() => {
    store = createRouteStore<RouteQueryParams, RouteParams>({
      initialParams: {id: 0, type: 'all'},
      initialQueryParams: {search: '', page: 1, groupId: null},
      segments: params => [params.type, params.id],
      hasFragment: true,
    });
    testGroup = store.testGroup;
    store.initialize();
  });

  it('All group states receive start route data', done => {
    testGroup.params.tap(data => {
      expect(data).toEqual({id: 1, type: 'new'});
    });

    testGroup.queryParams.tap(data => {
      expect(data).toEqual({search: 'str', page: 2, groupId: 7});
    });

    testGroup.allParams.tap(data => {
      expect(data).toEqual({id: 1, type: 'new', search: 'str', page: 2, groupId: 7});
    });

    testGroup.fragment.tap(data => {
      expect(data).toBe('fr');
    });

    done();
  });

  it('All group states receive changed route data', done => {
    testGroup.changeUrl({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10}, 'fr2');

    setTimeout(() => {
      testGroup.params.tap(data => {
        expect(data).toEqual({id: 1, type: 'old'});
      });

      testGroup.queryParams.tap(data => {
        expect(data).toEqual({search: 'str2', page: 3, groupId: 10});
      });

      testGroup.allParams.tap(data => {
        expect(data).toEqual({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});
      });

      testGroup.fragment.tap(data => {
        expect(data).toBe('fr2');
      });

      done();
    });
  });

  it('All group states reset to initial route data', done => {
    testGroup.resetUrl();

    setTimeout(() => {
      testGroup.params.tap(data => {
        expect(data).toEqual({id: 0, type: 'all'});
      });

      testGroup.queryParams.tap(data => {
        expect(data).toEqual({search: '', page: 1, groupId: null});
      });

      testGroup.allParams.tap(data => {
        expect(data).toEqual({id: 0, type: 'all', search: '', page: 1, groupId: null});
      });

      testGroup.fragment.tap(data => {
        expect(data).toBe(null);
      });

      done();
    });
  });

  it('All params state receives changed params data', done => {
    testGroup.params.set({id: 1, type: 'old'});

    setTimeout(() => {
      testGroup.params.tap(data => {
        expect(data).toEqual({id: 1, type: 'old'});
      });

      testGroup.queryParams.tap(data => {
        expect(data).toEqual({search: 'str', page: 2, groupId: 7});
      });

      testGroup.allParams.tap(data => {
        expect(data).toEqual({id: 1, type: 'old', search: 'str', page: 2, groupId: 7});
      });

      testGroup.fragment.tap(data => {
        expect(data).toBe('fr');
      });

      done();
    });
  });

  it('All params state receives changed query params data', done => {
    testGroup.queryParams.set({search: 'str2', page: 3, groupId: 10});

    setTimeout(() => {
      testGroup.params.tap(data => {
        expect(data).toEqual({id: 1, type: 'new'});
      });

      testGroup.queryParams.tap(data => {
        expect(data).toEqual({search: 'str2', page: 3, groupId: 10});
      });

      testGroup.allParams.tap(data => {
        expect(data).toEqual({id: 1, type: 'new', search: 'str2', page: 3, groupId: 10});
      });

      testGroup.fragment.tap(data => {
        expect(data).toBe('fr');
      });

      done();
    });
  });

  it('All group states receive changed all params data', done => {
    testGroup.allParams.set({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});

    setTimeout(() => {
      testGroup.params.tap(data => {
        expect(data).toEqual({id: 1, type: 'old'});
      });

      testGroup.queryParams.tap(data => {
        expect(data).toEqual({search: 'str2', page: 3, groupId: 10});
      });

      testGroup.allParams.tap(data => {
        expect(data).toEqual({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});
      });

      testGroup.fragment.tap(data => {
        expect(data).toBe('fr');
      });

      done();
    });
  });

  it('Only the fragment state is changed after a fragment change', done => {
    testGroup.fragment.set('fr2');

    setTimeout(() => {
      testGroup.params.tap(data => {
        expect(data).toEqual({id: 1, type: 'new'});
      });

      testGroup.queryParams.tap(data => {
        expect(data).toEqual({search: 'str', page: 2, groupId: 7});
      });

      testGroup.allParams.tap(data => {
        expect(data).toEqual({id: 1, type: 'new', search: 'str', page: 2, groupId: 7});
      });

      testGroup.fragment.tap(data => {
        expect(data).toBe('fr2');
      });

      done();
    });
  });

  it('Only the params and all params state are reset after a params reset', done => {
    testGroup.params.reset();

    setTimeout(() => {
      testGroup.params.tap(data => {
        expect(data).toEqual({id: 0, type: 'all'});
      });

      testGroup.queryParams.tap(data => {
        expect(data).toEqual({search: 'str', page: 2, groupId: 7});
      });

      testGroup.allParams.tap(data => {
        expect(data).toEqual({id: 0, type: 'all', search: 'str', page: 2, groupId: 7});
      });

      testGroup.fragment.tap(data => {
        expect(data).toBe('fr');
      });

      done();
    });
  });

  it('Only the query params and all params state are reset after a query params reset', done => {
    testGroup.queryParams.reset();

    setTimeout(() => {
      testGroup.params.tap(data => {
        expect(data).toEqual({id: 1, type: 'new'});
      });

      testGroup.queryParams.tap(data => {
        expect(data).toEqual({search: '', page: 1, groupId: null});
      });

      testGroup.allParams.tap(data => {
        expect(data).toEqual({id: 1, type: 'new', search: '', page: 1, groupId: null});
      });

      testGroup.fragment.tap(data => {
        expect(data).toBe('fr');
      });

      done();
    });
  });

  it('The all param states are reset after a all params reset', done => {
    testGroup.allParams.reset();

    setTimeout(() => {
      testGroup.params.tap(data => {
        expect(data).toEqual({id: 0, type: 'all'});
      });

      testGroup.queryParams.tap(data => {
        expect(data).toEqual({search: '', page: 1, groupId: null});
      });

      testGroup.allParams.tap(data => {
        expect(data).toEqual({id: 0, type: 'all', search: '', page: 1, groupId: null});
      });

      testGroup.fragment.tap(data => {
        expect(data).toBe('fr');
      });

      done();
    });
  });

  it('Only the fragment state is reset after a fragment reset', done => {
    testGroup.fragment.reset();

    setTimeout(() => {
      testGroup.params.tap(data => {
        expect(data).toEqual({id: 1, type: 'new'});
      });

      testGroup.queryParams.tap(data => {
        expect(data).toEqual({search: 'str', page: 2, groupId: 7});
      });

      testGroup.allParams.tap(data => {
        expect(data).toEqual({id: 1, type: 'new', search: 'str', page: 2, groupId: 7});
      });

      testGroup.fragment.tap(data => {
        expect(data).toBe(null);
      });

      done();
    });
  });
});
