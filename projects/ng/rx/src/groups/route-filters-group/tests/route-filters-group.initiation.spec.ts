import {RouteFiltersGroup, RouteGroup, SignalState} from '../../../';
import {
  createRouteFiltersStore, RouteParams, RouteQueryParams, TestRouteFiltersStore,
} from './test-route-filters-store';

describe('@bitfiber/ng/rx/routeFiltersGroup/initiation', () => {
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

  it('Group has all nested states', () => {
    expect(testGroup instanceof RouteFiltersGroup).toBeTruthy();
    expect(testGroup.filters instanceof SignalState).toBeTruthy();
    expect(testGroup.route instanceof RouteGroup).toBeTruthy();
    expect(testGroup.route.params instanceof SignalState).toBeTruthy();
    expect(testGroup.route.queryParams instanceof SignalState).toBeTruthy();
    expect(testGroup.route.allParams instanceof SignalState).toBeTruthy();
    expect(testGroup.route.fragment instanceof SignalState).toBeTruthy();
  });

  it('Nested states are not initialized', () => {
    expect(testGroup.filters.isInitialized()).toBeFalsy();
    expect(testGroup.route.isInitialized()).toBeFalsy();
    expect(testGroup.route.params.isInitialized()).toBeFalsy();
    expect(testGroup.route.queryParams.isInitialized()).toBeFalsy();
    expect(testGroup.route.allParams.isInitialized()).toBeFalsy();
    expect(testGroup.route.fragment.isInitialized()).toBeFalsy();
  });

  it('Group initializes all nested states', () => {
    testGroup.initialize();
    expect(testGroup.filters.isInitialized()).toBeTruthy();
    expect(testGroup.route.isInitialized()).toBeTruthy();
    expect(testGroup.route.params.isInitialized()).toBeTruthy();
    expect(testGroup.route.queryParams.isInitialized()).toBeTruthy();
    expect(testGroup.route.allParams.isInitialized()).toBeTruthy();
    expect(testGroup.route.fragment.isInitialized()).toBeTruthy();
  });
});
