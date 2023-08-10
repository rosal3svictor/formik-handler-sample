import type { BaseFieldProps } from '@interfaces';
import type { ChangeEvent, FocusEvent } from 'react';
import type { FormikValues } from 'formik';

/**
 * Enhances a given React component by providing form handling capabilities.
 *
 * It wraps the `WrappedComponent` with additional props such as `onChange`,
 * `onBlur`, `value`, `error`, and `helperText`.
 *
 * The form handling is powered by a `formhandler` instance implementing
 * specific methods.
 *
 * @param WrappedComponent - The React component to be enhanced with form
 * handling props.
 *
 * @typeParam T - The type of form values managed by the form handler.
 *
 * @returns The enhanced component with form handling props.
 */
export function withBaseField<T extends FormikValues>(
  WrappedComponent: React.FC<T>,
) {
  /**
   * The enhanced functional component with form handling capabilities.
   * 
   * @param props - Props to be passed to the enhanced component.
   * 
   * @returns JSX representing the enhanced component.
   */
  return function WithFormHandlerField(props: T & BaseFieldProps<T>) {
    const {
      formhandler,
      name,
      onChange: onChangeProp,
      onBlur: onBlurProp,
    } = props;

    /**
     * Handles the change event for the form field and updates the corresponding
     * form value through the `formhandler`.
     *
     * @param input - The change event triggered on the field.
     */
    const onChange = async (
      input: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      if (formhandler != null) {
        await formhandler.setFormValue({
          field: name,
          value: input.target.value,
        });
      }

      if (onChangeProp != null) {
        onChangeProp(input);
      }
    };

    /**
     * Handles the blur event for the form field and updates the corresponding
     * form value through the `formhandler`.
     *
     * @param input - The blur event triggered on the field.
     */
    const onBlur = async (
      input: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      if (formhandler != null) {
        await formhandler.setFormValue({
          field: name,
          value: input.target.value,
        });
      }

      if (onBlurProp != null) {
        onBlurProp(input);
      }
    };

    /**
     * Injects the additional props related to form handling to the
     * WrappedComponent.
     */
    return (
      <WrappedComponent
        {...props}
        onChange={onChange}
        onBlur={onBlur}
        value={formhandler?.formState().currentState[name]}
        error={formhandler?.fieldState(name).invalid}
        helperText={formhandler?.fieldState(name).error}
      />
    );
  };
}
