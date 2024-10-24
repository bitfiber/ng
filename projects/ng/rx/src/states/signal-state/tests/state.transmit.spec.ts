import {Subject} from 'rxjs';
import {emitter} from '@bitfiber/rx';

import {SignalStateType} from '../../../';
import {createStore} from './test-signal-store';

describe('@bitfiber/ng/rx/signalState/transmit', () => {
  let testState: SignalStateType<string>;
  let stringState: SignalStateType<string>;
  let numberState: SignalStateType<number>;

  beforeEach(() => {
    const store = createStore('initialValue', 'initialValue2');
    testState = store.testState;
    stringState = store.stringState;
    numberState = store.numberState;
  });

  it('State transmits value to emitter', done => {
    const someEmitter = emitter<string>();
    testState.transmit(someEmitter);
    someEmitter.tap(v => {
      expect(v).toBe('value1');
      done();
    });
    testState.set('value1');
  });

  it('State transmits value to emitter of another type', done => {
    const someEmitter = emitter<number>();
    testState.transmit(someEmitter, v => Number(v));
    someEmitter.tap(v => {
      expect(v).toBe(1);
      done();
    });
    testState.set('1');
  });

  it('State transmits value to state', done => {
    testState.transmit(stringState);
    stringState.tap(v => {
      if (v === 'value1') {
        expect(v).toBe('value1');
        done();
      }
    });
    testState.set('value1');
  });

  it('State transmits value to state of another type', done => {
    testState.transmit(numberState, v => Number(v));
    numberState.tap(v => {
      if (v === 1) {
        expect(v).toBe(1);
        done();
      }
    });
    testState.set('1');
  });

  it('State transmits value to a subject', done => {
    const subject = new Subject<string>();
    testState.transmit(subject);
    subject.subscribe(v => {
      expect(v).toBe('value1');
      done();
    });
    testState.set('value1');
  });

  it('State transmits value to a subject of another type', done => {
    const subject = new Subject<number>();
    testState.transmit(subject, v => Number(v));
    subject.subscribe(v => {
      expect(v).toBe(1);
      done();
    });
    testState.set('1');
  });

  it('State transmits value to multiple sources', done => {
    const someEmitter = emitter<string>();
    const result: string[] = [];

    stringState.tap(v => {
      result.push(`${v}S`);
      if (result.length === 5) {
        expect(result).toEqual([
          'initialValue2S', 'initialValueE', 'initialValueS', 'value2E', 'value2S',
        ]);
        done();
      }
    });

    someEmitter.tap(v => {
      result.push(`${v}E`);
    });

    setTimeout(() => {
      testState.transmit(someEmitter, stringState);

      setTimeout(() => {
        testState.set('value2');
      });
    });
  });
});
