import { useMachine } from '@xstate/react'
import { checkoutMachine } from '../machines/checkoutMachine'
import { useCart } from '../context/CartContext'
import { StepIndicator } from '../components/checkout/StepIndicator'
import { CartReviewStep } from '../components/checkout/CartReviewStep'
import { ShippingStep } from '../components/checkout/ShippingStep'
import { PaymentStep } from '../components/checkout/PaymentStep'
import { ConfirmationStep } from '../components/checkout/ConfirmationStep'
import { SuccessStep } from '../components/checkout/SuccessStep'

export function CheckoutPage() {
  const { items, subtotal } = useCart()
  const [snapshot, send] = useMachine(checkoutMachine)

  const currentStep = snapshot.value
  const { shippingInfo, paymentInfo, error, orderId } = snapshot.context

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <StepIndicator currentStep={currentStep} />

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        {currentStep === 'cart' && (
          <CartReviewStep
            items={items}
            subtotal={subtotal}
            onProceed={() => send({ type: 'PROCEED' })}
          />
        )}

        {currentStep === 'shipping' && (
          <ShippingStep
            initialData={shippingInfo}
            onSubmit={(data) => send({ type: 'SUBMIT_SHIPPING', data })}
            onBack={() => send({ type: 'BACK' })}
          />
        )}

        {currentStep === 'payment' && (
          <PaymentStep
            initialData={paymentInfo}
            onSubmit={(data) => send({ type: 'SUBMIT_PAYMENT', data })}
            onBack={() => send({ type: 'BACK' })}
          />
        )}

        {(currentStep === 'confirmation' || currentStep === 'submitting') && (
          <ConfirmationStep
            items={items}
            subtotal={subtotal}
            shippingInfo={shippingInfo}
            paymentInfo={paymentInfo}
            error={error}
            isSubmitting={currentStep === 'submitting'}
            onPlaceOrder={() => send({ type: 'PLACE_ORDER', items })}
            onBack={() => send({ type: 'BACK' })}
          />
        )}

        {currentStep === 'success' && <SuccessStep orderId={orderId} />}
      </div>
    </div>
  )
}