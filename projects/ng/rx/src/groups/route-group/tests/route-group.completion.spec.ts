import {RouteGroup} from '../../../';
import {createRouteStore, RouteParams, RouteQueryParams, TestRouteStore} from './test-route-store';

describe('@bitfiber/ng/rx/routeGroup/completion', () => {
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

  it('Group completes all nested states', () => {
    store.initialize();
    store.complete();
    expect(testGroup.isCompleted()).toBeTruthy();
    expect(testGroup.params.isCompleted()).toBeTruthy();
    expect(testGroup.queryParams.isCompleted()).toBeTruthy();
    expect(testGroup.allParams.isCompleted()).toBeTruthy();
    expect(testGroup.fragment.isCompleted()).toBeTruthy();
  });
});
