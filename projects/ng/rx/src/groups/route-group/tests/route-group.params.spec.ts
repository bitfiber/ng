import {RouteGroup} from '../../../';
import {createRouteStore, RouteParams, TestRouteStore} from './test-route-store';

describe('@bitfiber/ng/rx/routeGroup/params', () => {
  let store: TestRouteStore<object, RouteParams>;
  let testGroup: RouteGroup<object, RouteParams>;

  beforeEach(() => {
    store = createRouteStore<object, RouteParams>({
      initialParams: {id: 0, type: 'all'},
      segments: params => [params.type, params.id],
    });
    testGroup = store.testGroup;
    store.initialize();
  });

  it('The params state receives start route data', done => {
    testGroup.params.tap(data => {
      expect(data).toEqual({id: 1, type: 'new'});
    });

    testGroup.queryParams.tap(data => {
      expect(data).toEqual({});
    });

    testGroup.allParams.tap(data => {
      expect(data).toEqual({id: 1, type: 'new'});
    });

    testGroup.fragment.tap(data => {
      expect(data).toBe(null);
    });

    done();
  });

  it('The params state receives changed route data', done => {
    testGroup.changeUrl({id: 1, type: 'old'});

    setTimeout(() => {
      testGroup.params.tap(data => {
        expect(data).toEqual({id: 1, type: 'old'});
      });

      testGroup.queryParams.tap(data => {
        expect(data).toEqual({});
      });

      testGroup.allParams.tap(data => {
        expect(data).toEqual({id: 1, type: 'old'});
      });

      testGroup.fragment.tap(data => {
        expect(data).toBe(null);
      });

      done();
    });
  });

  it('The params state resets to initial route data', done => {
    testGroup.resetUrl();

    setTimeout(() => {
      testGroup.params.tap(data => {
        expect(data).toEqual({id: 0, type: 'all'});
      });

      testGroup.queryParams.tap(data => {
        expect(data).toEqual({});
      });

      testGroup.allParams.tap(data => {
        expect(data).toEqual({id: 0, type: 'all'});
      });

      testGroup.fragment.tap(data => {
        expect(data).toBe(null);
      });

      done();
    });
  });

  it('The params state receives changed data', done => {
    testGroup.params.set({id: 1, type: 'old'});

    setTimeout(() => {
      testGroup.params.tap(data => {
        expect(data).toEqual({id: 1, type: 'old'});
      });

      testGroup.queryParams.tap(data => {
        expect(data).toEqual({});
      });

      testGroup.allParams.tap(data => {
        expect(data).toEqual({id: 1, type: 'old'});
      });

      testGroup.fragment.tap(data => {
        expect(data).toBe(null);
      });

      done();
    });
  });

  it('The params state resets to initial data', done => {
    testGroup.params.reset();

    setTimeout(() => {
      testGroup.params.tap(data => {
        expect(data).toEqual({id: 0, type: 'all'});
      });

      testGroup.queryParams.tap(data => {
        expect(data).toEqual({});
      });

      testGroup.allParams.tap(data => {
        expect(data).toEqual({id: 0, type: 'all'});
      });

      testGroup.fragment.tap(data => {
        expect(data).toBe(null);
      });

      done();
    });
  });
});
