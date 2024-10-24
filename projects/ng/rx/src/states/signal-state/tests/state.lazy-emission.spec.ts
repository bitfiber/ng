import {tap} from 'rxjs';

import {SignalStateType} from '../../../';
import {createStore} from './test-signal-store';

describe('@bitfiber/ng/rx/signalState/lazyEmission', () => {
  let testState: SignalStateType<string>;

  beforeEach(() => {
    testState = createStore<string>('initialValue').testState;
  });

  it('Does not emit an initial value to subscribers with lazy emission', done => {
    const result: string [] = [];

    testState
      .useLazyEmission()
      .tap(v => {
        result.push(v);
      })
      .effect(tap(v => {
        result.push(v);
      }))
      .$.subscribe(v => {
        result.push(v);
      });

    setTimeout(() => {
      testState.set('value1');
      setTimeout(() => {
        expect(result).toEqual(['value1', 'value1', 'value1']);
        done();
      }, 30);
    }, 30);
  });

  it('Does not emit an initial value to subscribers with one-time lazy emission', done => {
    const result: string [] = [];

    testState
      .tap(v => {
        result.push(v);
      })
      .useLazyEmissionOnce()
      .effect(tap(v => {
        result.push(`${v}once`);
      }))
      .$.subscribe(v => {
        result.push(v);
      });

    setTimeout(() => {
      testState.set('value1');
      setTimeout(() => {
        expect(result).toEqual(['initialValue', 'initialValue', 'value1', 'value1once', 'value1']);
        done();
      }, 30);
    }, 30);
  });
});
