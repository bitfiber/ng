import {MemoryStorage, MemoryStoragePart} from '@bitfiber/rx';

import {SignalStateType} from '../../../';
import {createStore} from './test-signal-store';

describe('@bitfiber/ng/rx/signalState/source', () => {
  let testSource: MemoryStoragePart;
  let testState: SignalStateType<string | undefined>;

  beforeEach(() => {
    testSource = new MemoryStoragePart('someKey', new MemoryStorage());
    testState = createStore<string | undefined>(undefined).testState;
  });

  it('State is undefined if state and source is undefined', done => {
    testState.connect(testSource);
    setTimeout(() => {
      expect(testState.get()).toBeUndefined();
      done();
    });
  });

  it('State receives a source value if source is defined', done => {
    testSource.set('value1');
    setTimeout(() => {
      testState.connect(testSource);
      setTimeout(() => {
        expect(testState.get()).toBe('value1');
        done();
      });
    });
  });

  it('State does not receive a source value if source is undefined', done => {
    testState.set('value1');
    setTimeout(() => {
      testState.connect(testSource);
      setTimeout(() => {
        expect(testState.get()).toBe('value1');
        done();
      });
    });
  });

  it('Undefined source receives a state value', done => {
    testState.set('value1');
    setTimeout(() => {
      testState.connect(testSource);
      setTimeout(() => {
        expect(testSource.get()).toBe('value1');
        done();
      });
    });
  });

  it('State receives a source value if both is defined', done => {
    testState.set('value1');
    setTimeout(() => {
      testSource.set('value2');
      setTimeout(() => {
        testState.connect(testSource);
        setTimeout(() => {
          expect(testState.get()).toBe('value2');
          done();
        });
      });
    });
  });

  it('Source receives a changed state value after initialization', done => {
    testState.set('value1');
    setTimeout(() => {
      testSource.set('value2');
      setTimeout(() => {
        testState.connect(testSource);
        setTimeout(() => {
          testState.set('value3');
          setTimeout(() => {
            expect(testSource.get()).toBe('value3');
            done();
          });
        });
      });
    });
  });

  it('State receives a changed source value after initialization', done => {
    testState.set('value1');
    setTimeout(() => {
      testSource.set('value2');
      setTimeout(() => {
        testState.connect(testSource);
        setTimeout(() => {
          testSource.set('value3');
          setTimeout(() => {
            expect(testState.get()).toBe('value3');
            done();
          });
        });
      });
    });
  });
});
