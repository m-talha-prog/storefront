import { describe, it, expect, vi } from 'vitest'
import { performOptimisticUpdate } from './performOptimisticUpdate'

describe('performOptimisticUpdate', () => {
  it('applies the optimistic change immediately', async () => {
    const applyOptimistic = vi.fn()
    const rollback = vi.fn()
    const syncFn = vi.fn().mockResolvedValue({ success: true })

    await performOptimisticUpdate({ applyOptimistic, rollback, syncFn })

    expect(applyOptimistic).toHaveBeenCalledTimes(1)
  })

  it('does not roll back when the sync succeeds', async () => {
    const applyOptimistic = vi.fn()
    const rollback = vi.fn()
    const syncFn = vi.fn().mockResolvedValue({ success: true })

    await performOptimisticUpdate({ applyOptimistic, rollback, syncFn })

    expect(rollback).not.toHaveBeenCalled()
  })

  it('rolls back when the sync fails', async () => {
    const applyOptimistic = vi.fn()
    const rollback = vi.fn()
    const syncFn = vi.fn().mockRejectedValue(new Error('network error'))

    await performOptimisticUpdate({ applyOptimistic, rollback, syncFn })

    expect(rollback).toHaveBeenCalledTimes(1)
  })

  it('calls onError with the thrown error when the sync fails', async () => {
    const failure = new Error('sync failed')
    const applyOptimistic = vi.fn()
    const rollback = vi.fn()
    const syncFn = vi.fn().mockRejectedValue(failure)
    const onError = vi.fn()

    await performOptimisticUpdate({ applyOptimistic, rollback, syncFn, onError })

    expect(onError).toHaveBeenCalledWith(failure)
  })

  it('does not call onError when the sync succeeds', async () => {
    const applyOptimistic = vi.fn()
    const rollback = vi.fn()
    const syncFn = vi.fn().mockResolvedValue({ success: true })
    const onError = vi.fn()

    await performOptimisticUpdate({ applyOptimistic, rollback, syncFn, onError })

    expect(onError).not.toHaveBeenCalled()
  })

  it('does not throw when onError is omitted and the sync fails', async () => {
    const applyOptimistic = vi.fn()
    const rollback = vi.fn()
    const syncFn = vi.fn().mockRejectedValue(new Error('fail'))

    // No onError passed at all — confirms the optional `onError?.(error)`
    // call doesn't blow up when there's nothing to call.
    await expect(
      performOptimisticUpdate({ applyOptimistic, rollback, syncFn })
    ).resolves.not.toThrow()
  })

  it('applies the optimistic change before attempting to sync', async () => {
    const callOrder = []
    const applyOptimistic = vi.fn(() => callOrder.push('apply'))
    const rollback = vi.fn()
    const syncFn = vi.fn(async () => {
      callOrder.push('sync')
    })

    await performOptimisticUpdate({ applyOptimistic, rollback, syncFn })

    expect(callOrder).toEqual(['apply', 'sync'])
  })
})