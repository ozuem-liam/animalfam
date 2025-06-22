"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    const reference = searchParams.get("reference")

    if (reference) {
      verifyPayment(reference)
    } else {
      setStatus("failed")
    }
  }, [searchParams])

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference }),
      })

      const data = await response.json()

      if (data.status) {
        setStatus("success")
        setOrderData(data.data.order)
      } else {
        setStatus("failed")
      }
    } catch (error) {
      console.error("Error verifying payment:", error)
      setStatus("failed")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price / 100)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600 text-center">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            <p className="text-gray-600">Thank you for your order. Your payment has been processed successfully.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {orderData && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Order Number:</span>
                    <span className="font-medium">{orderData.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-medium">{formatPrice(orderData.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-green-600">{orderData.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="font-medium text-green-600">{orderData.paymentStatus}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You'll receive an email confirmation shortly</li>
                <li>• Your order will be processed within 24 hours</li>
                <li>• We'll send you tracking information once shipped</li>
                <li>• Expected delivery: 2-3 business days</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => router.push("/")} className="flex-1">
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => router.push("/orders")} className="flex-1">
                View Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
          <p className="text-gray-600">We couldn't process your payment. Please try again.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">Common Issues:</h4>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Insufficient funds</li>
              <li>• Card declined by bank</li>
              <li>• Network connection issues</li>
              <li>• Incorrect card details</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => router.push("/")} variant="outline" className="flex-1">
              Back to Shop
            </Button>
            <Button onClick={() => window.location.reload()} className="flex-1">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
