export function isRequired(value) {
  if (!value || value.trim() === '') {
    return 'This field is required'
  }
  return null
}

export function minLength(min) {
  return (value) => {
    if (value && value.trim().length < min) {
      return `Must be at least ${min} characters`
    }
    return null
  }
}

export function isValidPostalCode(value) {
  if (!/^[A-Za-z0-9\s-]{4,10}$/.test(value)) {
    return 'Enter a valid postal code'
  }
  return null
}

export function isValidCardNumber(value) {
  const digitsOnly = value.replace(/\s/g, '')

  if (!/^\d{13,19}$/.test(digitsOnly)) {
    return 'Enter a valid card number'
  }

  if (!passesLuhnCheck(digitsOnly)) {
    return 'This card number looks incorrect'
  }

  return null
}

export function isValidExpiry(value) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value)

  if (!match) {
    return 'Use MM/YY format'
  }

  const month = Number(match[1])
  const year = Number(match[2]) + 2000

  if (month < 1 || month > 12) {
    return 'Enter a valid month'
  }

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const isInThePast = year < currentYear || (year === currentYear && month < currentMonth)

  if (isInThePast) {
    return 'This card has expired'
  }

  return null
}

export function isValidCVC(value) {
  if (!/^\d{3,4}$/.test(value)) {
    return 'Enter a valid CVC'
  }
  return null
}

// The Luhn checksum: catches typos in card numbers by checking that the
// digit sequence is internally consistent, the way real card numbers are
// constructed. It does NOT verify the card is real or has funds.
function passesLuhnCheck(digitsOnly) {
  let sum = 0
  let shouldDouble = false

  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = Number(digitsOnly[i])

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

// Runs a list of validator functions against one value, in order,
// returning the FIRST error found (or null if all pass). Ordering matters —
// e.g. checking "is it a number" before "does it pass Luhn" avoids a
// confusing checksum error on input that isn't even shaped like a number.
export function runValidators(value, validators) {
  for (const validator of validators) {
    const error = validator(value)
    if (error) return error
  }
  return null
}