import {AbstractControl} from '@angular/forms';

import {Observable} from 'rxjs';
import {DataSource, startWithDefined} from '@bitfiber/rx';

/**
 * Creates an instance of `FormSource`, which provides streamlined access to the data
 * in an Angular form. It can handle any instance of `AbstractControl`, such as `FormControl`,
 * `FormGroup`, or `FormArray`
 *
 * @template T - The type of data managed by the Angular form
 *
 * @param form - An instance of `AbstractControl` that can be a `FormControl`, `FormGroup`,
 * or `FormArray`
 */
export function formSource<T>(form: AbstractControl<T>): FormSource<T> {
  return new FormSource<T>(form);
}

/**
 * Implements the `DataSource` interface, providing a way to interact with the data
 * stored in an Angular form. This class offers functionality to retrieve, set, observe,
 * and remove data from any `AbstractControl`, including `FormControl`, `FormGroup`, and `FormArray`
 *
 * @template T - The type of data managed by the Angular form
 */
export class FormSource<T> implements DataSource<T> {
  /**
   * Allows subscribers to reactively observe changes or updates to the data in an Angular form
   */
  readonly $: Observable<T>;

  /**
   * An instance of `AbstractControl` that can be a `FormControl`, `FormGroup`, or `FormArray`
   */
  protected readonly form: AbstractControl<T>;

  /**
   * Creates an instance that has access to only certain data stored under a specific key
   * @param form - An instance of `AbstractControl` that can be a `FormControl`, `FormGroup`,
   * or `FormArray`
   */
  constructor(form: AbstractControl<T>) {
    this.form = form;
    this.$ = this.form.valueChanges.pipe(startWithDefined(() => this.get()));
  }

  /**
   * Retrieves the current value of the form control, form group, or form array
   */
  get(): T {
    return this.form.value;
  }

  /**
   * Sets a new value for the form control, form group, or form array
   * @param value - A new form value
   */
  set(value: T): void {
    this.form.patchValue(value);
  }

  /**
   * Resets the current value of the form control, form group, or form array back
   * to its initial state
   */
  remove(): void {
    this.form.reset();
  }
}
