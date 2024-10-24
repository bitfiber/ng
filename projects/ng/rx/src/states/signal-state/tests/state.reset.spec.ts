import {SignalStateType} from '../../../';
import {createStore} from './test-signal-store';

describe('@bitfiber/ng/rx/signalState/reset', () => {
  let testState: SignalStateType<string>;

  beforeEach(() => {
    testState = createStore('initialValue').testState;
  });

  it('State is reset to its initial value', () => {
    testState.set('value1');
    testState.reset();
    expect(testState.get()).toBe('initialValue');
  });

  it('Reset does not emit a value if the value is equal to the initial value', done => {
    let counter = 0;
    testState.tap(() => ++counter);

    setTimeout(() => {
      testState.set('value1');
      setTimeout(() => {
        testState.set('initialValue');
        setTimeout(() => {
          testState.reset();
          setTimeout(() => {
            expect(counter).toBe(3);
            done();
          });
        });
      });
    });
  });
});
