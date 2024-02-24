import type { FormikValues, FormikErrors } from 'formik'

/**
 * Represents the state of a form field.
 */
export interface FieldState {
  /**
   * Indicates if the field is invalid (has validation errors).
   */
  invalid: boolean

  /**
   * The validation error message for the field (if any).
   */
  error: string | undefined
}

/**
 * Represents the overall state of a form.
 */
export interface FormState {
  /**
   * The initial values of the form.
   */
  initialValues: FormikValues

  /**
   * The current values of the form.
   */
  currentState: FormikValues

  /**
   * Indicates if the form is valid (true if there are no validation errors).
   */
  isValid: boolean

  /**
   * The validation errors for each field.
   */
  errors: FormikErrors<FormikValues>

  /**
   * Indicates if the form has been updated (true if the values have changed
   * from initial values).
   */
  hasBeenUpdated: boolean
}

/**
 * Represents the state of a form in debug mode.
 *
 * This interface provides the same properties as `FormState` for debugging
 * purposes.
 */
export type DebugModeState = FormState
