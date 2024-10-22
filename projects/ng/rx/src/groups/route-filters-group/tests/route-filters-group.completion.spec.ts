import {RouteFiltersGroup} from '../../../';
import {
  createRouteFiltersStore, RouteParams, RouteQueryParams, TestRouteFiltersStore,
} from './test-route-filters-store';

describe('@bitfiber/ng/rx/routeFiltersGroup/completion', () => {
  let store: TestRouteFiltersStore<RouteQueryParams, RouteParams>;
  let testGroup: RouteFiltersGroup<RouteQueryParams, RouteParams>;

  beforeEach(() => {
    store = createRouteFiltersStore<RouteQueryParams, RouteParams>({
      initialParams: {id: 0, type: 'all'},
      initialQueryParams: {search: '', page: 1, groupId: null},
      segments: params => [params.type, params.id],
      hasFragment: true,
    });
    testGroup = store.testGroup;
  });

  it('Group completes all nested states', () => {
    testGroup.complete();
    expect(testGroup.isCompleted()).toBeTruthy();
    expect(testGroup.filters.isCompleted()).toBeTruthy();
    expect(testGroup.route.isCompleted()).toBeTruthy();
    expect(testGroup.route.params.isCompleted()).toBeTruthy();
    expect(testGroup.route.queryParams.isCompleted()).toBeTruthy();
    expect(testGroup.route.allParams.isCompleted()).toBeTruthy();
    expect(testGroup.route.fragment.isCompleted()).toBeTruthy();
  });
});
