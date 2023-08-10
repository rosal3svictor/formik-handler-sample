import { useDemoFormHelper } from './DemoForm.helper';
import { FormContent } from './DemoForm.component.Content';
import { DemoFormContext } from './DemoForm.context';

/**
 * React component representing a demo form.
 *
 * @example
 * ```tsx
 * import { DemoForm } from './path/to/DemoForm';
 *
 * const App = () => {
 *   return (
 *     <div>
 *       <h1>My App</h1>
 *       <DemoForm />
 *     </div>
 *   );
 * };
 * ```
 */
export const DemoForm: React.FC = () => {
  const { contextValue } = useDemoFormHelper();

  return (
    <DemoFormContext.Provider value={contextValue}>
      <FormContent debugMode />
    </DemoFormContext.Provider>
  );
};
