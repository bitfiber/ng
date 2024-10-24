import {debounceTime} from 'rxjs';

import {RouteFiltersGroup} from '../../../';
import {
  createRouteFiltersStore, RouteParams, RouteQueryParams, TestRouteFiltersStore,
} from './test-route-filters-store';

describe('@bitfiber/ng/rx/routeFiltersGroup/controlOperators', () => {
  let store: TestRouteFiltersStore<RouteQueryParams, RouteParams>;
  let testGroup: RouteFiltersGroup<RouteQueryParams, RouteParams>;

  beforeEach(() => {
    store = createRouteFiltersStore<RouteQueryParams, RouteParams>({
      initialParams: {id: 0, type: 'all'},
      initialQueryParams: {search: '', page: 1, groupId: null},
      segments: params => [params.type, params.id],
      controlOperators: {search: [debounceTime(150)]},
      hasFragment: true,
    });
    testGroup = store.testGroup;
    testGroup.initialize();
  });

  it('The search filter is changed after debounce time', done => {
    let counter = 0;
    testGroup.form.patchValue({search: 'str2'});

    setTimeout(() => {
      testGroup.filters.tap(data => {
        ++counter;
        if (counter === 1) {
          expect(data).toEqual({id: 1, type: 'new', search: 'str', page: 2, groupId: 7});
          expect(testGroup.form.value).toEqual({
            id: 1, type: 'new', search: 'str2', page: 2, groupId: 7,
          });
        } else if (counter === 2) {
          expect(data).toEqual({id: 1, type: 'new', search: 'str2', page: 2, groupId: 7});
          expect(testGroup.form.value).toEqual({
            id: 1, type: 'new', search: 'str2', page: 2, groupId: 7,
          });
          done();
        }
      });
    }, 150);
  });
});
