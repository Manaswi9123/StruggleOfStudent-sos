import { useState } from 'react'

/** Small helper: tracks sending / error / done for any async submit. */
export function useSubmit(action) {
  const [state, setState] = useState({ sending: false, error: '', result: null })
  const submit = async (...args) => {
    setState({ sending: true, error: '', result: null })
    try {
      const result = await action(...args)
      setState({ sending: false, error: '', result: result ?? true })
      return result
    } catch (e) {
      setState({ sending: false, error: e.message || 'Something went wrong. Please try again.', result: null })
    }
  }
  const reset = () => setState({ sending: false, error: '', result: null })
  return { ...state, submit, reset }
}

export const formToObject = (form) => Object.fromEntries(new FormData(form).entries())
