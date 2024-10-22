import {TestBed} from '@angular/core/testing';

import {SignalStateType} from '../../../';
import {createStore} from './test-signal-store';

describe('@bitfiber/ng/rx/signalState/reset', () => {
  let testState: SignalStateType<string>;

  beforeEach(() => {
    testState = createStore('initialValue').testState;
  });

  it('State is reset to its initial value', () => {
    testState.set('value1');
    TestBed.flushEffects();
    testState.reset();
    TestBed.flushEffects();
    expect(testState.get()).toBe('initialValue');
  });

  it('Reset does not emit a value if the value is equal to the initial value', done => {
    let counter = 0;
    testState.tap(() => ++counter);

    setTimeout(() => {
      testState.set('value1');
      TestBed.flushEffects();
      setTimeout(() => {
        testState.set('initialValue');
        TestBed.flushEffects();
        setTimeout(() => {
          testState.reset();
          TestBed.flushEffects();
          setTimeout(() => {
            expect(counter).toBe(3);
            done();
          });
        });
      });
    });
  });
});
