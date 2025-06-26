"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ShoppingCart,
  Menu,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Truck,
  Shield,
  Clock,
  Plus,
  Minus,
  X,
  Heart,
  ChevronDown,
  ArrowRight,
  Eye,
  Zap,
  SlidersHorizontal,
  Filter,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserMenu } from "@/components/auth/user-menu"
import { LoginRequired } from "@/components/auth/login-required"
import { useSession } from "next-auth/react"

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
}

interface CartItem extends Product {
  quantity: number
}

interface FilterState {
  priceRange: [number, number]
  categories: string[]
  ratings: number[]
  badges: string[]
  inStockOnly: boolean
  organicOnly: boolean
}
interface MiniImageSliderProps {
  images: string[];
  name: string;
  width?: number;
  height?: number;
  className?: string;
}
type ProductImageSliderProps = {
  images: string[];
  name: string;
};

interface Category {
  id: string
  name: string
  icon: string
  count: number
}

export default function FoodEcommerce() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [viewedProducts, setViewedProducts] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const [currentPage, setCurrentPage] = useState("home")
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000000],
    categories: [],
    ratings: [],
    badges: [],
    inStockOnly: false,
    organicOnly: false,
  })

  const { data: session } = useSession()
  const [showLoginRequired, setShowLoginRequired] = useState(false)
  const [loginAction, setLoginAction] = useState("")

  // Fetch products and categories from API
  const fetchProductsAndCategories = async () => {
    try {
      setIsLoading(true)

      // Fetch products
      let apiProducts: Product[] = []
      try {
        const productRes = await fetch("/api/products", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        if (productRes.ok) {
          const data = await productRes.json()
          apiProducts = data.products || []
        } else {
          console.warn("Failed to fetch products from API, status:", productRes.status)
        }
      } catch (error) {
        console.error("Error fetching products from API:", error)
      }

      // Fetch categories
      let apiCategories: Category[] = []
      try {
        const categoryRes = await fetch("/api/categories", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        if (categoryRes.ok) {
          apiCategories = await categoryRes.json()
        } else {
          console.warn("Failed to fetch categories from API, status:", categoryRes.status)
        }
      } catch (error) {
        console.error("Error fetching categories from API:", error)
      }

      // Ensure "All" category is included
      const allCategory: Category = { id: "cat0", name: "All", icon: "🛒", count: apiProducts.length }
      const mergedCategories = [allCategory, ...apiCategories.filter((cat) => cat.id !== "cat0")]

      // Update category counts based on products
      const updatedCategories = mergedCategories.map((cat) => ({
        ...cat,
        count:
          cat.name === "All"
            ? apiProducts.length
            : apiProducts.filter((p) => p.category.name === cat.name).length,
      }))

      // Update state
      setAllProducts(apiProducts)
      setCategories(updatedCategories)
    } catch (error) {
      console.error("Error in fetchProductsAndCategories:", error)
      // Fallback to empty data
      setAllProducts([])
      setCategories([{ id: "cat0", name: "All", icon: "🛒", count: 0 }])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProductsAndCategories()
  }, [])

  // Get featured products
  const featuredProducts = allProducts.filter((product) => product.featured)

  // Get best sellers
  const bestSellerProducts = allProducts.filter((product) => product.bestSeller)

  // Apply filters and search
  const getFilteredProducts = () => {
    const filtered = allProducts.filter((product) => {
      // Search query
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  
      // Combine selectedCategory and filter.categories
      const effectiveCategories = selectedCategory === "All" ? [] : [selectedCategory, ...filters.categories];
      const matchesCategory =
        effectiveCategories.length === 0 || effectiveCategories.includes(product.category.name);
  
      // Price range (in kobo)
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
  
      // Rating filter
      const matchesRating = filters.ratings.length === 0 || filters.ratings.some((rating) => product.rating >= rating);
  
      // Badge filter
      const matchesBadge =
        filters.badges.length === 0 || (product.badge && filters.badges.includes(product.badge));
  
      // Stock filter
      const matchesStock = !filters.inStockOnly || product.inStock;
  
      // Organic filter
      const matchesOrganic = !filters.organicOnly || product.organic;
  
      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesBadge &&
        matchesStock &&
        matchesOrganic
      );
    });
  
    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - b.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.bestSeller && !b.bestSeller) return -1;
          if (!a.bestSeller && b.bestSeller) return 1;
          return b.rating - a.rating;
        });
        break;
    }
  
    return filtered;
  };

  const filteredProducts = getFilteredProducts()

  // Get similar products based on category and tags
  const getSimilarProducts = (product: Product, limit = 4) => {
    return allProducts
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.category.name === product.category.name || p.tags.some((tag) => product.tags.includes(tag))),
      )
      .sort((a, b) => {
        const aScore =
          (a.category.name === product.category.name ? 2 : 0) + a.tags.filter((tag) => product.tags.includes(tag)).length
        const bScore =
          (b.category.name === product.category.name ? 2 : 0) + b.tags.filter((tag) => product.tags.includes(tag)).length
        return bScore - aScore
      })
      .slice(0, limit)
  }

  // Get recommended products for checkout
  const getRecommendedProducts = () => {
    if (cartItems.length === 0) return featuredProducts.slice(0, 4)

    const cartCategories = [...new Set(cartItems.map((item) => item.category.name))]
    const cartTags = [...new Set(cartItems.flatMap((item) => item.tags))]

    return allProducts
      .filter(
        (product) =>
          !cartItems.some((item) => item.id === product.id) &&
          (cartCategories.includes(product.category.name) || product.tags.some((tag) => cartTags.includes(tag))),
      )
      .sort((a, b) => {
        const aScore =
          (cartCategories.includes(a.category.name) ? 3 : 0) +
          a.tags.filter((tag) => cartTags.includes(tag)).length +
          (a.featured ? 2 : 0) +
          (a.bestSeller ? 1 : 0)
        const bScore =
          (cartCategories.includes(b.category.name) ? 3 : 0) +
          b.tags.filter((tag) => cartTags.includes(tag)).length +
          (b.featured ? 2 : 0) +
          (b.bestSeller ? 1 : 0)
        return bScore - aScore
      })
      .slice(0, 6)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price / 100)
  }

  const addToCart = (product: Product) => {
    if (!product.inStock) {
      alert("Sorry, this product is currently out of stock!")
      return
    }

    if (!session) {
      setLoginAction("add items to cart")
      setShowLoginRequired(true)
      return
    }

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        if (existingItem.quantity >= product.stockCount) {
          alert(`Sorry, only ${product.stockCount} items available in stock!`)
          return prev
        }
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })

    if (!viewedProducts.includes(product.id)) {
      setViewedProducts((prev) => [...prev, product.id])
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id))
    } else {
      const product = allProducts.find((p) => p.id === id)
      if (product && quantity > product.stockCount) {
        alert(`Sorry, only ${product.stockCount} items available in stock!`)
        return
      }
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const getTotalItems = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getDeliveryFee = (deliveryOption:any) => (deliveryOption === "express" ? 250000 : 0);
  const getTotalWithDelivery = (deliveryOption:any) => getTotalPrice() + getDeliveryFee(deliveryOption);
  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName)
    setCurrentPage("products")
  }

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 5000000],
      categories: [],
      ratings: [],
      badges: [],
      inStockOnly: false,
      organicOnly: false,
    })
  }
  function MiniImageSlider({
    images = [],
    name,
    width = 200,
    height = 150,
  }: {
    images: string[];
    name: string;
    width?: number;
    height?: number;
  }) {
    const [index, setIndex] = useState(0);
  
    if (!images.length) {
      return (
        <Image
          src="/placeholder.svg"
          alt="Placeholder"
          width={width}
          height={height}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
      );
    }
  
    const next = () => setIndex((i) => (i + 1) % images.length);
    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  
    return (
      <div className="relative w-full h-32 group overflow-hidden">
        <Image
          src={images[index]}
          alt={`${name} image ${index + 1}`}
          width={width}
          height={height}
          className="w-full h-32 object-cover rounded-lg mb-3 transition-transform duration-300 group-hover:scale-105"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 text-white px-1 text-xs rounded"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 text-white px-1 text-xs rounded"
            >
              ›
            </button>
          </>
        )}
      </div>
    );
  }
  function ImageSlider({ images = [], alt }: { images: string[], alt: string }) {
    const [index, setIndex] = useState(0);
  
    if (images.length === 0) {
      return (
        <img
          src="/placeholder.svg"
          alt="placeholder"
          className="w-20 h-20 object-cover rounded-lg"
        />
      );
    }
  
    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
    const next = () => setIndex((i) => (i + 1) % images.length);
  
    return (
      <div className="relative w-20 h-20">
        <img
          src={images[index]}
          alt={`${alt}-${index}`}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 text-white text-xs px-1 rounded-l"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 text-white text-xs px-1 rounded-r"
        >
          ›
        </button>
      </div>
    );
  }

  
