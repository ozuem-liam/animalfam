import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { paystackService } from "@/lib/paystack"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, email, amount, callbackUrl } = body

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Generate payment reference
    const reference = `FF_${order.orderNumber}_${Date.now()}`

    // Initialize payment with Paystack
    const paymentData = {
      email,
      amount, // ✅ Already in kobo from frontend
      reference,
      callback_url: callbackUrl || `${process.env.NEXTAUTH_URL}/payment/callback`,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        custom_fields: [
          {
            display_name: "Order Number",
            variable_name: "order_number",
            value: order.orderNumber,
          },
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: `${order.firstName} ${order.lastName}`,
          },
        ],
      },
    }

    const paystackResponse = await paystackService.initializeTransaction(paymentData)

    if (paystackResponse.status) {
      // Update order with payment reference
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentRef: reference,
          paymentStatus: "PENDING",
        },
      })

      return NextResponse.json({
        status: true,
        message: "Payment initialized successfully",
        data: {
          authorization_url: paystackResponse.data.authorization_url,
          access_code: paystackResponse.data.access_code,
          reference: paystackResponse.data.reference,
        },
      })
    } else {
      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error initializing payment:", error)
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  }
}
