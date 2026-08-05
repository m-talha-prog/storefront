const STEPS = [
  { key: 'cart', label: 'Cart' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirmation', label: 'Confirmation' },
]

export function StepIndicator({ currentStep }) {
  const activeKey = currentStep === 'submitting' ? 'confirmation' : currentStep
  const activeIndex = STEPS.findIndex((step) => step.key === activeKey)

  return (
    <div className="mb-8">
      <ol
        className="flex items-center justify-center gap-1 sm:gap-2"
        aria-label="Checkout progress"
      >
        {STEPS.map((step, index) => {
          const isComplete = index < activeIndex
          const isActive = index === activeIndex

          return (
            <li key={step.key} className="flex items-center gap-1 sm:gap-2">
              <span
                aria-current={isActive ? 'step' : undefined}
                className={`
                  flex items-center gap-2 text-sm font-medium px-1 sm:px-2 py-1 rounded
                  ${
                    isActive
                      ? 'text-blue-700 dark:text-blue-300'
                      : isComplete
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-400 dark:text-gray-600'
                  }
                `}
              >
                <span
                  className={`
                    w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0
                    ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isComplete
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }
                  `}
                  aria-hidden="true"
                >
                  {isComplete ? '✓' : index + 1}
                </span>

                {/* Full text label only on sm+ — on mobile, four full labels
                    plus circles plus connectors don't fit one row without
                    wrapping or overflowing. */}
                <span className="hidden sm:inline">{step.label}</span>
              </span>

              {index < STEPS.length - 1 && (
                <span
                  className="w-4 sm:w-8 h-px bg-gray-300 dark:bg-gray-600"
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>

      {/* Mobile-only summary — replaces the hidden text labels above with
          one clear line, instead of just leaving mobile users with bare
          circles and no indication of what step they're actually on. */}
      <p className="sm:hidden text-center text-sm font-medium text-blue-700 dark:text-blue-300 mt-2">
        Step {activeIndex + 1} of {STEPS.length}: {STEPS[activeIndex]?.label}
      </p>
    </div>
  )
}