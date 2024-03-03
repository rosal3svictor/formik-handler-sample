import type { ObjectSchema, AnyObject } from 'yup'
import type { useFormHandler } from 'hooks'
import type { FormikHelpers, FormikValues } from 'formik'

/**
 * Represents a general form instance definition.
 *
 * @typeParam T - The type of form values.
 */
export interface FormHandlerProps<T> {
  /**
   * The initial values for the form.
   */
  initialValues: T

  /**
   * A callback function to handle form submission.
   *
   * @param values - The current form values.
   *
   * @param formikHelpers - A set of Formik utility functions for managing the
   * form state.
   *
   * @returns If the return type is `void`, the submission is synchronous. If it
   * returns a `Promise`, the submission is asynchronous.
   */
  onSubmitHandler: (
    values: T,
    formikHelpers: FormikHelpers<T>,
  ) => void | Promise<unknown>

  /**
   * The validation schema to apply to the form values.
   *
   * @remarks
   * This should be an instance of `ObjectSchema` from the `yup` library, which
   * is a powerful and flexible schema validation library.
   */
  validationSchema: ObjectSchema<T & AnyObject>
}

/**
 * Represents properties for assigning a value to a registered field in a form.
 */
export interface SetValueProps {
  /**
   * The name of the field to assign the value to.
   */
  field: string

  /**
   * The value to assign to the field.
   */
  value: unknown

  /**
   * Specifies whether the field should be validated after the value is set.
   * If `true`, the validation is triggered; otherwise, it's skipped.
   *
   * @defaultValue `false`
   */
  shouldValidate?: boolean
}

/**
 * Represents the return type of the `useFormHandler` hook from the `@hooks`
 * module.
 *
 * @typeParam T - The type of form values.
 */
export type UseFormReturn<T extends FormikValues> = ReturnType<
  typeof useFormHandler<T>
>

/**
 * Represents the props for enabling debug mode in the UI.
 */
export interface FormDebugOption {
  /**
   * A boolean value indicating whether the debug mode is enabled or not.
   */
  debugMode?: boolean
}
