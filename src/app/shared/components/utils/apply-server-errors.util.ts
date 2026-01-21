import { FormGroup } from '@angular/forms';

export function applyServerErrors(
  form: FormGroup,
  fieldErrors: Record<string, string> | undefined
): void {
  if (!fieldErrors) return;

  Object.keys(fieldErrors).forEach(field => {
    const control = form.get(field);
    if (!control) return;

    const existingErrors = control.errors ?? {};

    control.setErrors({
      ...existingErrors,
      serverError: fieldErrors[field]
    });

    control.markAsTouched();
  });
}
