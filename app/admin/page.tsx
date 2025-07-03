"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Package, ShoppingCart, TrendingUp, Edit, Trash2, Pencil, Trash, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { ImageUpload } from "@/components/ui/image-upload"
import MultiImageUpload from "@/components/MultiImageUpload"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  images: string[]
  rating: number
  reviews: number
  badge?: string
  tags: string[]
  featured: boolean
  bestSeller: boolean
  organic: boolean
  inStock: boolean
  stockCount: number
  category: {
    id: string
    name: string
    icon: string
  }
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  icon: string
  description?: string
  _count: {
    products: number
  }
}

interface Order {
  id: string
  orderNumber: string
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
  user: {
    firstName: string
    lastName: string
    email: string
  }
  items: {
    quantity: number
    price: number
    product: {
      name: string
    }
  }[]
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    images: [] as string[],
    categoryId: "",
    tags: "",
    featured: false,
    bestSeller: false,
    organic: false,
    stockCount: "",
    badge: "",
  })

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "",
    description: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/orders"),
      ])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      const ordersData = await ordersRes.json()

      setProducts(productsData.products || [])
      setCategories(categoriesData || [])
      setOrders(ordersData.orders || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price / 100)
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const productData = {
        ...productForm,
        price: Number.parseFloat(productForm.price),
        originalPrice: Number.parseFloat(productForm.originalPrice),
        stockCount: Number.parseInt(productForm.stockCount),
        tags: productForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        await fetchData()
        setIsProductDialogOpen(false)
        setEditingProduct(null)
        setProductForm({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          images: [] as string[],
          categoryId: "",
          tags: "",
          featured: false,
          bestSeller: false,
          organic: false,
          stockCount: "",
          badge: "",
        })
      }
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    const isEditing = !!editingCategory
    const url = "/api/categories"
    const method = isEditing ? "PUT" : "POST"
  
    const body = isEditing
      ? JSON.stringify({ id: editingCategory.id, ...categoryForm })
      : JSON.stringify(categoryForm)
  
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      })
  
      if (response.ok) {
        await fetchData()
        setIsCategoryDialogOpen(false)
        setCategoryForm({ name: "", icon: "", description: "" })
        setEditingCategory(null)
      } else {
        console.error("Failed to save category")
      }
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchData()
        }
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      icon: category.icon,
      description: category.description || "",
    })
    setIsCategoryDialogOpen(true)
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchData()
        }
      } catch (error) {
        console.error("Error deleting category:", error)
      }
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      price: (product.price / 100).toString(),
      originalPrice: (product.originalPrice / 100).toString(),
      images: product.images || [],
      categoryId: product.category.id,
      tags: product.tags.join(", "),
      featured: product.featured,
      bestSeller: product.bestSeller,
      organic: product.organic,
      stockCount: product.stockCount.toString(),
      badge: product.badge || "",
    })
    setIsProductDialogOpen(true)
  }

  const handleDownloadOrdersCSV = () => {
    const headers = [
      "Order Number",
      "Customer Name",
      "Customer Email",
      "Items",
      "Buying Price",
      "Status",
      "Payment Status",
      "Order Date",
    ]

    const rows = orders.map(order => [
      order.orderNumber,
      `${order.user.firstName} ${order.user.lastName}`,
      order.user.email,
      order.items.map(item => `${item.quantity}x ${item.product.name}`).join("; "),
      formatPrice(order.totalAmount),
      order.status,
      order.paymentStatus,
      new Date(order.createdAt).toLocaleDateString(),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `orders_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    lowStockProducts: products.filter((p) => p.stockCount < 10).length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AnimalFam</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your ecommerce store</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
                if (!open) {
                  setEditingCategory(null)
                  setCategoryForm({ name: "", icon: "", description: "" })
                }
                setIsCategoryDialogOpen(open)
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Add Category</span>
                    <span className="sm:hidden">+ Category</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory ? "Edit Category" : "Add New Category"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryIcon">Icon (Emoji)</Label>
                      <Input
                        id="categoryIcon"
                        value={categoryForm.icon}
                        onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                        placeholder="🥩"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryDescription">Description</Label>
                      <Textarea
                        id="categoryDescription"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {editingCategory ? "Update Category" : "Add Category"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Add Product</span>
                    <span className="sm:hidden">+ Product</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={productForm.categoryId}
                          onValueChange={(value) => setProductForm({ ...productForm, categoryId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.icon} {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₦)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice">Original Price (₦)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          step="0.01"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stockCount">Stock Count</Label>
                        <Input
                          id="stockCount"
                          type="number"
                          value={productForm.stockCount}
                          onChange={(e) => setProductForm({ ...productForm, stockCount: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="badge">Badge</Label>
                        <Input
                          id="badge"
                          value={productForm.badge}
                          onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                          placeholder="Fresh, Organic, etc."
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="images">Product Images</Label>
                      <MultiImageUpload
                        value={productForm.images}
                        onChange={(urls) => setProductForm({ ...productForm, images: urls })}
                        disabled={false}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={productForm.tags}
                        onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                        placeholder="fresh, organic, local"
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={productForm.featured}
                          onCheckedChange={(checked) => setProductForm({ ...productForm, featured: !!checked })}
                        />
                        <Label htmlFor="featured">Featured</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="bestSeller"
                          checked={productForm.bestSeller}
                          onCheckedChange={(checked) => setProductForm({ ...productForm, bestSeller: !!checked })}
                        />
                        <Label htmlFor="bestSeller">Best Seller</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="organic"
                          checked={productForm.organic}
                          onCheckedChange={(checked) => setProductForm({ ...productForm, organic: !!checked })}
                        />
                        <Label htmlFor="organic">Organic</Label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      {editingProduct ? "Update Product" : "Add Product"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <Package className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{stats.lowStockProducts}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Products Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Image
                              src={product.images?.[0] || "/placeholder.svg"}
                              alt={product.name}
                              width={50}
                              height={50}
                              className="rounded-lg object-cover"
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="flex gap-1 mt-1">
                                {product.featured && <Badge variant="secondary">Featured</Badge>}
                                {product.bestSeller && <Badge variant="outline">Best Seller</Badge>}
                                {product.organic && <Badge className="bg-green-100 text-green-800">Organic</Badge>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{product.category.icon}</span>
                              <span>{product.category.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{formatPrice(product.price)}</div>
                              <div className="text-sm text-gray-500 line-through">
                                {formatPrice(product.originalPrice)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.stockCount < 10 ? "destructive" : "default"}>
                              {product.stockCount} units
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.inStock ? "default" : "destructive"}>
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Orders Management</CardTitle>
                    <Button variant="outline" onClick={handleDownloadOrdersCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>
                            <div>
                              <div>
                                {order.user.firstName} {order.user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{order.user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {order.items.map((item, index) => (
                                <div key={index}>
                                  {item.quantity}x {item.product.name}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "DELIVERED"
                                  ? "default"
                                  : order.status === "CANCELLED"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.paymentStatus === "PAID"
                                  ? "default"
                                  : order.paymentStatus === "FAILED"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {order.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Categories Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Icon</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="text-2xl">{category.icon}</TableCell>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell>
                            <Badge>{category._count.products} products</Badge>
                          </TableCell>
                          <TableCell>{new Date().toLocaleDateString()}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}