import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const inStock = searchParams.get("inStock")
    const organic = searchParams.get("organic")
    const sortBy = searchParams.get("sortBy") || "featured"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    const where: any = {}

    if (category && category !== "All") {
      where.category = { name: category }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search.toLowerCase() } },
      ]
    }

    if (featured === "true") {
      where.featured = true
    }

    if (inStock === "true") {
      where.inStock = true
    }

    if (organic === "true") {
      where.organic = true
    }

    let orderBy: any = {}
    switch (sortBy) {
      case "price-low":
        orderBy = { price: "asc" }
        break
      case "price-high":
        orderBy = { price: "desc" }
        break
      case "rating":
        orderBy = { rating: "desc" }
        break
      case "name":
        orderBy = { name: "asc" }
        break
      default:
        orderBy = [{ featured: "desc" }, { bestSeller: "desc" }, { rating: "desc" }]
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.product.count({ where })

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      price,
      originalPrice,
      images,
      categoryId,
      tags,
      featured,
      bestSeller,
      organic,
      stockCount,
      badge,
    } = body

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Math.round(price * 100), // Convert to kobo
        originalPrice: Math.round(originalPrice * 100), // Convert to kobo
        images,
        categoryId,
        tags: tags || [],
        featured: featured || false,
        bestSeller: bestSeller || false,
        organic: organic || false,
        stockCount: stockCount || 0,
        inStock: stockCount > 0,
        badge,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
