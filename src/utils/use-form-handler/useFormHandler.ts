import { useFormik, type FormikValues, type FormikErrors } from 'formik'
import { type FormHandlerProps, type SetValueProps } from '@interfaces'
import { isEqual } from 'lodash'
import { useState } from 'react'

import type { DebugModeState, FormState, FieldState } from './interfaces'

/**
 * Custom hook to manage a form
 *
 * @see
 *  [useFormik](https://formik.org/docs/api/useFormik)
 *
 * @returns Methods exposing individual functions to manage the form state.
 *
 * @example
 * ```Text
 * In order to make an implementation of this hook, make sure to follow these
 * steps:
 * ```
 *
 * ```Text
 *
 * 1. Create a hook which will serve as a central place to define:
 *     - Initial values
 *     - Mode (create or update, and the logic driving this behaviour)
 *     - ValidationSchema
 *     - onSubmit Callback
 *     - Current value of the Form Context
 *     - Form Handler Instance
 *
 * Make sure to import the hook 'useFormHandler' in it so you can create a new
 * form instance, which will be expecting the 'initialValues',
 * 'validationSchema' and 'onSubmit' callback.
 * ```
 *
 *```TSX
 *
 * import { useState, useMemo } from 'react';
 * import * as yup from 'yup';
 * import { useFormHandler } from './path/to/utils';
 * import type {
 *  DemoFormSchema,
 *  UseDemoFormHelperReturn,
 *  FormMode,
 * } from './path/to/interfaces';
 *
 * export function useDemoFormHelper(): UseDemoFormHelperReturn<DemoFormSchema> {
 *   const [mode] = useState<FormMode>('create');
 *   const initialValues: Record<keyof DemoFormSchema, any> = {
 *      name: '',
 *      lastName: '',
 *    };
 *
 *    const validationSchema = yup
 *       .object()
 *       .shape<Record<keyof DemoFormSchema, yup.Schema>>({
 *         name: yup.string().required('This field is required'),
 *         lastName: yup.string().required('This field is required'),
 *       });
 *
 *    const onSubmit = (values: DemoFormSchema) => {
 *      console.log('Data ', values);
 *    };
 *
 *    const formHandler = useFormHandler<DemoFormSchema>({
 *      initialValues,
 *      validationSchema,
 *      onSubmitHandler: onSubmit,
 *    });
 *
 *    // IMPORTANT: This prevents non-stable values (i.e. object identities)
 *    // from being used as a value for Context.Provider.
 *    const contextValue = useMemo(
 *      () => ({
 *        formHandler,
 *        mode,
 *      }),
 *      [formHandler, mode],
 *    );
 *
 *   return { formHandler, contextValue };
 * }
 * ```
 *
 * ```Text
 *
 * 2. Since the internal form state will be handled by React Context API, it has
 * to expose the properties defined on FormContext<YourFormDefinition> (check
 * the type definition). This is a sample of how your context implementation
 * should look like:
 * ```
 *
 *```TSX
 *
 * import { useDemoFormHelper } from './path/to/useDemoFormHelper';
 * import { FormContent } from './path/to/FormContent';
 * import { DemoFormContext } from './path/to/context';
 *
 *
 * export const DemoForm: React.FC = () => {
 *   const { contextValue } = useDemoFormHelper();
 *
 *   return (
 *     <DemoFormContext.Provider value={contextValue}>
 *       <FormContent debugMode />
 *     </DemoFormContext.Provider>
 *   );
 * };
 * ```
 *
 * ```Text
 *
 * 3. Make usage of the custon hook created on step 1 to access the formHandler
 * and to be able to interact with it
 * ```
 * ```TSX
 *
 * import { TextField } from './path/to/components';
 * import { DebugModeUI } from './path/to/utils';
 * import { useDemoFormContext } from './path/to/useDemoFormContext';
 * import { FormContainer } from './path/to/styles';
 * import type { DebugModeUIProps } from './path/to/interfaces';
 *
 * export const FormContent = ({ debugMode = false }: DebugModeUIProps) => {
 *   const { formHandler } = useDemoFormContext();
 *
 *   return (
 *       <FormContainer data-testid="form-container">
 *          <TextField
 *              data-testid="name-input"
 *              name="name"
 *              label="Name"
 *              formhandler={formHandler}
 *          />
 *          <TextField
 *              data-testid="lastName-input"
 *              name="lastName"
 *              label="Last Name"
 *              formhandler={formHandler}
 *          />
 *          <button
 *              type="button"
 *              onClick={formHandler.onSubmitHandler}
 *              disabled={formHandler.formState().isValid}
 *          >
 *              Submit
 *          </button>
 *       </FormContainer>
 *   )
 * };
 * ```
 *
 * ```Text
 *
 * SUMMARY
 * In order to comply with the pattern, you will need to have:
 *    - Hook to define the methods, logic to manage the form. You have to
 *      implement 'useFormHandler' in this file to create a new form instance so
 *      the mthods to manage the form are exposed.
 *    - Create the API Context, to provide the local state
 *      to the form components and sub components (if it applies).
 *    - Implement the context to wrap the form component and the formHandler to
 *      interact with the input fields of it.
 *
 * NOTE
 * Before thinking of using custom hook, it is required to use the HOC
 * 'withBaseField' to enhance each input field expected to be used in the form
 * component. It will inject an optional prop called 'formhandler' to manage the
 * form state, through the methods returned from the `useFormHandler` hook.
 *
 * The concern of updating the input value in the form state, validating,
 * resetting it, etc. will be taken away from you, and will be done
 * automatically by this HOC.
 * ```
 */
