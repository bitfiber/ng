import {Injectable} from '@angular/core';
import {TestBed} from '@angular/core/testing';

import {NgStore, signalState, SignalStateType} from '../../../';

export function createStore<T>(initialValue: T, initialValue2?: T) {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: TestSignalStore,
        useFactory: () => new TestSignalStore(initialValue, initialValue2),
      },
    ],
  });
  const store = TestBed.inject(TestSignalStore<T>);
  TestBed.flushEffects();
  store.unregisterOnDestroy();
  return store;
}

@Injectable()
export class TestSignalStore<T> extends NgStore {
  testState: SignalStateType<T>;
  stringState: SignalStateType<T>;
  numberState: SignalStateType<number>;

  constructor(initialValue: T, initialValue2?: T) {
    super();
    this.testState = signalState<T>(initialValue);
    this.stringState = signalState<T>(initialValue2 || initialValue);
    this.numberState = signalState<number>(0);
    this.markAsReady();
  }
}
