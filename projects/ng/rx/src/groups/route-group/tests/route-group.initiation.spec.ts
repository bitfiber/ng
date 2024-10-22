import {RouteGroup, SignalState} from '../../../';
import {createRouteStore, RouteParams, RouteQueryParams, TestRouteStore} from './test-route-store';

describe('@bitfiber/ng/rx/routeGroup/initiation', () => {
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

  it('Group has all nested states', () => {
    expect(testGroup instanceof RouteGroup).toBeTruthy();
    expect(testGroup.params instanceof SignalState).toBeTruthy();
    expect(testGroup.queryParams instanceof SignalState).toBeTruthy();
    expect(testGroup.allParams instanceof SignalState).toBeTruthy();
    expect(testGroup.fragment instanceof SignalState).toBeTruthy();
  });

  it('Nested states are not initialized', () => {
    expect(testGroup.isInitialized()).toBeFalsy();
    expect(testGroup.params.isInitialized()).toBeFalsy();
    expect(testGroup.queryParams.isInitialized()).toBeFalsy();
    expect(testGroup.allParams.isInitialized()).toBeFalsy();
    expect(testGroup.fragment.isInitialized()).toBeFalsy();
  });

  it('Group initializes all nested states', () => {
    testGroup.initialize();
    expect(testGroup.isInitialized()).toBeTruthy();
    expect(testGroup.params.isInitialized()).toBeTruthy();
    expect(testGroup.queryParams.isInitialized()).toBeTruthy();
    expect(testGroup.allParams.isInitialized()).toBeTruthy();
    expect(testGroup.fragment.isInitialized()).toBeTruthy();
  });
});
