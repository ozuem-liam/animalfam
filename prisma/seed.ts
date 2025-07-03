// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Animal Based Proteins' },
      update: {},
      create: {
        name: 'Animal Based Proteins',
        icon: '🥩',
        description: 'Fresh, Tender sourced meats',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Seafood Proteins' },
      update: {},
      create: {
        name: 'Seafood Proteins',
        icon: '🐟',
        description: 'Fresh meat and seafood',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Dairy & Eggs' },
      update: {},
      create: {
        name: 'Dairy & Eggs',
        icon: '🥛',
        description: 'Fresh dairy products',
      },
    }),    
  ]);

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'animalfam.help@gmail.com' },
    update: {},
    create: {
      email: 'animalfam.help@gmail.com',
      password: adminPassword,
      firstName: 'Michael',
      lastName: 'Dikandu',
      phone: '+2348012345678',
      role: 'ADMIN',
    },
  });

  // // Create demo customer user
  // const customerPassword = await bcrypt.hash('customer123', 12);
  // await prisma.user.upsert({
  //   where: { email: 'customer@AnimalFam.com' },
  //   update: {},
  //   create: {
  //     email: 'customer@AnimalFam.com',
  //     password: customerPassword,
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     phone: '+2348087654321',
  //     role: 'CUSTOMER',
  //   },
  // });

  // Find categories
  const animalBasedProtein = categories.find((c) => c.name === 'Animal Based Proteins')!;
  const seafoodCategory = categories.find((c) => c.name === 'Seafood Proteins')!;
  const dairyCategory = categories.find((c) => c.name === 'Dairy & Eggs')!;  


  // Define products
  const products = [
    {
      name: 'Fresh Whole Chicken',
      description: 'Free-range, hormone-free whole chicken ideal for roasting and grilling',
      price: 1500000,
      originalPrice: 3500000,
      images: ['/images/chicken.jpeg', '/images/chicken2.jpeg'], // Make sure images are in the public/images folder
      rating: 4.8,
      reviews: 124,
      badge: 'Organic',
      tags: ['fresh', 'poultry', 'organic', 'meat', 'protein'],
      featured: true,
      bestSeller: true,
      organic: true,
      inStock: true,
      stockCount: 45,
      categoryId: animalBasedProtein.id, // You can rename or switch from vegetableCategory if needed
    },    
      {
        name: 'Farm Fresh Eggs',
        description: 'Organic, free-range eggs packed with protein and flavor — perfect for any meal.',
        price: 650000,
        originalPrice: 700000,
        images: ['/images/egg2.jpeg', '/images/eggs.jpeg'], // Ensure these exist in /public/images
        rating: 4.9,
        reviews: 89,
        badge: 'Best Seller',
        tags: ['eggs', 'organic', 'protein', 'breakfast'],
        featured: true,
        bestSeller: true,
        organic: true,
        inStock: true,
        stockCount: 23,
        categoryId: dairyCategory.id, // or poultryCategory.id, depending on your category structure
      },
      {
        name: 'Premium Grass-Fed Beef',
        description: 'Tender and flavorful grass-fed beef cuts, perfect for grilling and roasting.',
        price: 1500000,
        originalPrice: 2000000,
        images: ['/images/beef.jpeg', '/images/beef2.jpeg'], // Ensure these images exist in /public/images
        rating: 4.7,
        reviews: 156,
        badge: 'Organic',
        tags: ['beef', 'meat', 'grass-fed', 'protein'],
        featured: true,
        bestSeller: false,
        organic: true,
        inStock: true,
        stockCount: 67,
        categoryId: animalBasedProtein.id, // Replace with your actual meat category reference
      },      
      {
        name: 'Titus Mackerel',
        description: 'Rich and flavorful Titus (mackerel) fish, perfect for stews and grilling. Packed with omega-3.',
        price: 700000,
        originalPrice: 1000000,
        images: ['/images/titus.jpeg', '/images/titus2.jpeg'], // Ensure these are in /public/images
        rating: 4.6,
        reviews: 67,
        badge: 'Fresh',
        tags: ['titus', 'mackerel', 'fish', 'omega3', 'protein'],
        featured: true,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 12,
        categoryId: seafoodCategory.id, // or create `seafoodCategory` if you haven't yet
      },
      {
        name: 'Aged Cheddar Cheese',
        description: 'Rich and sharp aged cheddar cheese, perfect for sandwiches, snacks, and gourmet cooking.',
        price: 200000,
        originalPrice: 350000,
        images: ['/images/chesse3.jpeg', '/images/chesse2.jpeg'], // Make sure these exist in /public/images
        rating: 4.9,
        reviews: 203,
        badge: 'Best Seller',
        tags: ['cheese', 'cheddar', 'dairy', 'gourmet'],
        featured: false,
        bestSeller: true,
        organic: false,
        inStock: true,
        stockCount: 34,
        categoryId: dairyCategory.id,
      },      
    {
      name: 'Greek Yogurt',
      description: 'Creamy Greek yogurt packed with probiotics and protein',
      price: 100000,
      originalPrice: 1500000,
      images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&crop=center'],
      rating: 4.8,
      reviews: 156,
      badge: 'Protein',
      tags: ['yogurt', 'greek', 'protein', 'dairy'],
      featured: true,
      bestSeller: true,
      organic: false,
      inStock: true,
      stockCount: 78,
      categoryId: dairyCategory.id,
    },
    {
      name: 'Fresh Crabs',
      description: 'Wild-caught crabs, perfect for soups, stews, and seafood boils.',
      price: 300000,
      originalPrice: 500000,
      images: ['/images/crabs.jpeg', '/images/crabs2.jpeg'], // Ensure these exist in /public/images
      rating: 4.8,
      reviews: 156,
      badge: 'Protein',
      tags: ['crab', 'seafood', 'fresh', 'protein'],
      featured: true,
      bestSeller: true,
      organic: false,
      inStock: true,
      stockCount: 78,
      categoryId: seafoodCategory.id, // Use seafood/fish category
    },
      {
        name: 'Fresh Jumbo Shrimp',
        description: 'Succulent wild-caught jumbo shrimp, ideal for grilling, frying, or seafood pasta.',
        price: 3000000,
        originalPrice: 4000000,
        images: ['/images/shrimp.jpeg', '/images/shrimp2.jpeg'], // Ensure these exist in /public/images
        rating: 4.8,
        reviews: 156,
        badge: 'Protein',
        tags: ['shrimp', 'seafood', 'fresh', 'protein'],
        featured: true,
        bestSeller: true,
        organic: false,
        inStock: true,
        stockCount: 78,
        categoryId: seafoodCategory.id,
      }      
  ];

  // Create products
  for (const productData of products) {
    await prisma.product.upsert({
      where: { name: productData.name },
      update: {},
      create: productData,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });