import { render, screen } from '@testing-library/react';
import { FormContent } from './DemoForm.component.Content';
import { DemoFormContext } from './DemoForm.context';
import { useDemoFormHelper } from './DemoForm.helper';
import { vitest } from 'vitest';

describe('FormContent', () => {
  const mockFormHandler = {
    onSubmitHandler: vitest.fn(),
    formState: vitest.fn().mockReturnValue({ isValid: true }),
  };

  const renderComponent = (debugMode = false) => {
    return render(<FormContent debugMode={debugMode} />, {
      wrapper: ({ children }) => {
        const { contextValue } = useDemoFormHelper();

        return (
          <DemoFormContext.Provider value={contextValue}>
            <div>{children}</div>
          </DemoFormContext.Provider>
        )
      },
    });
  };

  afterEach(() => {
    vitest.restoreAllMocks()
  })

  it('Renders input fields and submit button', () => {
    renderComponent();

    const nameInput = screen.getByTestId('name-input');
    const lastNameInput = screen.getByTestId('lastName-input');
    const submitButton = screen.getByText('Submit');

    expect(nameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('Submit button is valid once the form loads', () => {
    mockFormHandler.formState.mockReturnValue({ isValid: true });
    renderComponent();

    const submitButton = screen.getByText('Submit');
    expect(submitButton).not.toBeDisabled()
  });

  it('Renders DebugModeUI when debugMode is true', () => {
    renderComponent(true);

    const debugModeUI = screen.getByTestId('debug-mode-ui');
    expect(debugModeUI).toBeInTheDocument();
  });
});
