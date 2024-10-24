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
    testGroup.initialize();

    testGroup.params.tap(data => {
      expect(data).toEqual({});
    });

    testGroup.queryParams.tap(data => {
      expect(data).toEqual({});
    });

    testGroup.allParams.tap(data => {
      expect(data).toEqual({});
    });

    testGroup.fragment.tap(data => {
      expect(data).toBe('fr');
    });

    done();
  });

  it('The fragment state receives changed route value', done => {
    testGroup.initialize();

    setTimeout(() => {
      testGroup.fragment.set('fr2');

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.allParams.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.fragment.tap(data => {
          expect(data).toBe('fr2');
        });

        done();
      });
    });
  });

  it('The fragment state resets to initial route value', done => {
    testGroup.initialize();

    setTimeout(() => {
      testGroup.resetUrl();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.allParams.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.fragment.tap(data => {
          expect(data).toBe(null);
        });

        done();
      });
    });
  });

  it('The fragment state receives changed value', done => {
    testGroup.initialize();

    setTimeout(() => {
      testGroup.fragment.set('fr2');

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.allParams.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.fragment.tap(data => {
          expect(data).toBe('fr2');
        });

        done();
      });
    });
  });

  it('The fragment state resets to initial value', done => {
    testGroup.initialize();

    setTimeout(() => {
      testGroup.fragment.reset();

      setTimeout(() => {
        testGroup.params.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.queryParams.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.allParams.tap(data => {
          expect(data).toEqual({});
        });

        testGroup.fragment.tap(data => {
          expect(data).toBe(null);
        });

        done();
      });
    });
  });
});
