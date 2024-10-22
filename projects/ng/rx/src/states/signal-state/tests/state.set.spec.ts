import {TestBed} from '@angular/core/testing';

import {Index} from '@bitfiber/utils';

import {SignalStateType} from '../../../';
import {createStore} from './test-signal-store';

describe('@bitfiber/ng/rx/signalState/set', () => {
  let testState: SignalStateType<Index>;

  beforeEach(() => {
    testState = createStore<Index>({initialValue: true}).testState;
  });

  it('Initial value is changed', () => {
    const value1 = {value1: true};
    testState.set(value1);
    TestBed.flushEffects();
    expect(testState.get()).toBe(value1);
  });

  it('Strict comparison: the same value is not emitted', done => {
    let counter = 0;
    const value1 = {value1: true};
    const value2 = {value2: true};

    testState.compareBy('strict');
    testState.tap(() => ++counter);

    setTimeout(() => {
      testState.set(value1);
      TestBed.flushEffects();
      setTimeout(() => {
        testState.set(value2);
        TestBed.flushEffects();
        setTimeout(() => {
          testState.set(value2);
          TestBed.flushEffects();
          setTimeout(() => {
            expect(counter).toBe(3);
            done();
          });
        });
      });
    });
  });

  it('Strict comparison: the equal value is emitted', done => {
    let counter = 0;
    const value1 = {value1: true};
    const value21 = {value2: true};
    const value22 = {value2: true};

    testState.compareBy('strict');
    testState.tap(() => ++counter);

    setTimeout(() => {
      testState.set(value1);
      TestBed.flushEffects();
      setTimeout(() => {
        testState.set(value21);
        TestBed.flushEffects();
        setTimeout(() => {
          testState.set(value22);
          TestBed.flushEffects();
          setTimeout(() => {
            expect(counter).toBe(4);
            done();
          });
        });
      });
    });
  });

  it('Equals comparison: the same value is not emitted', done => {
    let counter = 0;
    const value1 = {value1: true};
    const value2 = {value2: true};

    testState.compareBy('equals');
    testState.tap(() => ++counter);

    setTimeout(() => {
      testState.set(value1);
      TestBed.flushEffects();
      setTimeout(() => {
        testState.set(value2);
        TestBed.flushEffects();
        setTimeout(() => {
          testState.set(value2);
          TestBed.flushEffects();
          setTimeout(() => {
            expect(counter).toBe(3);
            done();
          });
        });
      });
    });
  });

  it('Equals comparison: the equal value is not emitted', done => {
    let counter = 0;
    const value1 = {value1: true};
    const value21 = {value2: true};
    const value22 = {value2: true};

    testState.compareBy('equals');
    testState.tap(() => ++counter);

    setTimeout(() => {
      testState.set(value1);
      TestBed.flushEffects();
      setTimeout(() => {
        testState.set(value21);
        TestBed.flushEffects();
        setTimeout(() => {
          testState.set(value22);
          TestBed.flushEffects();
          setTimeout(() => {
            expect(counter).toBe(3);
            done();
          });
        });
      });
    });
  });

  it('Custom comparison: the same value is not emitted', done => {
    let counter = 0;
    const value1 = {value1: true};
    const value2 = {value2: true};

    testState.compareBy((a, b) => a.value2 && b.value2);
    testState.tap(() => ++counter);

    setTimeout(() => {
      testState.set(value1);
      TestBed.flushEffects();
      setTimeout(() => {
        testState.set(value2);
        TestBed.flushEffects();
        setTimeout(() => {
          testState.set(value2);
          TestBed.flushEffects();
          setTimeout(() => {
            expect(counter).toBe(3);
            done();
          });
        });
      });
    });
  });

  it('Custom comparison: the same value is emitted', done => {
    let counter = 0;
    const value1 = {value1: true};
    const value2 = {value2: true};

    testState.compareBy(() => false);
    testState.tap(() => ++counter);

    setTimeout(() => {
      testState.set(value1);
      TestBed.flushEffects();
      setTimeout(() => {
        testState.set(value2);
        TestBed.flushEffects();
        setTimeout(() => {
          testState.set(value2);
          TestBed.flushEffects();
          setTimeout(() => {
            expect(counter).toBe(4);
            done();
          });
        });
      });
    });
  });
});
