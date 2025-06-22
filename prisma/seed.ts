// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Fresh Vegetables' },
      update: {},
      create: {
        name: 'Fresh Vegetables',
        icon: '🥬',
        description: 'Fresh, locally sourced vegetables',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Grains & Flour' },
      update: {},
      create: {
        name: 'Grains & Flour',
        icon: '🌾',
        description: 'Quality grains and flour products',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Meat & Seafood' },
      update: {},
      create: {
        name: 'Meat & Seafood',
        icon: '🐟',
        description: 'Fresh meat and seafood',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Condiments' },
      update: {},
      create: {
        name: 'Condiments',
        icon: '🍯',
        description: 'Spices, sauces, and condiments',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Dairy Products' },
      update: {},
      create: {
        name: 'Dairy Products',
        icon: '🥛',
        description: 'Fresh dairy products',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Fruits' },
      update: {},
      create: {
        name: 'Fruits',
        icon: '🍎',
        description: 'Fresh seasonal fruits',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Beverages' },
      update: {},
      create: {
        name: 'Beverages',
        icon: '🥤',
        description: 'Fresh juices and beverages',
      },
    }),
  ]);

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'dikandumichael@gmail.com' },
    update: {},
    create: {
      email: 'dikandumichael@gmail.com',
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
  //   where: { email: 'customer@freshfarm.com' },
  //   update: {},
  //   create: {
  //     email: 'customer@freshfarm.com',
  //     password: customerPassword,
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     phone: '+2348087654321',
  //     role: 'CUSTOMER',
  //   },
  // });

  // Find categories
  const vegetableCategory = categories.find((c) => c.name === 'Fresh Vegetables')!;
  const grainCategory = categories.find((c) => c.name === 'Grains & Flour')!;
  const meatCategory = categories.find((c) => c.name === 'Meat & Seafood')!;
  const condimentCategory = categories.find((c) => c.name === 'Condiments')!;
  const dairyCategory = categories.find((c) => c.name === 'Dairy Products')!;
  const fruitCategory = categories.find((c) => c.name === 'Fruits')!;
  const beverageCategory = categories.find((c) => c.name === 'Beverages')!;

  // Define products
  const products = [
    {
      name: 'Fresh Tomatoes',
      description: 'Locally grown, vine-ripened tomatoes perfect for salads and cooking',
      price: 250000,
      originalPrice: 350000,
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop&crop=center'],
      rating: 4.8,
      reviews: 124,
      badge: 'Fresh',
      tags: ['fresh', 'local', 'organic', 'red'],
      featured: true,
      bestSeller: false,
      organic: true,
      inStock: true,
      stockCount: 45,
      categoryId: vegetableCategory.id,
    },
    {
      name: 'Premium Basmati Rice',
      description: 'Aromatic long-grain basmati rice, perfect for biryanis and pilafs',
      price: 650000,
      originalPrice: 800000,
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&crop=center'],
      rating: 4.9,
      reviews: 89,
      badge: 'Best Seller',
      tags: ['rice', 'basmati', 'premium', 'aromatic'],
      featured: true,
      bestSeller: true,
      organic: false,
      inStock: true,
      stockCount: 23,
      categoryId: grainCategory.id,
    },
    {
      name: 'Organic Spinach',
      description: 'Fresh organic spinach leaves, rich in iron and vitamins',
      price: 175000,
      originalPrice: 250000,
      images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&crop=center'],
      rating: 4.7,
      reviews: 156,
      badge: 'Organic',
      tags: ['spinach', 'organic', 'leafy', 'green'],
      featured: true,
      bestSeller: false,
      organic: true,
      inStock: true,
      stockCount: 67,
      categoryId: vegetableCategory.id,
    },
    {
      name: 'Atlantic Salmon',
      description: 'Wild-caught Atlantic salmon, rich in omega-3 fatty acids',
      price: 950000,
      originalPrice: 1150000,
      images: ['https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=400&fit=crop&crop=center'],
      rating: 4.6,
      reviews: 67,
      badge: 'Fresh',
      tags: ['salmon', 'fish', 'omega3', 'protein'],
      featured: true,
      bestSeller: false,
      organic: false,
      inStock: true,
      stockCount: 12,
      categoryId: meatCategory.id,
    },
    {
      name: 'Organic Honey',
      description: 'Pure organic honey from local beekeepers',
      price: 450000,
      originalPrice: 600000,
      images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop&crop=center'],
      rating: 4.9,
      reviews: 203,
      badge: 'Organic',
      tags: ['honey', 'organic', 'sweet', 'natural'],
      featured: false,
      bestSeller: true,
      organic: true,
      inStock: true,
      stockCount: 34,
      categoryId: condimentCategory.id,
    },
    {
      name: 'Greek Yogurt',
      description: 'Creamy Greek yogurt packed with probiotics and protein',
      price: 300000,
      originalPrice: 400000,
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
  console.log('Admin user created: dikandumichael@gmail.com / admin123');
  console.log('Demo customer: customer@freshfarm.com / customer123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });