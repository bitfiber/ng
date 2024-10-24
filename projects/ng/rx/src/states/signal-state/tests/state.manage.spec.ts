import {delay, map, tap} from 'rxjs';
import {equals} from '@bitfiber/utils';

import {SignalStateType} from '../../../';
import {createStore} from './test-signal-store';

describe('@bitfiber/ng/rx/signalState/manage', () => {
  let testState: SignalStateType<string>;

  beforeEach(() => {
    testState = createStore('initialValue').testState;
  });

  it('State manages all own streams', done => {
    const reference = ['initialValue2', 'initialValue2', 'value12', 'value12'];
    const result: string[] = [];
    let passed = false;
    testState
      .manage(delay(30), map(v => `${v}2`))
      .tap(v => {
        result.push(v);
        if (!passed && equals(result, reference)) {
          passed = true;
          expect(result).toEqual(reference);
          done();
        }
      })
      .effect(tap(v => {
        result.push(v);
        if (!passed && equals(result, reference)) {
          passed = true;
          expect(result).toEqual(reference);
          done();
        }
      }));

    setTimeout(() => {
      testState.set('value1');
    }, 60);
  });
});
