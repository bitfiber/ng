import {SignalStateType} from '../../../';
import {createStore} from './test-signal-store';

describe('@bitfiber/ng/rx/signalState/completion', () => {
  let testState: SignalStateType<string>;

  beforeEach(() => {
    testState = createStore('initialValue').testState;
  });

  it('SignalState is not completed', () => {
    expect(testState.isCompleted()).toBeFalsy();
  });

  it('SignalState is completed', () => {
    testState.complete();
    expect(testState.isCompleted()).toBeTruthy();
  });
});
