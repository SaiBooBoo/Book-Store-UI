import { AbstractControl } from "@angular/forms";

export function noWhitespaceValidator(control: AbstractControl) {
    if (typeof control.value === 'string' && control.value.trim().length === 0) {
        return { whitespace: true };
    }
    return null;
}