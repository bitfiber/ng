import {FormControl} from '@angular/forms';

import {formSource, FormSource, SignalStateType} from '../../../';
import {createStore} from './test-signal-store';

describe('@bitfiber/ng/rx/signalState/formSource', () => {
  let testControl: FormControl<string | null>;
  let testSource: FormSource<string | null>;
  let testState: SignalStateType<string | null>;

  beforeEach(() => {
    testControl = new FormControl<string | null>(null);
    testSource = formSource<string | null>(testControl);
    testState = createStore<string | null>(null).testState;
  });

  it('State is null if state and source is null', done => {
    testState.connect(testSource);
    setTimeout(() => {
      expect(testState.get()).toBeNull();
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

  it('State receives a source value if source is null', done => {
    testState.set('value1');
    setTimeout(() => {
      testState.connect(testSource);
      setTimeout(() => {
        expect(testState.get()).toBeNull();
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
