import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const status = searchParams.get("status");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (email) {
      where.user = { email };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.order.count({ where });

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      totalAmount,
      deliveryFee,
      deliveryAddress,
      deliveryCity,
      deliveryState,
      phone,
      email,
      firstName,
      lastName,
      paymentMethod,
    } = body;

    const orderNumber = `FF-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

let user;
try {
  user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone,
          address: deliveryAddress,
          city: deliveryCity,
          state: deliveryState,
        },
      });
    } }catch (userError) {
      console.error("User creation error:", userError);
      return NextResponse.json({ error: "User handling failed" }, { status: 500 });
    }
  

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        totalAmount: Math.round(totalAmount * 100),
        deliveryFee: Math.round((deliveryFee || 0) * 100),
        deliveryAddress,
        deliveryCity,
        deliveryState,
        phone,
        email,
        firstName,
        lastName,
        paymentMethod,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: Math.round(item.price * 100),
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error.message, error.stack);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
