import {emitter} from '@bitfiber/rx';
import {Subject} from 'rxjs';

import {SignalStateType} from '../../../';
import {createStore} from './test-signal-store';

describe('@bitfiber/ng/rx/signalState/wait', () => {
  let testState: SignalStateType<string>;
  let stringState: SignalStateType<string>;
  let numberState: SignalStateType<number>;

  beforeEach(() => {
    const store = createStore('initialValue', 'initialValue2');
    testState = store.testState.useLazyEmission();
    stringState = store.stringState;
    numberState = store.numberState;
  });

  it('State waits for emitters and then emits once', done => {
    const someEmitter1 = emitter<string>();
    const someEmitter2 = emitter<number>();
    const result: string[] = [];

    testState
      .wait(someEmitter1, someEmitter2, () => 'resultValue')
      .tap(v => {
        result.push(v);
      });

    someEmitter1.emit('value1');
    someEmitter2.emit(1);
    setTimeout(() => {
      someEmitter1.emit('value2');
      someEmitter2.emit(2);
      setTimeout(() => {
        expect(result).toEqual(['resultValue']);
        done();
      }, 30);
    }, 30);
  });

  it('State waits for other states and then emits once', done => {
    const result: string[] = [];

    testState
      .tap(v => {
        result.push(v);
      })
      .wait(stringState, numberState, () => 'resultValue');

    stringState.set('value2');
    numberState.set(2);
    setTimeout(() => {
      stringState.set('value3');
      numberState.set(3);
      setTimeout(() => {
        expect(result).toEqual(['resultValue']);
        done();
      }, 30);
    }, 30);
  });

  it('State waits for observables and then emits once', done => {
    const subject1 = new Subject<string>();
    const subject2 = new Subject<number>();
    const result: string[] = [];

    testState
      .wait(subject1.asObservable(), subject2.asObservable(), () => 'resultValue')
      .tap(v => {
        result.push(v);
      });

    subject1.next('value1');
    subject2.next(1);
    setTimeout(() => {
      subject1.next('value2');
      subject2.next(2);
      setTimeout(() => {
        expect(result).toEqual(['resultValue']);
        done();
      }, 30);
    }, 30);
  });

  it('State waits for different sources and then emits once', done => {
    const subject = new Subject<string>();
    const someEmitter = emitter<string>();
    const result: string[] = [];

    testState
      .wait(subject, stringState, someEmitter, () => 'resultValue')
      .tap(v => {
        result.push(v);
      });

    subject.next('value1');
    stringState.set('value1');
    someEmitter.emit('value1');
    setTimeout(() => {
      subject.next('value2');
      stringState.set('value2');
      someEmitter.emit('value2');
      setTimeout(() => {
        expect(result).toEqual(['resultValue']);
        done();
      }, 30);
    }, 30);
  });
});
