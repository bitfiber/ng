import {Injectable} from '@angular/core';
import {TestBed} from '@angular/core/testing';

import {delay, of, switchMap, throwError} from 'rxjs';
import {Emitter, transmit} from '@bitfiber/rx';

import {asyncSignalGroup, AsyncSignalGroup, NgStore, SignalState} from '../../';

@Injectable()
class TestAsyncStore extends NgStore {
  valueCounter = 0;
  testGroup = asyncSignalGroup<string, number, number>((testGroup, {launch}) => {
    launch.effect(
      switchMap(req => (req === 'error'
        ? throwError(() => new Error())
        : of(++this.valueCounter)).pipe(
        delay(30),
        transmit(testGroup),
      )),
    );
  }, 0);
}

describe('@bitfiber/ng/rx/asyncSignalGroup', () => {
  let store: TestAsyncStore;
  let testGroup: AsyncSignalGroup<string, number, number>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestAsyncStore],
    });
    store = TestBed.inject(TestAsyncStore);
    TestBed.flushEffects();
    store.unregisterOnDestroy();
    testGroup = store.testGroup;
  });

  it('Group has all nested emitters', () => {
    expect(testGroup.launch instanceof Emitter).toBeTruthy();
    expect(testGroup.success instanceof Emitter).toBeTruthy();
    expect(testGroup.fail instanceof Emitter).toBeTruthy();
    expect(testGroup.finish instanceof Emitter).toBeTruthy();
    expect(testGroup.state instanceof SignalState).toBeTruthy();
  });

  it('Nested emitters are not initialized', () => {
    expect(testGroup.launch.isInitialized()).toBeFalsy();
    expect(testGroup.success.isInitialized()).toBeFalsy();
    expect(testGroup.fail.isInitialized()).toBeFalsy();
    expect(testGroup.finish.isInitialized()).toBeFalsy();
    expect(testGroup.state.isInitialized()).toBeFalsy();
  });

  it('Group initializes all nested emitters', () => {
    testGroup.initialize();
    expect(testGroup.launch.isInitialized()).toBeTruthy();
    expect(testGroup.success.isInitialized()).toBeTruthy();
    expect(testGroup.fail.isInitialized()).toBeTruthy();
    expect(testGroup.finish.isInitialized()).toBeTruthy();
    expect(testGroup.state.isInitialized()).toBeTruthy();
  });

  it('Group completes all nested emitters', () => {
    testGroup.complete();
    expect(testGroup.launch.isCompleted()).toBeTruthy();
    expect(testGroup.success.isCompleted()).toBeTruthy();
    expect(testGroup.fail.isCompleted()).toBeTruthy();
    expect(testGroup.finish.isCompleted()).toBeTruthy();
    expect(testGroup.state.isCompleted()).toBeTruthy();
  });

  it('Returns fallback value if the launch fails', done => {
    testGroup.initialize();

    testGroup.success.tap(data => {
      expect(data).toBe(0);

      setTimeout(() => {
        expect(testGroup.state()).toEqual({
          failCounter: 1,
          successCounter: 0,
          inProgress: false,
          successful: false,
          failed: true,
        });
        done();
      }, 30);
    });

    setTimeout(() => {
      testGroup.launch.emit('error');
    }, 30);
  });

  it('Returns correct data if the launch is successful', done => {
    testGroup.initialize();

    testGroup.success.tap(data => {
      expect(data).toBe(1);

      setTimeout(() => {
        expect(testGroup.state()).toEqual({
          failCounter: 0,
          successCounter: 1,
          inProgress: false,
          successful: true,
          failed: false,
        });
        done();
      }, 30);
    });

    setTimeout(() => {
      testGroup.launch.emit('data');
    }, 30);
  });

  it('The finish emitter will emit once if the launch is successful', done => {
    let counter = 0;
    testGroup.initialize();

    testGroup.finish.tap(() => {
      ++counter;
      setTimeout(() => {
        expect(counter).toBe(1);
        done();
      }, 30);
    });

    setTimeout(() => {
      testGroup.launch.emit('data');
    }, 30);
  });

  it('The finish emitter will emit once if the launch fails', done => {
    let counter = 0;
    testGroup.initialize();

    testGroup.finish.tap(() => {
      ++counter;
      setTimeout(() => {
        expect(counter).toBe(1);
        done();
      }, 30);
    });

    setTimeout(() => {
      testGroup.launch.emit('error');
    }, 30);
  });

  it('The cached group emits only the first time if lifetime is 0', done => {
    let launchCounter = 0;
    let successCounter = 0;
    testGroup
      .useCache(0, 1)
      .initialize();

    testGroup.launch.tap(() => {
      ++launchCounter;
    });

    testGroup.success.tap(v => {
      ++successCounter;
      if (successCounter === 3) {
        expect(v).toBe(1);
        expect(launchCounter).toBe(1);
        expect(successCounter).toBe(3);
        done();
      }
    });

    setTimeout(() => {
      testGroup.launch.emit('data');
      setTimeout(() => {
        testGroup.launch.emit('data');
        setTimeout(() => {
          testGroup.launch.emit('data');
        }, 30);
      }, 30);
    }, 30);
  });

  it('The cached group emits only the first time if lifetime is not exceeded', done => {
    let launchCounter = 0;
    let successCounter = 0;
    testGroup
      .useCache(1, 1)
      .initialize();

    testGroup.launch.tap(() => {
      ++launchCounter;
    });

    testGroup.success.tap(v => {
      ++successCounter;
      if (successCounter === 3) {
        expect(v).toBe(1);
        expect(launchCounter).toBe(1);
        expect(successCounter).toBe(3);
        done();
      }
    });

    setTimeout(() => {
      testGroup.launch.emit('data');
      setTimeout(() => {
        testGroup.launch.emit('data');
        setTimeout(() => {
          testGroup.launch.emit('data');
        }, 30);
      }, 30);
    }, 30);
  });

  it('The cached group emits every time when lifetime is exceeded', done => {
    let launchCounter = 0;
    let successCounter = 0;
    testGroup
      .useCache(0.01, 1)
      .initialize();

    testGroup.launch.tap(() => {
      ++launchCounter;
    });

    testGroup.success.tap(v => {
      ++successCounter;
      if (successCounter === 2) {
        expect(v).toBe(2);
        expect(launchCounter).toBe(2);
        expect(successCounter).toBe(2);
        done();
      }
    });

    setTimeout(() => {
      testGroup.launch.emit('data');
      setTimeout(() => {
        testGroup.launch.emit('data');
      }, 100);
    }, 30);
  });

  it('The cached group emits only the first time for different requests', done => {
    let launchCounter = 0;
    let successCounter = 0;
    testGroup
      .useCache(0, 2)
      .initialize();

    testGroup.launch.tap(() => {
      ++launchCounter;
    });

    testGroup.success.tap(v => {
      ++successCounter;
      if (successCounter === 4) {
        expect(v).toBe(2);
        expect(launchCounter).toBe(2);
        expect(successCounter).toBe(4);
        done();
      }
    });

    setTimeout(() => {
      testGroup.launch.emit('data1');
      setTimeout(() => {
        testGroup.launch.emit('data2');
        setTimeout(() => {
          testGroup.launch.emit('data1');
          setTimeout(() => {
            testGroup.launch.emit('data2');
          }, 30);
        }, 30);
      }, 30);
    }, 30);
  });

  it('The cached group emits only the first time if the cache handler returns true', done => {
    let launchCounter = 0;
    let successCounter = 0;
    testGroup
      .useCache(() => true, 1)
      .initialize();

    testGroup.launch.tap(() => {
      ++launchCounter;
    });

    testGroup.success.tap(v => {
      ++successCounter;
      if (successCounter === 3) {
        expect(v).toBe(1);
        expect(launchCounter).toBe(1);
        expect(successCounter).toBe(3);
        done();
      }
    });

    setTimeout(() => {
      testGroup.launch.emit('data');
      setTimeout(() => {
        testGroup.launch.emit('data');
        setTimeout(() => {
          testGroup.launch.emit('data');
        }, 30);
      }, 30);
    }, 30);
  });

  it('The cached group emits every time if the cache handler returns false', done => {
    let launchCounter = 0;
    let successCounter = 0;
    testGroup
      .useCache(() => false, 1)
      .initialize();

    testGroup.launch.tap(() => {
      ++launchCounter;
    });

    testGroup.success.tap(v => {
      ++successCounter;
      if (successCounter === 3) {
        expect(v).toBe(3);
        expect(launchCounter).toBe(3);
        expect(successCounter).toBe(3);
        done();
      }
    });

    setTimeout(() => {
      testGroup.launch.emit('data');
      setTimeout(() => {
        testGroup.launch.emit('data');
        setTimeout(() => {
          testGroup.launch.emit('data');
        }, 30);
      }, 30);
    }, 30);
  });

  it('The cached group removes the previous cache if the cache size is exceeded', done => {
    let launchCounter = 0;
    let successCounter = 0;
    testGroup
      .useCache(0, 1)
      .initialize();

    testGroup.launch.tap(() => {
      ++launchCounter;
    });

    testGroup.success.tap(v => {
      ++successCounter;
      if (successCounter === 4) {
        expect(v).toBe(4);
        expect(launchCounter).toBe(4);
        expect(successCounter).toBe(4);
        done();
      }
    });

    setTimeout(() => {
      testGroup.launch.emit('data1');
      setTimeout(() => {
        testGroup.launch.emit('data2');
        setTimeout(() => {
          testGroup.launch.emit('data1');
          setTimeout(() => {
            testGroup.launch.emit('data2');
          }, 30);
        }, 30);
      }, 30);
    }, 30);
  });
});
