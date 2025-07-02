"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle, Clock, XCircle, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface OrderItem {
  quantity: number
  product: { name: string; price: number; image?: string }
}

interface Order {
  id: string
  orderNumber: string
  user: { firstName: string; lastName: string; email: string }
  items: OrderItem[]
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
  shippingAddress: { name: string; street: string; city: string; state: string; zip: string; country: string }
}

const statusConfig = {
  PROCESSING: { label: "Processing", icon: Clock, className: "bg-blue-100 text-blue-800 border-blue-200" },
  DELIVERED: { label: "Delivered", icon: CheckCircle, className: "bg-green-100 text-green-800 border-green-200" },
  CANCELLED: { label: "Cancelled", icon: XCircle, className: "bg-red-100 text-red-800 border-red-200" },
}

const paymentStatusConfig = {
  PAID: { className: "bg-green-100 text-green-800 border-green-200" },
  FAILED: { className: "bg-red-100 text-red-800 border-red-200" },
  PENDING: { className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
}

export default function OrderDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price / 100)
  }

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${params.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(response.status === 404 ? "Order not found" : "Failed to fetch order details")
      }

      const orderData = await response.json()
      setOrder({
        ...orderData,
        shippingAddress: {
          name: `${orderData.firstName} ${orderData.lastName}`,
          street: orderData.deliveryAddress,
          city: orderData.deliveryCity,
          state: orderData.deliveryState,
          zip: orderData.deliveryZip || "",
          country: orderData.deliveryCountry || "",
        },
      })
      setLoading(false)
    } catch (err: any) {
      console.error("Error fetching order:", err)
      setError(err.message || "Failed to load order details. Please try again later.")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated" && params.id) {
      fetchOrder()
    }
  }, [status, router, params.id])

  if (status === "loading" || loading) {
    return <OrderDetailSkeleton />
  }

  if (!session || !order || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-green-600 hover:text-green-700 hover:bg-green-50"
            aria-label="Back to orders"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Orders
          </Button>
          <Card className="shadow-md border-0 bg-white">
            <CardContent className="p-8 text-center">
              <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{error || "Order not found"}</h3>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setError(null)
                    setLoading(true)
                    fetchOrder()
                  }}
                  className="border-green-200 text-green-600 hover:bg-green-50"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/orders")}
                  className="border-green-200 text-green-600 hover:bg-green-50"
                >
                  View All Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  const statusKey = order.status.toUpperCase() as keyof typeof statusConfig
  const StatusIcon = statusConfig[statusKey]?.icon || Clock
  const statusConfigData = statusConfig[statusKey] || {
    label: "Unknown",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  }
  const paymentStatusKey = order.paymentStatus.toUpperCase() as keyof typeof paymentStatusConfig
  const paymentStatusData = paymentStatusConfig[paymentStatusKey] || {
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-green-600 hover:text-green-700 hover:bg-green-50"
          aria-label="Back to orders"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Orders
        </Button>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-green-600" aria-hidden="true" />
                Order #{order.orderNumber}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
              </p>
            </div>
            <Badge
              className={`${statusConfigData.className} flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full`}
              aria-label={`Order status: ${statusConfigData.label}`}
            >
              <StatusIcon className="h-4 w-4" aria-hidden="true" />
              {statusConfigData.label}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="shadow-md border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-md">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5" aria-hidden="true" />
                  Items Ordered
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <img
                        src={item.product.image || "/placeholder-image.jpg"}
                        alt={item.product.name}
                        className="w-20 h-20 object-contain rounded-md bg-white border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-image.jpg"
                        }}
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        <p className="text-xs text-gray-500">{formatPrice(item.product.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="shadow-md border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-md">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total</span>
                  <span className="font-semibold text-green-600">{formatPrice(order.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="shadow-md border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-md">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-semibold">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="shadow-md border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-md">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" aria-hidden="true" />
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Badge
                  className={`${paymentStatusData.className} px-3 py-1 text-sm font-medium rounded-full`}
                  aria-label={`Payment status: ${order.paymentStatus}`}
                >
                  {order.paymentStatus}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="flex justify-between items-start mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md border-0 bg-white">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Skeleton className="w-20 h-20 rounded-md" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-5 w-16 mb-1" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-md border-0 bg-white">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}