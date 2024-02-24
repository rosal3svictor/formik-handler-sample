import { renderHook, cleanup } from '@testing-library/react-hooks'
import { describe, expect, it } from 'vitest'

import { initialValues, validationSchema } from './mocks'

import { useFormHandler } from '.'

const performRender = () =>
  renderHook(() =>
    useFormHandler({
      initialValues,
      validationSchema,
      onSubmitHandler: () => {
        console.log('Form has been submitted')
      }
    })
  )

describe('useFormHandler Hook', () => {
  afterEach(() => {
    /** Umounts React Hooks that were mounted with render */
    void cleanup()
  })

  it('Returns methods exposing individual functions to manage the form state', () => {
    const { result } = performRender()

    expect(Object.keys(result.current)).toEqual([
      'setFormValue',
      'formState',
      'fieldState',
      'resetForm',
      'triggerValidation',
      'onSubmitHandler',
      'debugMode'
    ])
  })

  it('Type definitions for the previous methods returned are the expected', () => {
    const { result } = performRender()

    expect(result.current).toEqual({
      setFormValue: expect.any(Function),
      formState: expect.any(Function),
      fieldState: expect.any(Function),
      resetForm: expect.any(Function),
      triggerValidation: expect.any(Function),
      onSubmitHandler: expect.any(Function),
      debugMode: expect.any(Function)
    })
  })

  describe('Hook functionalities work as expected', () => {
    it('formState - Returns an object containing information about the entire form state', () => {
      const {
        result: {
          current: { formState }
        }
      } = performRender()

      const expectedKeyNamesReturned = [
        'initialValues',
        'currentState',
        'isValid',
        'errors',
        'hasBeenUpdated'
      ]

      // Returns the expected key names
      expect(Object.keys(formState())).toStrictEqual(expectedKeyNamesReturned)

      // Returns the expected property values
      expect(formState()).toStrictEqual({
        initialValues,
        currentState: initialValues,
        isValid: false,
        hasBeenUpdated: false,
        errors: {}
      })
    })

    it('fieldState - Returns individual field state', () => {
      const {
        result: {
          current: { fieldState }
        }
      } = performRender()

      const expectedKeyNamesReturned = ['invalid', 'error']

      // Returns the expected key names
      expect(Object.keys(fieldState('email'))).toStrictEqual(
        expectedKeyNamesReturned
      )

      // Returns the expected property values
      expect(fieldState('email')).toStrictEqual({
        invalid: false,
        error: ''
      })
    })

    it('debugMode - This function will return the Form State to be used as `debug information`', () => {
      const {
        result: {
          current: { debugMode }
        }
      } = performRender()

      const debugModeResult = debugMode()

      expect(debugModeResult).toStrictEqual({
        initialValues,
        currentState: initialValues,
        isValid: true,
        hasBeenUpdated: false,
        errors: {}
      })
    })
  })
})
