import {delay, of} from 'rxjs';
import {emitter} from '@bitfiber/rx';

import {SignalStateType} from '../../../';
import {createStore} from './test-signal-store';

describe('@bitfiber/ng/rx/signalState/select', () => {
  let testState: SignalStateType<string>;
  let stringState: SignalStateType<string>;
  let numberState: SignalStateType<number>;

  beforeEach(() => {
    const store = createStore('initialValue', 'initialValue2');
    testState = store.testState;
    stringState = store.stringState;
    numberState = store.numberState;
  });

  it('State selects value from emitters', done => {
    const someEmitter1 = emitter<string>();
    const someEmitter2 = emitter<number>();
    testState
      .select(someEmitter1, someEmitter2, (v1, v2) => v1 + v2)
      .tap(v => {
        if (v === 'value12') {
          expect(v).toBe('value12');
          done();
        }
      });
    someEmitter1.emit('value1');
    someEmitter2.emit(2);
  });

  it('State selects value from states', done => {
    testState
      .tap(v => {
        if (v === 'initialValue20') {
          expect(v).toBe('initialValue20');
          done();
        }
      })
      .select(stringState, numberState, (v1, v2) => v1 + v2);
  });

  it('State selects value from observables', done => {
    const observable1 = of('value1').pipe(delay(30));
    const observable2 = of(2).pipe(delay(60));

    testState
      .tap(v => {
        if (v === 'value12') {
          expect(v).toBe('value12');
          done();
        }
      })
      .select(observable1, observable2, (v1, v2) => v1 + v2);
  });

  it('State selects value from different sources', done => {
    const someEmitter = emitter<string>();
    const observable = of('value3').pipe(delay(30));

    testState
      .tap(v => {
        if (v === 'initialValue2value3value4') {
          expect(v).toBe('initialValue2value3value4');
          done();
        }
      })
      .select(stringState, observable, someEmitter, (v1, v2, v3) => v1 + v2 + v3);

    setTimeout(() => {
      someEmitter.emit('value4');
    }, 60);
  });
});
