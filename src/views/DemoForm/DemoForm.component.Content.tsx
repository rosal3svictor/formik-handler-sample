import { TextField } from '@components';
import { DebugModeUI } from '@utils';

import { useDemoFormContext } from './DemoForm.context';
import { FormContainer } from './DemoForm.component.Content.styles';
import { ActionButtons } from './DemoForm.component.ActionButtons';

import type { FormDebugOption } from '@interfaces';

/**
 * Renders the form content with input fields and action buttons.
 *
 * @param debugMode - Determines whether to display the form in debug mode.
 *
 * @returns The JSX element representing the form content.
 */
export const FormContent = ({ debugMode = false }: FormDebugOption) => {
  const { formHandler } = useDemoFormContext();

  return (
    <FormContainer data-testid="form-container">
      <TextField
        data-testid="name-input"
        name="name"
        label="Name"
        formhandler={formHandler}
      />
      <TextField
        data-testid="lastName-input"
        name="lastName"
        label="Last Name"
        formhandler={formHandler}
      />
      <button
        type="button"
        onClick={formHandler.onSubmitHandler}
        disabled={formHandler.formState().isValid}
      >
        Submit
      </button>
      <ActionButtons />
      {debugMode && DebugModeUI(formHandler)}
    </FormContainer>
  );
};
