import { useState } from 'react'

/**
 * Generic form state + validation. Knows nothing about shipping or payment
 * specifically — `validateField` and `validateAll` are supplied by the
 * caller, so this hook can back ANY form.
 *
 * @param {Object} initialValues
 * @param {(field: string, value: string) => string | null} validateField
 * @param {(values: Object) => Object} validateAll - returns { field: error } for every invalid field
 */
export function useFormValidation(initialValues, validateField, validateAll) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  function handleChange(field) {
    return (e) => {
      const value = e.target.value
      setValues((prev) => ({ ...prev, [field]: value }))

      // Only re-validate on every keystroke AFTER the field has been
      // touched once — otherwise every field would show an error the
      // instant the user types their very first character anywhere.
      if (touched[field]) {
        const error = validateField(field, value)
        setErrors((prev) => ({ ...prev, [field]: error }))
      }
    }
  }

  function handleBlur(field) {
    return () => {
      setTouched((prev) => ({ ...prev, [field]: true }))
      const error = validateField(field, values[field])
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  function handleSubmit(onValid) {
    return (e) => {
      e.preventDefault()

      const allErrors = validateAll(values)
      setErrors(allErrors)

      // Mark every field touched on submit attempt, so any error introduced
      // by validateAll (not just per-field blur errors) actually renders.
      const allTouched = Object.keys(values).reduce(
        (acc, field) => ({ ...acc, [field]: true }),
        {}
      )
      setTouched(allTouched)

      const hasErrors = Object.values(allErrors).some(Boolean)
      if (!hasErrors) {
        onValid(values)
      }
    }
  }

  return { values, errors, touched, handleChange, handleBlur, handleSubmit }
}