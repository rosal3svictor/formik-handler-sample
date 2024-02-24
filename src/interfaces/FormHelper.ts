import { type AnyObject, type ObjectSchema } from 'yup'

import type { UseFormReturn } from '@interfaces'
import type { FormikValues } from 'formik'

/**
 * Represents the global state assigned to a form instance.
 *
 * @typeParam T - The type of form values that the form deals with.
 */
export interface FormContext<T extends FormikValues> {
  /**
   * The form handler object returned from the `useForm` hook.
   *
   * It provides access to form-related functions and data.
   */
  formHandler: UseFormReturn<T>

  /**
   * The mode of the form, indicating whether it is in 'create' or 'update'.
   */
  mode: FormMode
}

/**
 * Represents the allowed forms mode, which can be either 'create' or 'update'.
 */
export type FormMode = 'create' | 'update'

/**
 * Represents the return type of a custom hook that provides form context and
 * utility functions.
 *
 * @typeParam T - The type of the values used in the form.
 */
export interface UseFormHelperReturn<T extends FormikValues> {
  /**
   * The initial values for the form fields.
   */
  initialValues: T

  /**
   * Callback function triggered when the form is submitted successfully.
   * @param data - The form data submitted.
   */
  onSubmit: (data: T) => void

  /**
   * The validation schema for form validation using Yup.
   */
  validationSchema: ObjectSchema<T & AnyObject>

  /**
   * The form handler object that provides form-related functions and data.
   */
  formHandler: UseFormReturn<T>

  /**
   * The context value for the form component.
   *
   * @remarks
   * The context value contains the form handler and the mode of the form.
   */
  contextValue: FormContext<T>
}
