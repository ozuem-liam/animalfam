// types/paystack.d.ts or global.d.ts
export {}

declare global {
  interface Window {
    PaystackPop: {
      setup(options: {
        key: string
        email: string
        amount: number
        ref?: string
        callback?: (response: { reference: string }) => void
        onClose?: () => void
        metadata?: Record<string, any>
        currency?: string
        channels?: string[]
        label?: string
      }): {
        openIframe(): void
      }
    }
  }
}
