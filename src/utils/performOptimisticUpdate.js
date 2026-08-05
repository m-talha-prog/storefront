/**
 * Runs an optimistic update: applies a change immediately, then attempts to
 * confirm it asynchronously. If confirmation fails, the change is rolled back.
 *
 * Deliberately generic — knows nothing about carts, fetch, or XState. Any of
 * the three functions can be swapped for a test double, which is what makes
 * this testable without a real network or a real state machine.
 *
 * @param {Object} config
 * @param {() => void} config.applyOptimistic - Apply the change immediately.
 * @param {() => void} config.rollback - Undo the change if syncFn fails.
 * @param {() => Promise<any>} config.syncFn - The async operation to confirm the change.
 * @param {(error: Error) => void} [config.onError] - Called if syncFn fails, after rollback runs.
 */
export async function performOptimisticUpdate({
  applyOptimistic,
  rollback,
  syncFn,
  onError,
}) {
  applyOptimistic()

  try {
    await syncFn()
  } catch (error) {
    rollback()
    onError?.(error)
  }
}