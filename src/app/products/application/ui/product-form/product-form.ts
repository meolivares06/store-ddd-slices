import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label for="name">Name</label>
        <input id="name" formControlName="name" />
      </div>
      <div>
        <label for="price">Price</label>
        <input id="price" type="number" formControlName="price" />
      </div>
      <button type="submit" [disabled]="form.invalid">Save</button>
    </form>
  `,
})
export class ProductForm {
  save = output<{ name: string; price: number }>();

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    price: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0.01)] }),
  });

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.getRawValue());
    }
  }
}
