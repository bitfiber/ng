import {delay, of} from 'rxjs';
import {emitter} from '@bitfiber/rx';

import {SignalStateType} from '../../../';
import {createStore} from './test-signal-store';

describe('@bitfiber/ng/rx/signalState/receive', () => {
  let testState: SignalStateType<string>;
  let stringState: SignalStateType<string>;
  let numberState: SignalStateType<number>;

  beforeEach(() => {
    const store = createStore('initialValue', 'initialValue2');
    testState = store.testState;
    stringState = store.stringState;
    numberState = store.numberState;
  });

  it('State receives value from emitter', done => {
    const someEmitter = emitter<string>();
    testState
      .receive(someEmitter)
      .tap(v => {
        if (v === 'value1') {
          expect(v).toBe('value1');
          done();
        }
      });
    someEmitter.emit('value1');
  });

  it('State receives value from emitter of another type', done => {
    const someEmitter = emitter<number>();
    testState
      .receive(someEmitter, v => `value${v}`)
      .tap(v => {
        if (v === 'value1') {
          expect(v).toBe('value1');
          done();
        }
      });
    someEmitter.emit(1);
  });

  it('State receives value from state', done => {
    testState
      .receive(stringState)
      .tap(v => {
        if (v === 'value1') {
          expect(v).toBe('value1');
          done();
        }
      });
    stringState.set('value1');
  });

  it('State receives initial value from state', done => {
    testState
      .tap(v => {
        if (v === 'initialValue2') {
          expect(v).toBe('initialValue2');
          done();
        }
      })
      .receive(stringState);
  });

  it('State receives value from state of another type', done => {
    testState
      .receive(numberState, v => `value${v}`)
      .tap(v => {
        if (v === 'value1') {
          expect(v).toBe('value1');
          done();
        }
      });
    numberState.set(1);
  });

  it('State receives value from an observable', done => {
    const observable = of('value1');
    testState
      .tap(v => {
        if (v === 'value1') {
          expect(v).toBe('value1');
          done();
        }
      })
      .receive(observable);
  });

  it('State receives value from an observable of another type', done => {
    const observable = of(1);
    testState
      .tap(v => {
        if (v === 'value1') {
          expect(v).toBe('value1');
          done();
        }
      })
      .receive(observable, v => `value${v}`);
  });

  it('State receives value from multiple sources', done => {
    const observable = of('value3').pipe(delay(30));
    const someEmitter = emitter<string>();
    const result: string[] = [];
    testState
      .tap(v => {
        result.push(v);
        if (result.length === 4) {
          expect(result).toEqual(['initialValue', 'initialValue2', 'value3', 'value4']);
          done();
        }
      })
      .receive(observable, someEmitter, stringState);

    setTimeout(() => {
      someEmitter.emit('value4');
    }, 60);
  });
});
