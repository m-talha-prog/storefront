import {
  isRequired,
  minLength,
  isValidPostalCode,
  isValidCardNumber,
  isValidExpiry,
  isValidCVC,
  runValidators,
} from './validators'

const shippingRules = {
  fullName: [isRequired, minLength(2)],
  address: [isRequired, minLength(5)],
  city: [isRequired, minLength(2)],
  postalCode: [isRequired, isValidPostalCode],
}

const paymentRules = {
  cardNumber: [isRequired, isValidCardNumber],
  expiry: [isRequired, isValidExpiry],
  cvc: [isRequired, isValidCVC],
}

function validateFieldWith(rules) {
  return (field, value) => runValidators(value, rules[field] || [])
}

function validateAllWith(rules) {
  return (values) => {
    const errors = {}
    for (const field of Object.keys(rules)) {
      errors[field] = runValidators(values[field] ?? '', rules[field])
    }
    return errors
  }
}

export const validateShippingField = validateFieldWith(shippingRules)
export const validateAllShipping = validateAllWith(shippingRules)

export const validatePaymentField = validateFieldWith(paymentRules)
export const validateAllPayment = validateAllWith(paymentRules)