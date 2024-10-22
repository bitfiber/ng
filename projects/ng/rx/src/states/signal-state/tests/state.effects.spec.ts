import {TestBed} from '@angular/core/testing';

import {tap} from 'rxjs';
import {equals} from '@bitfiber/utils';

import {SignalStateType} from '../../../';
import {createStore} from './test-signal-store';

describe('@bitfiber/ng/rx/signalState/effects', () => {
  const reference = ['initialValue', 'value1'];
  let testState: SignalStateType<string>;
  let result: string[] = [];
  let passed = false;

  beforeEach(() => {
    testState = createStore('initialValue').testState;
    result = [];
    passed = false;
  });

  it('State tap emits a value', done => {
    testState.tap(v => {
      result.push(v);
      if (!passed && equals(result, reference)) {
        passed = true;
        expect(result).toEqual(reference);
        done();
      }
    });
    testState.set('value1');
    TestBed.flushEffects();
  });

  it('State effect emits a value', done => {
    testState.effect(tap(v => {
      result.push(v);
      if (!passed && equals(result, reference)) {
        passed = true;
        expect(result).toEqual(reference);
        done();
      }
    }));
    testState.set('value1');
    TestBed.flushEffects();
  });

  it('State observable emits a value', done => {
    testState.$.subscribe(v => {
      result.push(v);
      if (!passed && equals(result, reference)) {
        passed = true;
        expect(result).toEqual(reference);
        done();
      }
    });
    testState.set('value1');
    TestBed.flushEffects();
  });
});