function MiniImagesSlider({
  images,
  name,
  width = 60,
  height = 60,
  className = "rounded-lg object-cover",
}: MiniImageSliderProps) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <Image
        src="/placeholder.svg"
        alt="Placeholder"
        width={width}
        height={height}
        className={className}
      />
    );
  }

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="relative group w-fit h-fit">
      <Image
        src={images[index]}
        alt={`${name} image ${index + 1}`}
        width={width}
        height={height}
        className={className}
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white text-xs px-1 rounded-l opacity-80 hover:opacity-100"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white text-xs px-1 rounded-r opacity-80 hover:opacity-100"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
function ProductImageSlider({ images = [], name }: ProductImageSliderProps) {
  const [index, setIndex] = useState(0);
  
    if (!images.length) {
      return (
        <Image
          src="/placeholder.svg"
          alt="Placeholder"
          width={300}
          height={250}
          className="w-full h-64 object-cover"
        />
      );
    }
  
    const next = () => setIndex((i) => (i + 1) % images.length);
    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  
    return (
      <div className="relative w-full h-64 group overflow-hidden">
        <Image
          src={images[index]}
          alt={`${name} image ${index + 1}`}
          width={300}
          height={250}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded"
        >
          ›
        </button>
      </div>
    );
  }

  const ProductCard = ({ product, showSimilar = false }: { product: Product; showSimilar?: boolean }) => {
    const [showSimilarProducts, setShowSimilarProducts] = useState(false)
    const similarProducts = getSimilarProducts(product, 3)
  
    return (
      <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 md:group-hover:-translate-y-2 bg-white border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <ProductImageSlider images={product.images} name={product.name} />
            <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm px-2 sm:px-3">
              {product.badge}
            </Badge>
            {product.featured && (
              <Badge className="absolute top-2 right-8 sm:top-3 sm:right-12 bg-yellow-500 text-black text-xs sm:text-sm px-2 sm:px-3">
                <Star className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                Featured
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge className="bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                  Out of Stock
                </Badge>
              </div>
            )}
            <Button
              size="icon"
              variant="ghost"
              className={`absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/80 hover:bg-white transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10 ${
                wishlist.includes(product.id) ? "text-red-500" : "text-gray-600"
              }`}
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${wishlist.includes(product.id) ? "fill-current" : ""}`} />
            </Button>
  
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex gap-1 sm:gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 md:group-hover:translate-y-0">
              <Button
                className={`flex-1 text-white shadow-lg text-xs sm:text-sm py-1 sm:py-2 ${
                  product.inStock ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              {showSimilar && similarProducts.length > 0 && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white shadow-lg h-8 w-8 sm:h-10 sm:w-10"
                  onClick={() => setShowSimilarProducts(true)}
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>
          </div>
  
          <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                  <span className="text-xs sm:text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">({product.reviews})</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                {product.organic && (
                  <Badge variant="outline" className="text-green-600 border-green-600 text-[10px] sm:text-xs px-1 sm:px-2">
                    Organic
                  </Badge>
                )}
                {product.inStock && (
                  <span className="text-[10px] sm:text-xs text-green-600">{product.stockCount} in stock</span>
                )}
              </div>
            </div>
  
            <h3 className="font-bold text-base sm:text-lg group-hover:text-emerald-600 transition-colors line-clamp-2 md:group-hover:text-emerald-600">
              {product.name}
            </h3>
  
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{product.description}</p>
  
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-lg sm:text-2xl font-bold text-emerald-600">{formatPrice(product.price)}</span>
                <span className="text-xs sm:text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
              </div>
              <div className="text-xs sm:text-sm text-green-600 font-semibold">
                Save {formatPrice(product.originalPrice - product.price)}
              </div>
            </div>
          </div>
        </CardContent>
  
        <Dialog open={showSimilarProducts} onOpenChange={setShowSimilarProducts}>
          <DialogContent className="max-w-[95vw] sm:max-w-3xl p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Similar to {product.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 max-h-[70vh] overflow-y-auto">
              {similarProducts.map((similarProduct) => (
                <Card key={similarProduct.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-2 sm:p-4">
                    <MiniImageSlider
                      images={similarProduct.images || []}
                      name={similarProduct.name}
                    />
                    <h4 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2">{similarProduct.name}</h4>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-base sm:text-lg font-bold text-emerald-600">{formatPrice(similarProduct.price)}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-2 w-2 sm:h-3 sm:w-3 text-yellow-400 fill-current" />
                        <span className="text-[10px] sm:text-xs">{similarProduct.rating}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className={`w-full text-xs sm:text-sm ${
                        similarProduct.inStock
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        addToCart(similarProduct)
                        setShowSimilarProducts(false)
                      }}
                      disabled={!similarProduct.inStock}
                    >
                      {similarProduct.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    )
  }

 // Inside FoodEcommerce component, replace the FilterSidebar definition with this:

const FilterSidebar = () => {
  // Get unique badges from all products for the filter options
  const uniqueBadges = [...new Set(allProducts.map((product) => product.badge).filter(Boolean))] as string[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Price Range</h4>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))}
            max={5000000}
            min={0}
            step={50000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Categories</h4>
        <div className="space-y-2">
          {categories.slice(1).map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={filters.categories.includes(category.name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters((prev) => ({ ...prev, categories: [...prev.categories, category.name] }));
                  } else {
                    setFilters((prev) => ({
                      ...prev,
                      categories: prev.categories.filter((c) => c !== category.name),
                    }));
                  }
                }}
              />
              <label htmlFor={category.id} className="text-sm flex items-center gap-2 cursor-pointer">
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <span className="text-gray-500">({category.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Minimum Rating</h4>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.ratings.includes(rating)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters((prev) => ({ ...prev, ratings: [...prev.ratings, rating] }));
                  } else {
                    setFilters((prev) => ({ ...prev, ratings: prev.ratings.filter((r) => r !== rating) }));
                  }
                }}
              />
              <label htmlFor={`rating-${rating}`} className="text-sm flex items-center gap-1 cursor-pointer">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span>& up</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {uniqueBadges.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Badges</h4>
          <div className="space-y-2">
            {uniqueBadges.map((badge) => (
              <div key={badge} className="flex items-center space-x-2">
                <Checkbox
                  id={`badge-${badge}`}
                  checked={filters.badges.includes(badge)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters((prev) => ({ ...prev, badges: [...prev.badges, badge] }));
                    } else {
                      setFilters((prev) => ({ ...prev, badges: prev.badges.filter((b) => b !== badge) }));
                    }
                  }}
                />
                <label htmlFor={`badge-${badge}`} className="text-sm cursor-pointer">
                  {badge}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-medium">Special Filters</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStockOnly}
              onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, inStockOnly: !!checked }))}
            />
            <label htmlFor="in-stock" className="text-sm cursor-pointer">
              In Stock Only
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="organic"
              checked={filters.organicOnly}
              onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, organicOnly: !!checked }))}
            />
            <label htmlFor="organic" className="text-sm cursor-pointer">
              Organic Only
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex items-center space-x-4 animate-pulse">
        {/* Custom Logo Box */}
        <div className="w-20 h-14 sm:w-32 sm:h-38 bg-transparent p-0 rounded-xl overflow-hidden isolate flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <img
            src="/images/ecommerce_logo.png"
            alt="Protiin logo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}



  if (allProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">No products available. Please try again later.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white py-2 px-4 animate-in slide-in-from-top duration-500">
      <div className="hidden sm:flex max-w-7xl mx-auto justify-between items-center text-sm px-4 py-3">
  <div className="flex items-center gap-6">
    <div className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
      <Phone className="h-4 w-4" />
      <span>+234 8012 345 6789</span>
    </div>
    <div className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
      <Mail className="h-4 w-4" />
      <span>hello@freshfarm.com</span>
    </div>
  </div>
  <div className="flex items-center gap-4">
    <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
      Free delivery on orders over {formatPrice(2500000)}!
    </div>
    {/* <div className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <select className="bg-transparent border-none text-white cursor-pointer">
        <option>English</option>
        <option>Hausa</option>
        <option>Yoruba</option>
        <option>Igbo</option>
      </select>
    </div> */}
  </div>
</div>
      </div>

      <header className="bg-white shadow-lg border-b sticky top-0 z-50 backdrop-blur-md bg-white/95">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
    <div className="flex items-center justify-between flex-wrap gap-2">
      {/* Logo Section */}
      <Button
        variant="ghost"
        className="flex items-center gap-2 sm:gap-3 group p-0 hover:bg-transparent"
        onClick={() => setCurrentPage("home")}
      >
        <div className="w-20 h-14 sm:w-32 sm:h-38 rounded-xl overflow-hidden isolate flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <img
            src="/images/ecommerce_logo.png"
            alt="Protiin logo"
            className="w-full h-full  object-cover"
          />
        </div>
        <div>
          {/* <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
            Protiin
          </span> */}
          {/* <div className="text-xs text-gray-500">Farm to Table</div> */}
        </div>
      </Button>

      {/* Delivery Location (Visible on larger screens) */}
      <div className="hidden sm:flex items-center gap-2 text-sm bg-gray-50 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
        <MapPin className="h-4 w-4 text-emerald-600" />
        <div>
          <span className="text-gray-500">Deliver to</span>
          <div className="font-semibold">Lagos, Nigeria</div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xs sm:max-w-md lg:max-w-lg mx-2 sm:mx-4 order-2 sm:order-1 w-full sm:w-auto">
        <div className="relative w-full group">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
          <Input
            placeholder="Search for fresh products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 sm:pl-12 pr-20 sm:pr-24 py-2 sm:py-3 w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-sm sm:text-base"
          />
          <Button
            size="sm"
            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs sm:text-sm px-2 sm:px-3"
            onClick={() => setCurrentPage("products")}
          >
            Search
          </Button>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-1 sm:gap-3 order-1 sm:order-2">
        {/* Wishlist Button */}
        <Button variant="ghost" size="icon" className="relative hover:bg-emerald-50 transition-colors h-10 w-10">
          <Heart className="h-4 sm:h-5 w-4 sm:w-5" />
          {wishlist.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-xs">
              {wishlist.length}
            </Badge>
          )}
        </Button>

        {/* Cart Sheet */}
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-emerald-50 transition-colors group h-10 w-10">
              <ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5 group-hover:scale-110 transition-transform" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 flex items-center justify-center bg-yellow-500 text-black text-xs font-bold animate-bounce">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopping Cart ({getTotalItems()} items)
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 sm:h-16 w-12 sm:w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <p className="text-sm text-gray-400">Add some featured products to get started!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-[60vh] sm:max-h-96 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MiniImagesSlider
                          images={item.images || []}
                          name={item.name}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{item.name}</h4>
                          <p className="text-emerald-600 font-bold">{formatPrice(item.price)}</p>
                          {item.featured && (
                            <Badge className="text-xs bg-yellow-100 text-yellow-800">Featured</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7 sm:h-8 sm:w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 sm:w-8 text-center font-semibold text-sm">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7 sm:h-8 sm:w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:bg-red-50"
                          onClick={() => updateQuantity(item.id, 0)}
                        >
                          <X className="h-3 sm:h-4 w-3 sm:w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                      <span>Total: {formatPrice(getTotalPrice())}</span>
                    </div>
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 sm:py-3 text-sm sm:text-base"
                      onClick={() => {
                        if (!session) {
                          setLoginAction("proceed to checkout")
                          setShowLoginRequired(true)
                          return
                        }
                        setIsCartOpen(false)
                        setIsCheckoutOpen(true)
                      }}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* User Menu */}
        <UserMenu />

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="sm:hidden h-10 w-10">
              <Menu className="h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <div>
                  <span className="text-gray-500">Deliver to</span>
                  <div className="font-semibold">Lagos, Nigeria</div>
                </div>
              </div>
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
              />
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className="justify-start text-left py-2"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                  <span className="ml-auto text-gray-500">({category.count})</span>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </div>
</header>

      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-8 overflow-x-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Menu className="h-4 w-4 mr-2" />
                  All Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => handleCategoryClick(category.name)}
                    className="cursor-pointer hover:bg-emerald-50 flex items-center gap-3 py-3"
                  >
                    <span className="text-lg">{category.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.count} products</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden md:flex items-center gap-8">
              {categories.slice(1, 5).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`text-gray-700 hover:text-emerald-600 py-4 font-medium transition-all duration-300 border-b-2 border-transparent hover:border-emerald-600 flex items-center gap-2 ${
                    selectedCategory === category.name ? "text-emerald-600 border-emerald-600" : ""
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                  <span className="text-xs text-gray-500">({category.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {currentPage === "home" ? (
        <>
          <section className="relative bg-gradient-to-br from-emerald-50 via-white to-yellow-50 py-20 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-5"></div>
            <div className="max-w-7xl mx-auto px-4 relative">
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-6 space-y-8 animate-in slide-in-from-left duration-700">
                  <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
                    <Star className="h-4 w-4 fill-current" />
                    #1 Fresh Food Delivery in Nigeria
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                      <span className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                        Farm Fresh
                      </span>
                      <br />
                      <span className="text-gray-800">Delivered</span>
                      <br />
                      <span className="bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                        Daily
                      </span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                      Experience the authentic taste of home with our premium farm-fresh ingredients. From field to your
                      table in 24 hours across Nigeria.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 textպ
                      text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={() => setCurrentPage("products")}
                    >
                      Shop Featured Products
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg rounded-xl transition-all duration-300"
                    >
                      Watch Story
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-6 pt-8">
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-200 transition-colors">
                        <Truck className="h-8 w-8 text-emerald-600" />
                      </div>
                      <div className="font-semibold text-gray-800">Free Delivery</div>
                      <div className="text-sm text-gray-500">Orders over {formatPrice(2500000)}</div>
                    </div>
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-200 transition-colors">
                        <Shield className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div className="font-semibold text-gray-800">Quality Assured</div>
                      <div className="text-sm text-gray-500">100% Fresh</div>
                    </div>
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                        <Clock className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="font-semibold text-gray-800">24hr Fresh</div>
                      <div className="text-sm text-gray-500">Farm to table</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 relative animate-in slide-in-from-right duration-700 delay-300">
                  <div className="relative">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                      <Image
                        src="/images/hero-vegetables.jpeg"
                        alt="Fresh vegetables and produce"
                        width={600}
                        height={600}
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl animate-bounce">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Star className="h-6 w-6 text-green-600 fill-current" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">4.9/5</div>
                          <div className="text-sm text-gray-500">5000+ Reviews</div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Zap className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">{featuredProducts.length}</div>
                          <div className="text-sm text-gray-500">Featured Items</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="featured-products" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Star className="h-4 w-4 fill-current" />
                  Featured Products
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Handpicked for You</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our carefully selected featured products represent the best quality and value from our farm partners
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {featuredProducts.slice(0, 8).map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in-0 slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} showSimilar={true} />
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3"
                  onClick={() => setCurrentPage("products")}
                >
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedCategory === "All" ? "All Products" : selectedCategory}
                </h1>
                <p className="text-gray-600 mt-1">
                  {filteredProducts.length} products found
                  {searchQuery && <span> for "{searchQuery}"</span>}
                </p>
              </div>
              <div className="flex items-center gap-2 md:gap-4 flex-wrap md:flex-nowrap">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-1 px-2 py-2 text-sm md:gap-2 md:px-4"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="hidden sm:inline">Filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72">
                    <SheetHeader>
                      <SheetTitle>Filter Products</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-24 sm:w-28 md:w-40 text-[11px] sm:text-xs px-2 py-1 flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>

                  <SelectContent side="bottom" className="text-sm">
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price ↑</SelectItem>
                    <SelectItem value="price-high">Price ↓</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
        </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24 bg-white p-6 rounded-lg shadow-sm border">
                  <FilterSidebar />
                </div>
              </div>

              <div className="lg:col-span-4">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="animate-in fade-in-0 slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <ProductCard product={product} showSimilar={true} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                    <Button onClick={resetFilters} variant="outline">
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

<Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
  <DialogContent className="w-full max-w-[95vw] sm:max-w-3xl md:max-w-5xl lg:max-w-7xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
    {/* Adjusted max-width for responsiveness, using viewport width for mobile */}
    <DialogHeader>
      <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
        Secure Checkout
      </DialogTitle>
    </DialogHeader>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
      {/* Changed to single-column on mobile, 3-column on md+ */}
      <div className="md:col-span-2 space-y-6 sm:space-y-8">
        {/* Delivery Information */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg space-y-4">
          <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
            <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
            Delivery Information
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {/* Stacked inputs on mobile, 2-column on sm+ */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">First Name *</label>
              <Input placeholder="Enter your first name" className="text-xs sm:text-sm w-full h-8 sm:h-10" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Last Name *</label>
              <Input placeholder="Enter your last name" className="text-xs sm:text-sm w-full h-8 sm:h-10" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Phone Number *</label>
              <div className="flex">
                <div className="flex items-center px-2 sm:px-3 bg-gray-100 border border-r-0 rounded-l-md">
                  <span className="text-xs sm:text-sm font-medium">+234</span>
                </div>
                <Input placeholder="8012345678" className="text-xs sm:text-sm rounded-l-none flex-1 h-8 sm:h-10" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email Address *</label>
              <Input type="email" placeholder="your.email@example.com" className="text-xs sm:text-sm w-full h-8 sm:h-10" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Delivery Address *</label>
              <Input placeholder="Enter your full address" className="text-xs sm:text-sm w-full h-8 sm:h-10" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">State *</label>
              <Select>
                <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-10">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lagos">Lagos</SelectItem>
                  <SelectItem value="abuja">FCT Abuja</SelectItem>
                  <SelectItem value="kano">Kano</SelectItem>
                  <SelectItem value="rivers">Rivers</SelectItem>
                  <SelectItem value="oyo">Oyo</SelectItem>
                  <SelectItem value="kaduna">Kaduna</SelectItem>
                  <SelectItem value="ogun">Ogun</SelectItem>
                  <SelectItem value="plateau">Plateau</SelectItem>
                  <SelectItem value="delta">Delta</SelectItem>
                  <SelectItem value="edo">Edo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">City/LGA *</label>
              <Input placeholder="Enter city or LGA" className="text-xs sm:text-sm w-full h-8 sm:h-10" />
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <h4 className="font-medium text-sm sm:text-gray-900 mb-2 sm:mb-3">Delivery Options</h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="delivery"
                  value="standard"
                  className="text-emerald-600 h-4 w-4 sm:h-5 sm:w-5"
                  checked={deliveryOption === "standard"}
                  onChange={() => setDeliveryOption("standard")}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs sm:text-sm">Standard Delivery (2-3 days)</span>
                    <span className="text-emerald-600 font-semibold text-xs sm:text-sm">FREE</span>
                  </div>
                  <p className="text-xs text-gray-500">Free delivery for orders above {formatPrice(2500000)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="delivery"
                  value="express"
                  className="text-emerald-600 h-4 w-4 sm:h-5 sm:w-5"
                  checked={deliveryOption === "express"}
                  onChange={() => setDeliveryOption("express")}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs sm:text-sm">Express Delivery (Same day)</span>
                    <span className="text-emerald-600 font-semibold text-xs sm:text-sm">{formatPrice(250000)}</span>
                  </div>
                  <p className="text-xs text-gray-500">Available in Lagos, Abuja, and Port Harcourt</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white border rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
          <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
            Payment Method
          </h3>

          {/* Payment Options */}
          <div className="space-y-3 sm:space-y-4">
            {/* Card Payment */}
            <div className="border rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <input type="radio" name="payment" value="card" className="text-emerald-600 h-4 w-4 sm:h-5 sm:w-5" defaultChecked />
                <label className="font-medium flex items-center gap-2 text-xs sm:text-sm">
                  💳 Debit/Credit Card
                  <div className="flex gap-1">
                    <img src="/placeholder.svg?height=16&width=24" alt="Visa" className="h-4 sm:h-5" />
                    <img src="/placeholder.svg?height=16&width=24" alt="Mastercard" className="h-4 sm:h-5" />
                    <img src="/placeholder.svg?height=16&width=24" alt="Verve" className="h-4 sm:h-5" />
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 ml-4 sm:ml-6">
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Card Number</label>
                  <Input placeholder="1234 5678 9012 3456" className="text-xs sm:text-sm w-full h-8 sm:h-10" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Expiry Date</label>
                  <Input placeholder="MM/YY" className="text-xs sm:text-sm w-full h-8 sm:h-10" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">CVV</label>
                  <Input placeholder="123" className="text-xs sm:text-sm w-full h-8 sm:h-10" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Cardholder Name</label>
                  <Input placeholder="Name on card" className="text-xs sm:text-sm w-full h-8 sm:h-10" />
                </div>
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="border rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <input type="radio" name="payment" value="transfer" className="text-emerald-600 h-4 w-4 sm:h-5 sm:w-5" />
                <label className="font-medium flex items-center gap-2 text-xs sm:text-sm">
                  🏦 Bank Transfer
                  <Badge className="bg-green-100 text-green-800 text-xs">Instant</Badge>
                </label>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 ml-4 sm:ml-6">
                Pay directly from your bank account using USSD, Internet Banking, or Bank App
              </p>
            </div>

            {/* USSD Payment */}
            <div className="border rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <input type="radio" name="payment" value="ussd" className="text-emerald-600 h-4 w-4 sm:h-5 sm:w-5" />
                <label className="font-medium flex items-center gap-2 text-xs sm:text-sm">
                  📱 USSD Payment
                  <Badge className="bg-blue-100 text-blue-800 text-xs">No Internet Required</Badge>
                </label>
              </div>
              <div className="ml-4 sm:ml-6 space-y-2">
                <p className="text-xs sm:text-sm text-gray-600">Pay using your phone without internet connection</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">GTBank *737#</Badge>
                  <Badge variant="outline" className="text-xs">Access *901#</Badge>
                  <Badge variant="outline" className="text-xs">Zenith *966#</Badge>
                  <Badge variant="outline" className="text-xs">UBA *919#</Badge>
                </div>
              </div>
            </div>

            {/* Mobile Money */}
            <div className="border rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <input type="radio" name="payment" value="mobile" className="text-emerald-600 h-4 w-4 sm:h-5 sm:w-5" />
                <label className="font-medium flex items-center gap-2 text-xs sm:text-sm">
                  📲 Mobile Money
                  <Badge className="bg-purple-100 text-purple-800 text-xs">Quick & Easy</Badge>
                </label>
              </div>
              <div className="ml-4 sm:ml-6 space-y-2">
                <p className="text-xs sm:text-sm text-gray-600">Pay with your mobile wallet</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Opay</Badge>
                  <Badge variant="outline" className="text-xs">PalmPay</Badge>
                  <Badge variant="outline" className="text-xs">Kuda</Badge>
                  <Badge variant="outline" className="text-xs">Carbon</Badge>
                </div>
              </div>
            </div>

            {/* Pay on Delivery */}
            <div className="border rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <input type="radio" name="payment" value="cod" className="text-emerald-600 h-4 w-4 sm:h-5 sm:w-5" />
                <label className="font-medium flex items-center gap-2 text-xs sm:text-sm">
                  🚚 Pay on Delivery
                  <Badge className="bg-orange-100 text-orange-800 text-xs">Cash/POS</Badge>
                </label>
              </div>
              <div className="ml-4 sm:ml-6 space-y-2">
                <p className="text-xs sm:text-sm text-gray-600">Pay with cash or POS when your order arrives</p>
                <p className="text-xs text-orange-600">Additional ₦500 service fee applies</p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-xs sm:text-sm text-green-900">Secure Payment</h4>
                <p className="text-xs sm:text-sm text-green-700">
                  Your payment information is encrypted and secure. We use industry-standard SSL encryption and
                  are PCI DSS compliant. We never store your card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="space-y-4 sm:space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
          <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            Order Summary
          </h3>
          <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg">
                <div className="flex gap-2 overflow-x-auto max-w-[80px] sm:max-w-[120px]">
                  <ImageSlider images={item.images || []} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-xs sm:text-sm">{item.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold text-xs sm:text-sm">{formatPrice(item.price)}</span>
                    {item.featured && <Badge className="text-xs bg-yellow-100 text-yellow-800">Featured</Badge>}
                  </div>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs sm:text-sm">{formatPrice(item.price * item.quantity)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Totals */}
          <Separator className="my-3 sm:my-4" />
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span>Delivery Fee</span>
              <span className={deliveryOption === "standard" ? "text-green-600" : ""}>
                {deliveryOption === "standard" ? "FREE" : formatPrice(getDeliveryFee(deliveryOption))}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span>Service Fee</span>
              <span>₦0</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base sm:text-lg">
              <span>Total</span>
              <span className="text-emerald-600">{formatPrice(getTotalWithDelivery(deliveryOption))}</span>
            </div>
            <p className="text-xs text-gray-500">
              You save{" "}
              {formatPrice(
                cartItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0),
              )}{" "}
              on this order!
            </p>
          </div>
        </div>

        {/* Recommended Products */}
        <div>
          <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            Add to your order
          </h3>
          <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-80 overflow-y-auto">
            {getRecommendedProducts().slice(0, 4).map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-2 sm:p-3">
                  <div className="flex gap-2 sm:gap-3">
                    <MiniImageSlider
                      images={product.images || []}
                      name={product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-xs sm:text-sm mb-1">{product.name}</h4>
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <span className="text-emerald-600 font-bold text-xs sm:text-sm">{formatPrice(product.price)}</span>
                        {product.featured && (
                          <Badge className="text-xs bg-yellow-100 text-yellow-800">Featured</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mb-1 sm:mb-2">
                        <Star className="h-2 w-2 sm:h-3 sm:w-3 text-yellow-400 fill-current" />
                        <span className="text-xs">{product.rating}</span>
                      </div>
                      <Button
                        size="sm"
                        className={`w-full text-xs ${
                          product.inStock
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-gray-400 cursor-not-allowed"
                        } h-8 sm:h-9`}
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? "Add +" : "Out of Stock"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Place Order Button */}
        <div className="space-y-3 sm:space-y-4">
          <Button
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={async () => {
              try {
                const orderData = {
                  items: cartItems.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price / 100,
                  })),
                  totalAmount: getTotalWithDelivery(deliveryOption) / 100,
                  deliveryFee: 0,
                  deliveryAddress: "Sample Address",
                  deliveryCity: "Lagos",
                  deliveryState: "Lagos",
                  phone: "+2348012345678",
                  email: "customer@example.com",
                  firstName: "John",
                  lastName: "Doe",
                  paymentMethod: "card",
                };

                const orderResponse = await fetch("/api/orders", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(orderData),
                });

                const order = await orderResponse.json();

                if (orderResponse.ok) {
                  const paymentResponse = await fetch("/api/payment/initialize", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      orderId: order.id,
                      email: orderData.email,
                      amount: getTotalPrice() / 100,
                      callbackUrl: `${window.location.origin}/payment/callback`,
                    }),
                  });

                  const paymentData = await paymentResponse.json();

                  if (paymentData.status) {
                    window.location.href = paymentData.data.authorization_url;
                  } else {
                    alert("Failed to initialize payment. Please try again.");
                  }
                } else {
                    alert("Failed to create order. Please try again.");
                }
              } catch (error) {
                console.error("Error processing order:", error);
                alert("An error occurred. Please try again.");
              }
            }}
          >
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Complete Order - {formatPrice(getTotalWithDelivery(deliveryOption))}
          </Button>
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By placing this order, you agree to our{" "}
              <Link href="#" className="text-emerald-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-emerald-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>
      {/* Login Required Dialog */}
      <LoginRequired
        isOpen={showLoginRequired}
        onClose={() => setShowLoginRequired(false)}
        action={loginAction}
        onSuccess={() => {
          // If user was trying to checkout, open checkout dialog
          if (loginAction === "proceed to checkout") {
            setIsCheckoutOpen(true)
          }
        }}
      />

      {/* Enhanced Newsletter */}
      <section className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=800')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="animate-in slide-in-from-bottom duration-700">
            <h2 className="text-4xl font-bold text-white mb-4">Stay Fresh with Our Newsletter</h2>
            <p className="text-emerald-100 mb-8 text-lg">
              Get exclusive deals on featured products, fresh arrivals, and healthy recipes delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="flex-1 bg-white/90 backdrop-blur border-0 py-3 rounded-xl"
              />
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div>
                  <span className="text-xl font-bold">FreshFarm</span>
                  <div className="text-xs text-gray-400">Farm to Table</div>
                </div>
              </div>
              <p className="text-gray-400">
                Bringing fresh, quality ingredients from farm to your table with love and care across Nigeria.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>+234 8012 345 6789</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                {["About Us", "Contact", "FAQ", "Shipping Info", "Returns"].map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Featured Categories</h3>
              <ul className="space-y-3 text-gray-400">
                {categories.slice(1, 6).map((category) => (
                  <li key={category.name}>
                    <button
                      onClick={() => handleCategoryClick(category.name)}
                      className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block text-left"
                    >
                      {category.icon} {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Customer Service</h3>
              <ul className="space-y-3 text-gray-400">
                {["Help Center", "Track Order", "Privacy Policy", "Terms of Service"].map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors hover:translate-x-1 transform duration-300 inline-block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="bg-gray-800 mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
            <p>&copy; 2024 FreshFarm. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <span>Follow us:</span>
              <div className="flex gap-4">
                {["Facebook", "Twitter", "Instagram"].map((social) => (
                  <Link key={social} href="#" className="hover:text-white transition-colors">
                    {social}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