export function useFormHandler<T extends FormikValues>(
  props: FormHandlerProps<T>
) {
  /**
   * Formik, by default, display error messages even when the field is untouched
   * (which is not ideal)
   *
   * With this piece of state we provide a workaround for that unwanted
   * behaviour
   */
  const [manualValTriggered, setManualValTriggered] = useState<boolean>(false)

  /**
   * The Formik instance for managing form state and validation.
   *
   * @typeParam T - The type of the form values.
   *
   * @see [Official Docs - API Reference](https://formik.org/docs/api/formik)
   */
  const formInstance = useFormik<T>({
    initialValues: props.initialValues,
    validationSchema: props.validationSchema,
    onSubmit: props.onSubmitHandler,
    enableReinitialize: true
  })

  /**
   * Sets the value of a form field in the form instance.
   *
   * @param  args - The arguments for setting the form field value.
   *
   * @returns  A Promise that resolves after setting the value.
   */
  const setFormValue = async (args: SetValueProps) => {
    await formInstance.setFieldValue(
      args.field,
      args.value,
      args.shouldValidate ?? true
    )

    /**
     * This is done so that when it is required to show a validation error
     * we can be sure that the field has been touched (For some reason we have
     * to set this state manually, formik doesn't do it on its own)
     *
     * Reference: https://github.com/jaredpalmer/formik/issues/955
     */
    await formInstance.setFieldTouched(args.field, true, false)
  }

  /**
   * Get the current state of the form instance.
   *
   * @returns An object representing the current form state.
   */
  const formState = (): FormState => ({
    initialValues: formInstance.initialValues,
    currentState: formInstance.values,
    isValid: !formInstance.isValid,
    errors: formInstance.errors,
    hasBeenUpdated: !isEqual(formInstance.initialValues, formInstance.values)
  })

  /**
   * Get the state of a specific form field in the form instance.
   *
   * @param  field - The name of the form field.
   *
   * @returns An object representing the state of the specified form field.
   */
  const fieldState = (field: string): FieldState => {
    if (!manualValTriggered) {
      const fieldIsVisitedAndInvalid =
        Boolean(formInstance.touched[field]) && field in formInstance.errors

      return {
        invalid: fieldIsVisitedAndInvalid,
        // @ts-expect-error:  Type 'string[]' is not assignable to type 'string'
        error: fieldIsVisitedAndInvalid ? formInstance.errors[field] : ''
      }
    }

    return {
      invalid: field in formInstance.errors,
      // @ts-expect-error:  Type 'string[]' is not assignable to type 'string'
      error: formInstance.errors[field]
    }
  }

  /**
   * This function can manually clear errors in the form.
   */
  const clearErrors = (input?: FormikErrors<Partial<T>>) => {
    if (typeof input === 'string') formInstance.setFieldError(input, '')
    if (typeof input === 'object') formInstance.setErrors(input)

    formInstance.setErrors({})
  }

  /**
   * Reset the form instance to its initial state.
   *
   * IMPORTANT: nextState should match the type T (FormikValues). In case they
   * are provided, they will be set as the current form values
   *
   * @param  nextState - (Optional) The state to reset the form to.
   */
  const resetForm = (nextState?: FormikValues): void => {
    clearErrors()
    /** Flag to determine data to be returned in method `fieldState` */
    setManualValTriggered(false)

    if (nextState !== undefined) {
      const { currentState } = formState()

      // @ts-expect-error: Type '{ [x: string]: any; }' is not assignable to
      // type 'T'.
      void formInstance.setValues({
        ...currentState,
        ...nextState
      })
      return
    }

    formInstance.resetForm(props.initialValues)
  }

  /**
   * Trigger form validation for the entire form instance or a specific field.
   *
   * @param  input - (Optional) The name of the field to validate. If not
   * provided, validates the entire form.
   *
   * @returns  A Promise that resolves after validation is performed.
   */
  const triggerValidation = async (input?: string): Promise<void> => {
    /** Flag to determine data to be returned in method `fieldState` */
    setManualValTriggered(true)

    if (input !== undefined) {
      await formInstance.validateField(input)
      return
    }

    await formInstance.validateForm()
  }

  /**
   * The default form submission handler for the form instance.
   *
   * @typeParam M - The type of the form values upon submission.
   *
   * @param data - The form values upon submission.
   */
  const onSubmitHandler = <M extends FormikValues>(data: M): void => {
    formInstance.handleSubmit()
  }

  /**
   * Get a debug snapshot of the current state of the form instance.
   *
   * @returns An object representing the debug snapshot of the current form
   * state.
   */
  const debugMode = (): DebugModeState => {
    const { initialValues, currentState, isValid, errors, hasBeenUpdated } =
      formState()

    return {
      initialValues,
      currentState,
      isValid: !isValid,
      errors,
      hasBeenUpdated
    }
  }

  return {
    setFormValue,
    formState,
    fieldState,
    resetForm,
    triggerValidation,
    onSubmitHandler,
    debugMode
  }
}
