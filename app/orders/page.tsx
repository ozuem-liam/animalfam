"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link";
import { Package, Calendar, CreditCard, CheckCircle, Clock, XCircle, ShoppingBag, Eye, RefreshCw } from "lucide-react"

interface OrderItem {
  quantity: number
  product: { name: string }
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
}

export default function OrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price / 100)
  }

  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return {
          variant: "default" as const,
          className: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
          icon: CheckCircle,
        }
      case "CANCELLED":
        return {
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
          icon: XCircle,
        }
      case "PROCESSING":
        return {
          variant: "secondary" as const,
          className: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
          icon: Clock,
        }
      default:
        return {
          variant: "secondary" as const,
          className: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200",
          icon: Package,
        }
    }
  }

  const getPaymentStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return {
          variant: "default" as const,
          className: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
        }
      case "FAILED":
        return {
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
        }
      default:
        return {
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
        }
    }
  }

  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user?.email) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/orders?email=${encodeURIComponent(session.user.email)}`)
        if (!response.ok) throw new Error("Failed to fetch orders")

        const data = await response.json()
        setOrders(data.orders)
      } catch (err) {
        setError("Failed to load orders. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [session])

  const handleRefresh = () => {
    setError(null)
    setIsLoading(true)
    // Re-trigger the useEffect
    if (session?.user?.email) {
      fetchOrders()
    }
  }

  const fetchOrders = async () => {
    if (!session?.user?.email) return

    try {
      const response = await fetch(`/api/orders?email=${encodeURIComponent(session.user.email)}`)
      if (!response.ok) throw new Error("Failed to fetch orders")

      const data = await response.json()
      setOrders(data.orders)
    } catch (err) {
      setError("Failed to load orders. Please try again later.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <Skeleton className="h-6 w-32 bg-green-500" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Card className="shadow-lg border-0 bg-white">
            <CardContent className="p-12 text-center">
              <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button onClick={handleRefresh} className="bg-green-600 hover:bg-green-700 text-white">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <ShoppingBag className="h-10 w-10 text-green-600" />
                My Orders
              </h1>
              <p className="text-gray-600 text-lg">Track and manage your order history</p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Orders Card */}
        <Card className="shadow-xl border-0 bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Package className="h-6 w-6" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="text-center py-16 px-6">
                <ShoppingBag className="mx-auto h-20 w-20 text-gray-300 mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 text-lg mb-8">When you place your first order, it will appear here.</p>
                <Button
                  asChild
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                >
                  <Link href="/">Start Shopping</Link>
                </Button>              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-green-50 hover:bg-green-50">
                      <TableHead className="font-semibold text-green-800 py-4">Order #</TableHead>
                      <TableHead className="font-semibold text-green-800">Items</TableHead>
                      <TableHead className="font-semibold text-green-800">Total</TableHead>
                      <TableHead className="font-semibold text-green-800">Status</TableHead>
                      <TableHead className="font-semibold text-green-800">Payment</TableHead>
                      <TableHead className="font-semibold text-green-800">Date</TableHead>
                      <TableHead className="font-semibold text-green-800">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, index) => {
                      const statusConfig = getStatusConfig(order.status)
                      const paymentConfig = getPaymentStatusConfig(order.paymentStatus)
                      const StatusIcon = statusConfig.icon

                      return (
                        <TableRow
                          key={order.id}
                          className={`hover:bg-green-25 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                          }`}
                        >
                          <TableCell className="font-bold text-green-700 py-6">{order.orderNumber}</TableCell>
                          <TableCell className="py-6">
                            <div className="space-y-1">
                              {order.items.map((item, itemIndex) => (
                                <div
                                  key={itemIndex}
                                  className="text-sm bg-green-50 px-3 py-1 rounded-full inline-block mr-1 mb-1"
                                >
                                  <span className="font-medium text-green-800">{item.quantity}x</span>
                                  <span className="text-green-700 ml-1">{item.product.name}</span>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-4 w-4 text-green-600" />
                              <span className="font-bold text-lg text-green-700">{formatPrice(order.totalAmount)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <Badge className={`${statusConfig.className} flex items-center gap-1 px-3 py-1`}>
                              <StatusIcon className="h-3 w-3" />
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-6">
                            <Badge className={`${paymentConfig.className} px-3 py-1`}>{order.paymentStatus}</Badge>
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                          <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                            >
                              <Link href={`/orders/${order.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Orders</p>
                    <p className="text-3xl font-bold">{orders.length}</p>
                  </div>
                  <Package className="h-12 w-12 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Delivered</p>
                    <p className="text-3xl font-bold">
                      {orders.filter((o) => o.status.toUpperCase() === "DELIVERED").length}
                    </p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-blue-200" />
                </div>
              </CardContent> 
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Spent</p>
                    <p className="text-2xl font-bold">
                      {formatPrice(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
                    </p>
                  </div>
                  <CreditCard className="h-12 w-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
