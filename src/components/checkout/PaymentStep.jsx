import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useFormValidation } from '../../hooks/useFormValidation'
import { validatePaymentField, validateAllPayment } from '../../utils/checkoutValidation'

export function PaymentStep({ initialData, onSubmit, onBack }) {
  const { values, errors, handleChange, handleBlur, handleSubmit } = useFormValidation(
    initialData || { cardNumber: '', expiry: '', cvc: '' },
    validatePaymentField,
    validateAllPayment
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Payment information
      </h2>

      <div className="flex flex-col gap-4 mb-6">
        <Input
          label="Card number"
          value={values.cardNumber}
          onChange={handleChange('cardNumber')}
          onBlur={handleBlur('cardNumber')}
          error={errors.cardNumber}
          placeholder="1234 5678 9012 3456"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expiry (MM/YY)"
            value={values.expiry}
            onChange={handleChange('expiry')}
            onBlur={handleBlur('expiry')}
            error={errors.expiry}
            placeholder="MM/YY"
          />
          <Input
            label="CVC"
            value={values.cvc}
            onChange={handleChange('cvc')}
            onBlur={handleBlur('cvc')}
            error={errors.cvc}
            placeholder="123"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          Review Order
        </Button>
      </div>
    </form>
  )
}