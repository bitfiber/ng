import {FormControl, FormGroup} from '@angular/forms';

import {equals} from '@bitfiber/utils';

import {FormSource, formSource} from '../../';

interface FormValue {
  itemId: number;
  search: string;
}

describe('@bitfiber/ng/rx/formSource', () => {
  let source: FormSource<FormValue>;
  let formGroup: FormGroup<{
    itemId: FormControl<number>;
    search: FormControl<string>;
  }>;

  beforeEach(() => {
    formGroup = new FormGroup({
      itemId: new FormControl(1, {nonNullable: true}),
      search: new FormControl('', {nonNullable: true}),
    });

    source = formSource<FormValue>(formGroup as any);
  });

  it('Returns an initial value', () => {
    expect(source.get()).toEqual({itemId: 1, search: ''});
    expect(formGroup.value).toEqual({itemId: 1, search: ''});
  });

  it('Sets a value', () => {
    source.set({itemId: 1, search: 'phone'});
    expect(source.get()).toEqual({itemId: 1, search: 'phone'});
    expect(formGroup.value).toEqual({itemId: 1, search: 'phone'});
  });

  it('Sets a value through the form', () => {
    formGroup.setValue({itemId: 7, search: 'phone'});
    expect(source.get()).toEqual({itemId: 7, search: 'phone'});
  });

  it('Resets a value to an initial value', () => {
    source.set({itemId: 7, search: 'phone'});
    source.remove();
    expect(source.get()).toEqual({itemId: 1, search: ''});
    expect(formGroup.value).toEqual({itemId: 1, search: ''});
  });

  it('Resets a value through the form', () => {
    source.set({itemId: 7, search: 'phone'});
    formGroup.reset();
    expect(source.get()).toEqual({itemId: 1, search: ''});
  });

  it('Source emits a value', done => {
    const result: FormValue[] = [];
    const reference = [{itemId: 1, search: ''}, {itemId: 7, search: 'phone'}];
    source.$.subscribe(v => {
      result.push(v);
      if (equals(result, reference)) {
        expect(result).toEqual(reference);
        done();
      }
    });
    source.set({itemId: 7, search: 'phone'});
  });

  it('Form emits a value', done => {
    const result: Partial<FormValue>[] = [];
    const reference = [{itemId: 7, search: 'phone'}];
    formGroup.valueChanges.subscribe(v => {
      result.push(v);
      if (equals(result, reference)) {
        expect(result).toEqual(reference);
        done();
      }
    });
    source.set({itemId: 7, search: 'phone'});
  });
});
