import {TestBed} from '@angular/core/testing';

import {delay, of, switchMap, tap} from 'rxjs';
import {emitter, state, transmit} from '@bitfiber/rx';

import {signalState, asyncSignalGroup, NgStore} from '../../';

interface EntitiesFilters {
  search: string;
  page: number;
}

interface EntitiesState {
  entities: string[];
  isLoading: boolean;
}

class EntitiesStore extends NgStore {
  start = emitter<void>();

  filters = state<EntitiesFilters>({search: '', page: 1})
    .useLazyEmission();

  entitiesReq = asyncSignalGroup<EntitiesFilters, string[], Error>((entitiesReq, {launch}) => {
    launch
      .receive(this.start, () => this.filters())
      .receive(this.filters)
      .effect(
        switchMap(() => of(['entity1', 'entity2']).pipe(
          delay(50),
          transmit(entitiesReq),
          tap(() => TestBed.flushEffects()),
        )),
      );
  }, []);

  data = signalState<EntitiesState>({entities: [], isLoading: false}, data => data
    .receive(this.entitiesReq.state, ({inProgress}) => {
      return {...data(), isLoading: inProgress};
    })
    .select(this.entitiesReq.success, entities => {
      return {...data(), entities};
    }));

  ready = this.markAsReady();
}

describe('@bitfiber/ng/rx/NgStore1', () => {
  let testStore: EntitiesStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntitiesStore],
    });
    testStore = TestBed.inject(EntitiesStore);
    testStore.unregisterOnDestroy();
  });

  it('Final data is received', done => {
    testStore.initialize();

    testStore.data.tap(data => {
      if (data.entities.length) {
        expect(testStore.data()).toEqual({
          entities: ['entity1', 'entity2'],
          isLoading: false,
        });
        done();
      }
    });

    setTimeout(() => {
      testStore.start.emit();
    }, 50);
  });
});
