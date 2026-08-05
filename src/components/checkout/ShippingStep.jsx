import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useFormValidation } from '../../hooks/useFormValidation'
import { validateShippingField, validateAllShipping } from '../../utils/checkoutValidation'

export function ShippingStep({ initialData, onSubmit, onBack }) {
  const { values, errors, handleChange, handleBlur, handleSubmit } = useFormValidation(
    initialData || { fullName: '', address: '', city: '', postalCode: '' },
    validateShippingField,
    validateAllShipping
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Shipping information
      </h2>

      <div className="flex flex-col gap-4 mb-6">
        <Input
          label="Full name"
          value={values.fullName}
          onChange={handleChange('fullName')}
          onBlur={handleBlur('fullName')}
          error={errors.fullName}
        />
        <Input
          label="Address"
          value={values.address}
          onChange={handleChange('address')}
          onBlur={handleBlur('address')}
          error={errors.address}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            value={values.city}
            onChange={handleChange('city')}
            onBlur={handleBlur('city')}
            error={errors.city}
          />
          <Input
            label="Postal code"
            value={values.postalCode}
            onChange={handleChange('postalCode')}
            onBlur={handleBlur('postalCode')}
            error={errors.postalCode}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          Continue to Payment
        </Button>
      </div>
    </form>
  )
}