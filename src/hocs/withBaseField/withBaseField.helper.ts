import { ChangeEvent, FocusEvent, useCallback, useState } from 'react';
import type { BaseFieldProps } from '@interfaces';
import { debounce } from 'lodash';
import { FormikValues } from 'formik';


/**
 * A hook for handling form field input with optional Formik integration.
 *
 * @typeparam T - The type of Formik values.
 * 
 * @param props - The properties to configure the form field.
 *
 * @returns An object containing handlers for `onChange` and `onBlur` events,
 * the current input value, and a method to set the initial value.
 */
export const useWithBaseFieldHelper = <T extends FormikValues,>(
    props: T & BaseFieldProps<T>
) => {
    const [value, setValue] = useState<string>('');

    /**
      * A debounced version of the `onChange` function.
      */
    const debouncedHandleChange = useCallback(
        debounce((input: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            props.formhandler && props.formhandler.setFormValue({
                field: props.name,
                value: input.target.value,
            });

            props.onChange && props.onChange(input);
        }, 300),
        []
    );

    /**
      * A debounced version of the `onBlur` function.
      */
    const debouncedBlurChange = useCallback(
        debounce((input: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            props.formhandler && props.formhandler.setFormValue({
                field: props.name,
                value: input.target.value,
            });

            props.onBlur && props.onBlur(input);
        }, 300),
        []
    );

    /**
     * Handles the `onChange` event for the input element.
     *
     * @param e - The `ChangeEvent` object.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(e.target.value);

        debouncedHandleChange(e);
    };

    /**
     * Handles the `onBlur` event for the input element.
     *
     * @param e - The `FocusEvent` object.
     */
    const handleBlur = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(e.target.value);

        debouncedBlurChange(e);
    };

    /**
     * Sets the initial value of the input field based on:
     * 
     * - Formik's current state, if formhandler is provided
     * - Initial value assigned to the field when implemented outside of a form
     */
    const setInitialValue = () => {
        setValue(props.formhandler?.formState().currentState[props.name] ?? props.value);
    }

    return {
        handleBlur,
        handleChange,
        debouncedBlurChange,
        debouncedHandleChange,
        value,
        setInitialValue
    };
};
