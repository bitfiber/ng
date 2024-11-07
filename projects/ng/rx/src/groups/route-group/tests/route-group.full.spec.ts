import {TestBed} from '@angular/core/testing';

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
  });

  it('All group states receive start route data', done => {
    store.initialize();
    TestBed.flushEffects();

    testGroup.params.tap(data => {
      expect(data).toEqual({id: 1, type: 'new'});
    });
    TestBed.flushEffects();

    testGroup.queryParams.tap(data => {
      expect(data).toEqual({search: 'str', page: 2, groupId: 7});
    });
    TestBed.flushEffects();

    testGroup.allParams.tap(data => {
      expect(data).toEqual({id: 1, type: 'new', search: 'str', page: 2, groupId: 7});
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

  it('All group states receive changed route data', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.changeUrl({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10}, 'fr2');
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({id: 1, type: 'old'});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: 'str2', page: 3, groupId: 10});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});
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

  it('All group states reset to initial route data', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.resetUrl();
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({id: 0, type: 'all'});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: '', page: 1, groupId: null});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({id: 0, type: 'all', search: '', page: 1, groupId: null});
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

  it('All params state receives changed params data', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.params.set({id: 1, type: 'old'});
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({id: 1, type: 'old'});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: 'str', page: 2, groupId: 7});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({id: 1, type: 'old', search: 'str', page: 2, groupId: 7});
        });
        TestBed.flushEffects();

        testGroup.fragment.tap(data => {
          expect(data).toBe('fr');
        });
        TestBed.flushEffects();

        done();
      });
    });
  });

  it('All params state receives changed query params data', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.queryParams.set({search: 'str2', page: 3, groupId: 10});
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({id: 1, type: 'new'});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: 'str2', page: 3, groupId: 10});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({id: 1, type: 'new', search: 'str2', page: 3, groupId: 10});
        });
        TestBed.flushEffects();

        testGroup.fragment.tap(data => {
          expect(data).toBe('fr');
        });
        TestBed.flushEffects();

        done();
      });
    });
  });

  it('All group states receive changed all params data', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.allParams.set({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({id: 1, type: 'old'});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: 'str2', page: 3, groupId: 10});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});
        });
        TestBed.flushEffects();

        testGroup.fragment.tap(data => {
          expect(data).toBe('fr');
        });
        TestBed.flushEffects();

        done();
      });
    });
  });

  it('Only the fragment state is changed after a fragment change', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.fragment.set('fr2');
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({id: 1, type: 'new'});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: 'str', page: 2, groupId: 7});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({id: 1, type: 'new', search: 'str', page: 2, groupId: 7});
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

  it('Only the params and all params state are reset after a params reset', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.params.reset();
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({id: 0, type: 'all'});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: 'str', page: 2, groupId: 7});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({id: 0, type: 'all', search: 'str', page: 2, groupId: 7});
        });
        TestBed.flushEffects();

        testGroup.fragment.tap(data => {
          expect(data).toBe('fr');
        });
        TestBed.flushEffects();

        done();
      });
    });
  });

  it('Only the query params and all params state are reset after a query params reset', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.queryParams.reset();
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({id: 1, type: 'new'});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: '', page: 1, groupId: null});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({id: 1, type: 'new', search: '', page: 1, groupId: null});
        });
        TestBed.flushEffects();

        testGroup.fragment.tap(data => {
          expect(data).toBe('fr');
        });
        TestBed.flushEffects();

        done();
      });
    });
  });

  it('The all param states are reset after a all params reset', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.allParams.reset();
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({id: 0, type: 'all'});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: '', page: 1, groupId: null});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({id: 0, type: 'all', search: '', page: 1, groupId: null});
        });
        TestBed.flushEffects();

        testGroup.fragment.tap(data => {
          expect(data).toBe('fr');
        });
        TestBed.flushEffects();

        done();
      });
    });
  });

  it('Only the fragment state is reset after a fragment reset', done => {
    store.initialize();
    TestBed.flushEffects();

    setTimeout(() => {
      testGroup.fragment.reset();
      TestBed.flushEffects();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({id: 1, type: 'new'});
        });
        TestBed.flushEffects();

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({search: 'str', page: 2, groupId: 7});
        });
        TestBed.flushEffects();

        testGroup.allParams.tap(data => {
          expect(data).toEqual({id: 1, type: 'new', search: 'str', page: 2, groupId: 7});
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
