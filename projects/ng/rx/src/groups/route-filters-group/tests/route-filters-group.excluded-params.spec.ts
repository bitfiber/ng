import {RouteFiltersGroup} from '../../../';
import {
  createRouteFiltersStore, RouteParams, RouteQueryParams, TestRouteFiltersStore,
} from './test-route-filters-store';

describe('@bitfiber/ng/rx/routeFiltersGroup/excludedParams', () => {
  let store: TestRouteFiltersStore<RouteQueryParams, RouteParams>;
  let testGroup: RouteFiltersGroup<RouteQueryParams, RouteParams>;

  beforeEach(() => {
    store = createRouteFiltersStore<RouteQueryParams, RouteParams>({
      initialParams: {id: 0, type: 'all'},
      initialQueryParams: {search: '', page: 1, groupId: null},
      excludedParams: ['id', 'page'],
      segments: params => [params.type, params.id],
      hasFragment: true,
    });
    testGroup = store.testGroup;
    store.initialize();
  });

  it('The filters state and form receives start route data except excluded params', done => {
    testGroup.filters.tap(data => {
      expect(data).toEqual({id: 0, type: 'new', search: 'str', page: 1, groupId: 7});
      expect(testGroup.form.value).toEqual({
        id: 0, type: 'new', search: 'str', page: 1, groupId: 7,
      });
      done();
    });
  });

  it('The filters state and form receives changed form data', done => {
    testGroup.form.patchValue({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});

    setTimeout(() => {
      testGroup.filters.tap(data => {
        expect(data).toEqual({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});
        expect(testGroup.form.value).toEqual({
          id: 1, type: 'old', search: 'str2', page: 3, groupId: 10,
        });
        done();
      });
    }, 150);
  });

  it('The filters state and form receives changed route data except excluded params', done => {
    testGroup.route.changeUrl({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});

    setTimeout(() => {
      testGroup.filters.tap(data => {
        expect(data).toEqual({id: 0, type: 'old', search: 'str2', page: 1, groupId: 10});
        expect(testGroup.form.value).toEqual({
          id: 0, type: 'old', search: 'str2', page: 1, groupId: 10,
        });
        done();
      });
    }, 150);
  });

  it('The filters state and form receives changed itself data', done => {
    testGroup.filters.set({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});

    setTimeout(() => {
      testGroup.filters.tap(data => {
        expect(data).toEqual({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});
        expect(testGroup.form.value).toEqual({
          id: 1, type: 'old', search: 'str2', page: 3, groupId: 10,
        });
        done();
      });
    });
  });

  it('The filters state and form reset to initial route data except excluded params', done => {
    testGroup.filters.set({id: 1, type: 'old', search: 'str2', page: 3, groupId: 10});

    setTimeout(() => {
      testGroup.route.resetUrl();

      setTimeout(() => {
        testGroup.filters.tap(data => {
          expect(data).toEqual({id: 1, type: 'all', search: '', page: 3, groupId: null});
          expect(testGroup.form.value).toEqual({
            id: 1, type: 'all', search: '', page: 3, groupId: null,
          });
          done();
        });
      });
    });
  });

  it('The filters state and form reset to itself initial data', done => {
    testGroup.filters.reset();

    setTimeout(() => {
      testGroup.filters.tap(data => {
        expect(data).toEqual({id: 0, type: 'all', search: '', page: 1, groupId: null});
        expect(testGroup.form.value).toEqual({
          id: 0, type: 'all', search: '', page: 1, groupId: null,
        });
        done();
      });
    });
  });
});
