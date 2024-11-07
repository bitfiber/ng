import {SignalStateType} from '../../../';
import {createStore, TestSignalStore} from './test-signal-store';

describe('@bitfiber/ng/rx/signalState/initialization', () => {
  let store: TestSignalStore<string>;
  let testState: SignalStateType<string>;

  beforeEach(() => {
    store = createStore('initialValue');
    testState = store.testState;
  });

  it('State is not initialized', () => {
    expect(testState.isInitialized()).toBeFalsy();
  });

  it('State is initialized', () => {
    store.initialize();
    expect(testState.isInitialized()).toBeTruthy();
  });

  it('onInit callback is not executed until initialization', () => {
    testState.onInit(e => e.tap(() => true));
    expect(testState.isInitialized()).toBeFalsy();
  });

  it('onInit callback is executed during initialization', done => {
    testState.onInit(e => e.tap(v => {
      expect(v).toBe('value2');
      done();
    }));

    setTimeout(() => {
      testState.set('value1');
      setTimeout(() => {
        testState.set('value2');
        setTimeout(() => {
          testState.initialize();
        });
      });
    });
  });

  it('State has an initial value', done => {
    testState.tap(v => {
      expect(v).toBe('initialValue');
      done();
    });
  });
});
