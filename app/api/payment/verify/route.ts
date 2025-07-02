import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { paystackService } from "@/lib/paystack"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reference } = body

    if (!reference) {
      return NextResponse.json({ error: "Payment reference is required" }, { status: 400 })
    }

    // Verify payment with Paystack
    const verificationResponse = await paystackService.verifyTransaction(reference)

    if (verificationResponse.status && verificationResponse.data.status === "success") {
      // Find order by payment reference
      const order = await prisma.order.findUnique({
        where: { paymentRef: reference },
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

      // Check if payment amount matches order amount
      const expectedAmount = (order.totalAmount + order.deliveryFee) * 100
      const paidAmount = verificationResponse.data.amount

      if (paidAmount !== expectedAmount) {
        console.error(`Payment amount mismatch. Expected: ${expectedAmount}, Paid: ${paidAmount}`)
        return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 })
      }

      // Update order status
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
          
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      // Update product stock
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockCount: {
              decrement: item.quantity,
            },
          },
        })

        // Update inStock status if stockCount reaches 0
        const updatedProduct = await prisma.product.findUnique({
          where: { id: item.productId },
        })

        if (updatedProduct && updatedProduct.stockCount <= 0) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { inStock: false },
          })
        }
      }

      return NextResponse.json({
        status: true,
        message: "Payment verified successfully",
        data: {
          order: updatedOrder,
          payment: verificationResponse.data,
        },
      })
    } else {
      // Payment failed
      await prisma.order.update({
        where: { paymentRef: reference },
        data: {
          paymentStatus: "FAILED",
        },
      })

      return NextResponse.json(
        {
          status: false,
          message: "Payment verification failed",
          data: verificationResponse.data,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
