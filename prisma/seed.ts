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
      },
      {
        name: "Agemawo Beef (1kg)",
        description: "High-quality Agemawo beef, perfect for stews and grilling.",
        price: 730000,
        originalPrice: 800000,
        images: [
        "https://media.istockphoto.com/id/1367125143/photo/prime-raw-marbled-meat-steaks-prepared-for-grilling-with-seasonings-and-herbs-uncooked-beef.webp?a=1&b=1&s=612x612&w=0&k=20&c=IsKgenlyQCfVNhLxJ8wDRl8Yn5bRfT_YOablDJAN4sE=",
        "https://media.istockphoto.com/id/1253060703/photo/rump-on-a-cutting-board-with-a-knife-beside-it-with-red-pepper-and-green-pepper-in-the.webp?a=1&b=1&s=612x612&w=0&k=20&c=azq2aanxjGSFucJNeZWcsqhcvL9HiFLIJ8H3X-OfdJI="
        ],
        rating: 4.6,
        reviews: 85,
        badge: "Fresh",
        tags: ["beef", "meat", "fresh", "protein"],
        featured: true,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 50,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Plain Beef with Bone (1kg)",
        description: "Fresh plain beef with bone, ideal for hearty soups and stews.",
        price: 730000,
        originalPrice: 800000,
        images: [
        "https://media.istockphoto.com/id/1580779694/photo/the-king-of-steaks-the-tomahawk.webp?a=1&b=1&s=612x612&w=0&k=20&c=OcghYStFB4yXMXtRBbRngQjp4NE5xTg1ukPUA9prskY=",
        ],
        rating: 4.5,
        reviews: 70,
        badge: "Fresh",
        tags: ["beef", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 60,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Boneless Beef Topside (1kg)",
        description: "Tender boneless beef topside, ideal for roasting or grilling.",
        price: 760000,
        originalPrice: 850000,
        images: [
        "https://media.istockphoto.com/id/2215178746/photo/raw-silverside-round-beef-meat-piece-fresh-bottom-round-on-wooden-board-isolated-on-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=yBjLwT3Y1TxaRK9gTN1Lsz4l-yTBBWGJ4h6N4XpTB_0=",
        "https://media.istockphoto.com/id/2199641630/photo/fresh-raw-round-silverside-beef-meat-cut-inside-round-with-hrebs-for-roasting-wooden.webp?a=1&b=1&s=612x612&w=0&k=20&c=EdyxvjtuNJSxl66rZ7qHANWl4-iOKoHPmc_O4Ir_Igs="        ],
        rating: 4.7,
        reviews: 92,
        badge: "Premium",
        tags: ["beef", "boneless", "meat", "protein"],
        featured: true,
        bestSeller: true,
        organic: false,
        inStock: true,
        stockCount: 40,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Boneless Beef Topside (0.5kg)",
        description: "Tender boneless beef topside, perfect for smaller portions.",
        price: 380000,
        originalPrice: 420000,
        images: [
        "https://media.istockphoto.com/id/2199641630/photo/fresh-raw-round-silverside-beef-meat-cut-inside-round-with-hrebs-for-roasting-wooden.webp?a=1&b=1&s=612x612&w=0&k=20&c=EdyxvjtuNJSxl66rZ7qHANWl4-iOKoHPmc_O4Ir_Igs=",
        "https://media.istockphoto.com/id/2215178746/photo/raw-silverside-round-beef-meat-piece-fresh-bottom-round-on-wooden-board-isolated-on-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=yBjLwT3Y1TxaRK9gTN1Lsz4l-yTBBWGJ4h6N4XpTB_0="
        ],
        rating: 4.7,
        reviews: 80,
        badge: "Premium",
        tags: ["beef", "boneless", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 45,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Lean Beef (1kg)",
        description: "Lean beef, low in fat and perfect for healthy meals.",
        price: 1500000,
        originalPrice: 1650000,
        images: [
        "https://media.istockphoto.com/id/1294918677/photo/flank-steak-london-broil-jiffy-steak-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=Tt3VhpBDtGd0WG0nyWlk6ZSgJqTi-XCKzmR5yNBKlwE=",
        "https://images.unsplash.com/photo-1690983323238-0b91789e1b5a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8TGVhbiUyMEJlZWZ8ZW58MHx8MHx8fDA%3D"        ],
        rating: 4.8,
        reviews: 110,
        badge: "Healthy",
        tags: ["beef", "lean", "meat", "protein"],
        featured: true,
        bestSeller: true,
        organic: false,
        inStock: true,
        stockCount: 30,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Lean Beef (0.5kg)",
        description: "Lean beef for smaller portions, ideal for healthy cooking.",
        price: 750000,
        originalPrice: 820000,
        images: [
        "https://images.unsplash.com/photo-1690983323238-0b91789e1b5a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8TGVhbiUyMEJlZWZ8ZW58MHx8MHx8fDA%3D",
        "https://media.istockphoto.com/id/1294918677/photo/flank-steak-london-broil-jiffy-steak-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=Tt3VhpBDtGd0WG0nyWlk6ZSgJqTi-XCKzmR5yNBKlwE="
        ],
        rating: 4.8,
        reviews: 95,
        badge: "Healthy",
        tags: ["beef", "lean", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 35,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Tenderloin Fillet Steak (1kg)",
        description: "Premium tenderloin fillet steak, perfect for gourmet dishes.",
        price: 860000,
        originalPrice: 950000,
        images: [
        "https://media.istockphoto.com/id/157681614/photo/beef-tenderloin-steaks.webp?a=1&b=1&s=612x612&w=0&k=20&c=uq7fjOOxoUoMEg4ft4U82THgsNzyu9KNwmTiGHIZX7c=",
        "https://media.istockphoto.com/id/1380903868/photo/beef-fillet-steak.webp?a=1&b=1&s=612x612&w=0&k=20&c=C3z9I2AVx3cv-Nd8328MR8FA1D295UshuN4-5b766es="
        ],
        rating: 4.9,
        reviews: 130,
        badge: "Premium",
        tags: ["beef", "tenderloin", "steak", "protein"],
        featured: true,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 25,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Torso Beef (1kg)",
        description: "Fresh torso beef, ideal for slow-cooked dishes and stews.",
        price: 820000,
        originalPrice: 900000,
        images: [
        "https://media.istockphoto.com/id/170027230/photo/butcher.webp?a=1&b=1&s=612x612&w=0&k=20&c=8-rVvYb6zMYdyF2HtoXSWfcJGvZ2AKUVHawUT6AlYDg=",
        "https://images.unsplash.com/photo-1701913364117-c806e46550af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8VG9yc28lMjBCZWVmfGVufDB8fDB8fHww"        ],
        rating: 4.5,
        reviews: 65,
        badge: "Fresh",
        tags: ["beef", "meat", "fresh", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 55,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Torso Beef (0.5kg)",
        description: "Fresh torso beef for smaller portions, ideal for stews.",
        price: 410000,
        originalPrice: 450000,
        images: [
        "https://images.unsplash.com/photo-1701913364117-c806e46550af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8VG9yc28lMjBCZWVmfGVufDB8fDB8fHww",
        "https://media.istockphoto.com/id/170027230/photo/butcher.webp?a=1&b=1&s=612x612&w=0&k=20&c=8-rVvYb6zMYdyF2HtoXSWfcJGvZ2AKUVHawUT6AlYDg="
        ],
        rating: 4.5,
        reviews: 60,
        badge: "Fresh",
        tags: ["beef", "meat", "fresh", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 60,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Shin Beef (1kg)",
        description: "Beef shin, perfect for slow-cooking and rich stews.",
        price: 760000,
        originalPrice: 830000,
        images: [
          "https://media.istockphoto.com/id/1323196261/photo/schmorbraten.webp?a=1&b=1&s=612x612&w=0&k=20&c=sHOUhOmD1bTGkUGlEdyVTG9W1tcWoaLyoDFAb2ePuV8=",
          "https://media.istockphoto.com/id/114396634/photo/stewing-steak-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=jNksBOKbVK-OXF6cRWdjaQHhM4hAtDHW8sW7CegCnLk="
          ],
        rating: 4.6,
        reviews: 75,
        badge: "Fresh",
        tags: ["beef", "shin", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 50,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Shin Beef (0.5kg)",
        description: "Beef shin for smaller portions, ideal for slow-cooked dishes.",
        price: 380000,
        originalPrice: 420000,
        images: [
        "https://media.istockphoto.com/id/114396634/photo/stewing-steak-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=jNksBOKbVK-OXF6cRWdjaQHhM4hAtDHW8sW7CegCnLk=",
        "https://media.istockphoto.com/id/1323196261/photo/schmorbraten.webp?a=1&b=1&s=612x612&w=0&k=20&c=sHOUhOmD1bTGkUGlEdyVTG9W1tcWoaLyoDFAb2ePuV8="
        ],
        rating: 4.6,
        reviews: 70,
        badge: "Fresh",
        tags: ["beef", "shin", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 55,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Assorted Offals (1kg)",
        description: "Mixed beef offals, perfect for traditional dishes and soups.",
        price: 660000,
        originalPrice: 720000,
        images: [
        "https://media.istockphoto.com/id/2143350030/photo/mutton-offal-on-a-cutting-board-placed-on-a-wooden-coffee-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=vn9wJ02GW_e2Fbo1ncdAx9QTR_TLO07Io70LCI7FI28=",
        ],
        rating: 4.4,
        reviews: 50,
        badge: "Fresh",
        tags: ["beef", "offals", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 65,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Assorted Offals (0.5kg)",
        description: "Mixed beef offals for smaller portions, ideal for soups.",
        price: 330000,
        originalPrice: 360000,
        images: [
        "https://media.istockphoto.com/id/1310910433/photo/selection-of-assorted-raw-meat-food-for-zero-carb-carnivore-diet-uncooked-beef-steak-ground.webp?a=1&b=1&s=612x612&w=0&k=20&c=Dc_dYfNSBeA0I6AyibNTb1qSwkToEjGsPuk9FGAX7Kc=",
        ],
        rating: 4.4,
        reviews: 45,
        badge: "Fresh",
        tags: ["beef", "offals", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 70,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Beef Liver (1kg)",
        description: "Fresh beef liver, rich in nutrients and perfect for grilling or frying.",
        price: 620000,
        originalPrice: 680000,
        images: [
        "https://media.istockphoto.com/id/1272363795/photo/fresh-raw-black-angus-liver-with-lavender.webp?a=1&b=1&s=612x612&w=0&k=20&c=J0jlfKKROW4ICgpc5EeuY6_KP8P9gvE7I5k9S11qjm4=",
        "https://media.istockphoto.com/id/1132671449/photo/beef-and-liver-beef.webp?a=1&b=1&s=612x612&w=0&k=20&c=O9HMbK3OYDKptFYuf7H8XvJ-NJxXJBj4_oDg5sZMShs="
        ],
        rating: 4.5,
        reviews: 60,
        badge: "Fresh",
        tags: ["beef", "liver", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 55,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Beef Liver (0.5kg)",
        description: "Fresh beef liver for smaller portions, ideal for nutrient-rich meals.",
        price: 310000,
        originalPrice: 340000,
        images: [
          "https://media.istockphoto.com/id/1132671449/photo/beef-and-liver-beef.webp?a=1&b=1&s=612x612&w=0&k=20&c=O9HMbK3OYDKptFYuf7H8XvJ-NJxXJBj4_oDg5sZMShs=",
        "https://media.istockphoto.com/id/1272363795/photo/fresh-raw-black-angus-liver-with-lavender.webp?a=1&b=1&s=612x612&w=0&k=20&c=J0jlfKKROW4ICgpc5EeuY6_KP8P9gvE7I5k9S11qjm4="
        ],
        rating: 4.5,
        reviews: 55,
        badge: "Fresh",
        tags: ["beef", "liver", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 60,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Beef Kidney (1kg)",
        description: "Fresh beef kidney, ideal for traditional dishes and stews.",
        price: 620000,
        originalPrice: 680000,
        images: [
        "https://media.istockphoto.com/id/1304209267/photo/raw-beef-kidney-isolated-on-light-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=N27kiI4uvvqLVH8rU_HKLOiFpkVpHOtL9s5VKkYJdns=",
        "https://media.istockphoto.com/id/902200022/photo/raw-calfs-kidney.webp?a=1&b=1&s=612x612&w=0&k=20&c=nWtPSuinpvS_4YPl67vjwChaRAzgppzegoAnEQdn3io="        ],
        rating: 4.4,
        reviews: 50,
        badge: "Fresh",
        tags: ["beef", "kidney", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 65,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Beef Kidney (0.5kg)",
        description: "Fresh beef kidney for smaller portions, perfect for stews.",
        price: 310000,
        originalPrice: 340000,
        images: [
        "https://media.istockphoto.com/id/902200022/photo/raw-calfs-kidney.webp?a=1&b=1&s=612x612&w=0&k=20&c=nWtPSuinpvS_4YPl67vjwChaRAzgppzegoAnEQdn3io=",
        "https://media.istockphoto.com/id/182716895/photo/raw-calfs-kidney.webp?a=1&b=1&s=612x612&w=0&k=20&c=kiXF5z2ZA4wOh38AD2DjD88YbnFFpNXUwyoU93UWclU="
        ],
        rating: 4.4,
        reviews: 45,
        badge: "Fresh",
        tags: ["beef", "kidney", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 70,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Intestine Roundabout (1kg)",
        description: "Fresh beef intestine, ideal for traditional African dishes.",
        price: 670000,
        originalPrice: 730000,
        images: [
         "https://media.istockphoto.com/id/1753713158/photo/entrails-beef-organs.webp?a=1&b=1&s=612x612&w=0&k=20&c=QQPu8MboH_TiJZDp-34WdRbgGLMPtTnLPharGNiJI5Y=",
        "https://media.istockphoto.com/id/1424708736/photo/chopped-and-boiled-pig-heads-in-a-vat.webp?a=1&b=1&s=612x612&w=0&k=20&c=Tacsm0Vt8tu1c7FNk3xl3dCtMnuFpxjeO2brecyOcwI="
        ],
        rating: 4.4,
        reviews: 50,
        badge: "Fresh",
        tags: ["beef", "intestine", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 60,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Intestine Roundabout (0.5kg)",
        description: "Fresh beef intestine for smaller portions, ideal for traditional dishes.",
        price: 340000,
        originalPrice: 370000,
        images: [
        "https://media.istockphoto.com/id/1424708736/photo/chopped-and-boiled-pig-heads-in-a-vat.webp?a=1&b=1&s=612x612&w=0&k=20&c=Tacsm0Vt8tu1c7FNk3xl3dCtMnuFpxjeO2brecyOcwI=",
        "https://media.istockphoto.com/id/1753713158/photo/entrails-beef-organs.webp?a=1&b=1&s=612x612&w=0&k=20&c=QQPu8MboH_TiJZDp-34WdRbgGLMPtTnLPharGNiJI5Y="
        ],
        rating: 4.4,
        reviews: 45,
        badge: "Fresh",
        tags: ["beef", "intestine", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 65,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Tripe Saki (1kg)",
        description: "Fresh beef tripe, perfect for soups and traditional dishes.",
        price: 820000,
        originalPrice: 900000,
        images: [
        "/images/Tripa.jpeg",
        "/images/Tripe2.jpeg"
        ],
        rating: 4.5,
        reviews: 55,
        badge: "Fresh",
        tags: ["beef", "tripe", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 50,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Tripe Saki (0.5kg)",
        description: "Fresh beef tripe for smaller portions, ideal for soups.",
        price: 410000,
        originalPrice: 450000,
        images: [
          "/images/Tripe2.jpeg",
        "/images/Tripa.jpeg"
        ],
        rating: 4.5,
        reviews: 50,
        badge: "Fresh",
        tags: ["beef", "tripe", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 55,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Cow Reed Abodi (1kg)",
        description: "Fresh cow reed, ideal for traditional African soups and stews.",
        price: 680000,
        originalPrice: 740000,
        images: [
        "https://media.istockphoto.com/id/1158125709/photo/selection-of-raw-beef-meat-food-steaks-against-black-stone-background-new-york-striploin.webp?a=1&b=1&s=612x612&w=0&k=20&c=8qIq7Z-jWvrBPfsQGrT_EcQKJzpZcTE_v_SgbuL91YQ=",
        "https://media.istockphoto.com/id/1158125709/photo/selection-of-raw-beef-meat-food-steaks-against-black-stone-background-new-york-striploin.webp?a=1&b=1&s=612x612&w=0&k=20&c=8qIq7Z-jWvrBPfsQGrT_EcQKJzpZcTE_v_SgbuL91YQ="
        ],
        rating: 4.4,
        reviews: 50,
        badge: "Fresh",
        tags: ["beef", "reed", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 60,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Cow Lung Fuku (1kg)",
        description: "Fresh cow lung, perfect for traditional dishes and soups.",
        price: 680000,
        originalPrice: 740000,
        images: [
        "https://media.istockphoto.com/id/115882126/photo/lungs-texture.webp?a=1&b=1&s=612x612&w=0&k=20&c=_c31lLyYfWxswgnVlTL0LcqPH8zE15qnqXhi2W3CvY0=",
        "https://media.istockphoto.com/id/115882126/photo/lungs-texture.webp?a=1&b=1&s=612x612&w=0&k=20&c=_c31lLyYfWxswgnVlTL0LcqPH8zE15qnqXhi2W3CvY0="
        ],
        rating: 4.4,
        reviews: 45,
        badge: "Fresh",
        tags: ["beef", "lung", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 65,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Minced Beef (1kg)",
        description: "Fresh minced beef, ideal for burgers, meatballs, and sauces.",
        price: 800000,
        originalPrice: 880000,
        images: [
         "https://media.istockphoto.com/id/465004701/photo/pan-frying-ground-beef.webp?a=1&b=1&s=612x612&w=0&k=20&c=nRF4DHiB3q-49pC_5T2amOjOTIvCOlsnJtuQ4ZcInD0=",
        "https://plus.unsplash.com/premium_photo-1668616816678-5f82734f1f40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fE1pbmNlZCUyMEJlZWZ8ZW58MHx8MHx8fDA%3D"
        ],
        rating: 4.7,
        reviews: 100,
        badge: "Fresh",
        tags: ["beef", "minced", "meat", "protein"],
        featured: true,
        bestSeller: true,
        organic: false,
        inStock: true,
        stockCount: 50,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Minced Beef (0.5kg)",
        description: "Fresh minced beef for smaller portions, perfect for quick meals.",
        price: 400000,
        originalPrice: 440000,
        images: [
        "https://media.istockphoto.com/id/465004701/photo/pan-frying-ground-beef.webp?a=1&b=1&s=612x612&w=0&k=20&c=nRF4DHiB3q-49pC_5T2amOjOTIvCOlsnJtuQ4ZcInD0=",
        "https://plus.unsplash.com/premium_photo-1668616816678-5f82734f1f40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fE1pbmNlZCUyMEJlZWZ8ZW58MHx8MHx8fDA%3D"
        ],
        rating: 4.7,
        reviews: 90,
        badge: "Fresh",
        tags: ["beef", "minced", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 55,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Shredded Beef (1kg)",
        description: "Fresh shredded beef, perfect for stir-fries and fillings.",
        price: 800000,
        originalPrice: 880000,
        images: [
        "https://media.istockphoto.com/id/1337514024/photo/heap-of-shredded-beef-on-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=5JKth6YwXsdEFphBlHZKXV_Vj7y1wG0lsUVsbVYa9Gk=",
        "https://media.istockphoto.com/id/114238849/photo/shredded-beef.webp?a=1&b=1&s=612x612&w=0&k=20&c=EO2YfWUvXhZedKhHQokwWjqtH_K8HRnlDG6OI2PjYus="
        ],
        rating: 4.6,
        reviews: 85,
        badge: "Fresh",
        tags: ["beef", "shredded", "meat", "protein"],
        featured: true,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 50,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Shredded Beef (0.5kg)",
        description: "Fresh shredded beef for smaller portions, ideal for quick dishes.",
        price: 400000,
        originalPrice: 440000,
        images: [
        "https://media.istockphoto.com/id/1337514024/photo/heap-of-shredded-beef-on-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=5JKth6YwXsdEFphBlHZKXV_Vj7y1wG0lsUVsbVYa9Gk=",
        "https://media.istockphoto.com/id/114238849/photo/shredded-beef.webp?a=1&b=1&s=612x612&w=0&k=20&c=EO2YfWUvXhZedKhHQokwWjqtH_K8HRnlDG6OI2PjYus="
        ],
        rating: 4.6,
        reviews: 80,
        badge: "Fresh",
        tags: ["beef", "shredded", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 55,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Beef Tongue (1kg)",
        description: "Fresh beef tongue, ideal for slow-cooked dishes and traditional recipes.",
        price: 700000,
        originalPrice: 770000,
        images: [
        "https://media.istockphoto.com/id/2207146731/photo/basket.webp?a=1&b=1&s=612x612&w=0&k=20&c=afxl_AlETpM3B05OlTxR46s_4D7Ja1x4-sO2z1Hqsag=",
        ],
        rating: 4.4,
        reviews: 50,
        badge: "Fresh",
        tags: ["beef", "tongue", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 60,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Cow Leg (1kg)",
        description: "Fresh cow leg, perfect for soups and stews.",
        price: 660000,
        originalPrice: 720000,
        images: [
      "https://media.istockphoto.com/id/1543049205/photo/pork-and-beef-on-display-in-butchers-glass-cabinet.webp?a=1&b=1&s=612x612&w=0&k=20&c=rIKqTuVCGMPH3FoKkNlaYImrZfL-eUP9XLQfDwbx7uY=",
        "https://media.istockphoto.com/id/1543049205/photo/pork-and-beef-on-display-in-butchers-glass-cabinet.webp?a=1&b=1&s=612x612&w=0&k=20&c=rIKqTuVCGMPH3FoKkNlaYImrZfL-eUP9XLQfDwbx7uY="
        ],
        rating: 4.5,
        reviews: 55,
        badge: "Fresh",
        tags: ["beef", "cowleg", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 65,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Cow Leg (0.5kg)",
        description: "Fresh cow leg for smaller portions, ideal for soups.",
        price: 330000,
        originalPrice: 360000,
        images: [
        "https://media.istockphoto.com/id/1543049205/photo/pork-and-beef-on-display-in-butchers-glass-cabinet.webp?a=1&b=1&s=612x612&w=0&k=20&c=rIKqTuVCGMPH3FoKkNlaYImrZfL-eUP9XLQfDwbx7uY=",
        "https://media.istockphoto.com/id/1543049205/photo/pork-and-beef-on-display-in-butchers-glass-cabinet.webp?a=1&b=1&s=612x612&w=0&k=20&c=rIKqTuVCGMPH3FoKkNlaYImrZfL-eUP9XLQfDwbx7uY="
        ],
        rating: 4.5,
        reviews: 50,
        badge: "Fresh",
        tags: ["beef", "cowleg", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 70,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Full Cow Head (10kg)",
        description: "Whole cow head, ideal for traditional dishes and large gatherings.",
        price: 7600000,
        originalPrice: 8200000,
        images: [
        "https://images.unsplash.com/photo-1735131241264-7ab661210b26?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmF3JTIwQ293JTIwSGVhZCUyMGluJTIwbWFya2V0fGVufDB8fDB8fHww",
        ],
        rating: 4.6,
        reviews: 40,
        badge: "Fresh",
        tags: ["beef", "cowhead", "meat", "protein"],
        featured: true,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 20,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Half Cow Head (5kg)",
        description: "Half cow head, perfect for traditional recipes.",
        price: 3800000,
        originalPrice: 4100000,
        images: [
        "https://media.istockphoto.com/id/1360044463/photo/hanging-sheep-head-in-the-butchers-window.webp?a=1&b=1&s=612x612&w=0&k=20&c=v9KDpF96BG4D3sjjGBA601DwJ_2DjNk4DkWCEuJnOLA=",
        ],
        rating: 4.6,
        reviews: 35,
        badge: "Fresh",
        tags: ["beef", "cowhead", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 25,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Quarter Cow Head (2.5kg)",
        description: "Quarter cow head, ideal for smaller traditional dishes.",
        price: 1900000,
        originalPrice: 2100000,
        images: [
        "https://media.istockphoto.com/id/1559348902/photo/butcher-shop-display.webp?a=1&b=1&s=612x612&w=0&k=20&c=csWJ3camm9Qjh94-jz3yMfJJ7iMJglyiIqfqArV5HPA=",
        ],
        rating: 4.6,
        reviews: 30,
        badge: "Fresh",
        tags: ["beef", "cowhead", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 30,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Cow Tail (1kg)",
        description: "Fresh cow tail, perfect for rich soups and stews.",
        price: 740000,
        originalPrice: 800000,
        images: [
        "https://media.istockphoto.com/id/1273054466/photo/raw-oxtail-from-black-angus-with-laurel.webp?a=1&b=1&s=612x612&w=0&k=20&c=MCCRD9dGAs2EKrXrHgJ1LoPpKouWHnDMBT5M4PaWk9g=",
        "https://media.istockphoto.com/id/814585024/photo/raw-oxtail-with-sea-salt-and-spices.jpg?s=612x612&w=0&k=20&c=mjUh6yD25fK1F0mZCaClJfOTttmKwTS2nVFwc6Vc57Q="
        ],
        rating: 4.5,
        reviews: 55,
        badge: "Fresh",
        tags: ["beef", "cowtail", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 50,
        categoryId: animalBasedProtein.id
      },
        {
        name: "White Ponmo (1kg)",
        description: "Fresh white ponmo, ideal for traditional soups and stews.",
        price: 500000,
        originalPrice: 550000,
        images: [
          "/images/ponmo white.jpeg",
          "/images/ponmo white2.jpeg",
        ],
        rating: 4.4,
        reviews: 50,
        badge: "Fresh",
        tags: ["beef", "ponmo", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 60,
        categoryId: animalBasedProtein.id
      },
        {
        name: "White Ponmo (0.5kg)",
        description: "Fresh white ponmo for smaller portions, perfect for soups.",
        price: 250000,
        originalPrice: 280000,
        images: [
          "/images/ponmo white.jpeg",
          "/images/ponmo white2.jpeg",    
        ],
        rating: 4.4,
        reviews: 45,
        badge: "Fresh",
        tags: ["beef", "ponmo", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 65,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Brown Ponmo (1kg)",
        description: "Fresh brown ponmo, ideal for traditional African dishes.",
        price: 500000,
        originalPrice: 550000,
        images: [
        "/images/ponmo.jpeg",
        "/images/ponomo2.jpeg",    
        ],
        rating: 4.4,
        reviews: 50,
        badge: "Fresh",
        tags: ["beef", "ponmo", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 60,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Brown Ponmo (0.5kg)",
        description: "Fresh brown ponmo for smaller portions, ideal for soups.",
        price: 250000,
        originalPrice: 280000,
        images: [
        "/images/ponmo.jpeg",
        "/images/ponomo2.jpeg",        ],
        rating: 4.4,
        reviews: 45,
        badge: "Fresh",
        tags: ["beef", "ponmo", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 65,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Full Ram (24kg)",
        description: "Whole ram including all parts, ideal for large gatherings.",
        price: 24000000,
        originalPrice: 26000000,
        images: [
        "https://media.istockphoto.com/id/1329418010/photo/picanha-raw-traditional-steak-barbecue-in-brazil-slices-of-picanha-top-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=a3FrOViROz1Kvi9CNkF6_XD2evqdLEXQxupanuVyuNM=",
        "https://media.istockphoto.com/id/1329418010/photo/picanha-raw-traditional-steak-barbecue-in-brazil-slices-of-picanha-top-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=a3FrOViROz1Kvi9CNkF6_XD2evqdLEXQxupanuVyuNM="
        ],
        rating: 4.7,
        reviews: 60,
        badge: "Fresh",
        tags: ["ram", "meat", "fresh", "protein"],
        featured: true,
        bestSeller: true,
        organic: false,
        inStock: true,
        stockCount: 10,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Half Ram (12kg)",
        description: "Half ram including all parts, perfect for medium-sized gatherings.",
        price: 12000000,
        originalPrice: 13000000,
        images: [
        "https://media.istockphoto.com/id/1368815026/photo/raw-beef-on-a-wooden-cutting-board-with-rosemary.webp?a=1&b=1&s=612x612&w=0&k=20&c=0p-qJKZPZxfHteQgJBCkajQ3V-onOI8luFuZLaSEOCc=",
        "https://media.istockphoto.com/id/1329418010/photo/picanha-raw-traditional-steak-barbecue-in-brazil-slices-of-picanha-top-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=a3FrOViROz1Kvi9CNkF6_XD2evqdLEXQxupanuVyuNM="
        ],
        rating: 4.7,
        reviews: 55,
        badge: "Fresh",
        tags: ["ram", "meat", "fresh", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 15,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Quarter Ram (6kg)",
        description: "Quarter ram including all parts, ideal for smaller gatherings.",
        price: 6000000,
        originalPrice: 6500000,
        images: [
        "https://images.unsplash.com/photo-1751347999317-a0ed6f471cb3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJhdyUyMFF1YXJ0ZXIlMjBSYW0lMjBtZWF0fGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1600180786608-28d06391d25c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHJhdyUyMFF1YXJ0ZXIlMjBSYW0lMjBtZWF0fGVufDB8fDB8fHww"
        ],
        rating: 4.7,
        reviews: 50,
        badge: "Fresh",
        tags: ["ram", "meat", "fresh", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 20,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Eighth Ram (3kg)",
        description: "Eighth portion of ram, perfect for small meals.",
        price: 3000000,
        originalPrice: 3200000,
        images: [
        "https://media.istockphoto.com/id/1547480766/photo/fresh-raw-beef-steak-with-salt-spices-and-herbs.webp?a=1&b=1&s=612x612&w=0&k=20&c=CT_1WRn-dDjLXGfKbI5Z-DQd0OH4pWJem748-SYAZKE=",
        "https://media.istockphoto.com/id/695147642/photo/two-raw-beef-steaks-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=RN0gqV2aZm_GVHGPqJw8z6TSmXYHKqkKXKJ99Wked4A="
        ],
        rating: 4.7,
        reviews: 45,
        badge: "Fresh",
        tags: ["ram", "meat", "fresh", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 25,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Ram Meat No Offals (1kg)",
        description: "Fresh ram meat without offals, ideal for grilling or roasting.",
        price: 1100000,
        originalPrice: 1200000,
        images: [
        "https://images.unsplash.com/photo-1608502735811-0affbb61f260?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJhdyUyMEJvbmVsZXNzJTIwUmFtJTIwTWVhdHxlbnwwfHwwfHx8MA%3D%3D",
        "https://media.istockphoto.com/id/468329068/photo/fillet-steak-beef-meat.webp?a=1&b=1&s=612x612&w=0&k=20&c=pJtZ-eRcMTnAOILBEx1I1X8ELBf-2SQGtN5tZwut9fM="
        ],
        rating: 4.6,
        reviews: 65,
        badge: "Fresh",
        tags: ["ram", "meat", "fresh", "protein"],
        featured: true,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 40,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Boneless Ram Meat (1kg)",
        description: "Boneless ram meat, perfect for grilling or roasting.",
        price: 1300000,
        originalPrice: 1400000,
        images: [
        "https://media.istockphoto.com/id/1651786686/photo/thinly-sliced-beef-shoulder-loin-on-a-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=j6nx1-rSxpNmT1V1He8GuO2NdxooBTp7FAG4vIjdjZA=",
        "https://media.istockphoto.com/id/1651786686/photo/thinly-sliced-beef-shoulder-loin-on-a-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=j6nx1-rSxpNmT1V1He8GuO2NdxooBTp7FAG4vIjdjZA="
        ],
        rating: 4.7,
        reviews: 70,
        badge: "Premium",
        tags: ["ram", "boneless", "meat", "protein"],
        featured: true,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 35,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Ram Offals (1kg)",
        description: "Fresh ram offals, ideal for traditional soups and dishes.",
        price: 650000,
        originalPrice: 710000,
        images: [
        "https://media.istockphoto.com/id/1333562117/photo/raw-testes-and-kidneys-of-an-adult-ram-and-lamb-before-cooking.webp?a=1&b=1&s=612x612&w=0&k=20&c=_wnqj4o-YqSVu5DDztuApPm-VCb_FAIE6Rt7t9xAE7I=",
        "https://media.istockphoto.com/id/1336513651/photo/raw-testes-and-kidneys.webp?a=1&b=1&s=612x612&w=0&k=20&c=Hp33sThlum-wSJc44yz3WUYlaKT3HlV0GJv0m8utiew="
        ],
        rating: 4.4,
        reviews: 50,
        badge: "Fresh",
        tags: ["ram", "offals", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 60,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Ram Head (1kg)",
        description: "Fresh ram head, perfect for traditional recipes.",
        price: 650000,
        originalPrice: 710000,
        images: [
          "https://media.istockphoto.com/id/1094645684/photo/severed-goat-heads-on-a-market-in-hurghada-city-egypt.webp?a=1&b=1&s=612x612&w=0&k=20&c=KfT-e5Kc8KydTRmUUCk3HYies1AHNBV7oUMdz0gaZRI=",
        ],
        rating: 4.5,
        reviews: 45,
        badge: "Fresh",
        tags: ["ram", "head", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 55,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Ram Head and Leg (1kg)",
        description: "Fresh ram head and leg, ideal for traditional soups.",
        price: 600000,
        originalPrice: 660000,
        images: [
        "https://media.istockphoto.com/id/1580779694/photo/the-king-of-steaks-the-tomahawk.webp?a=1&b=1&s=612x612&w=0&k=20&c=OcghYStFB4yXMXtRBbRngQjp4NE5xTg1ukPUA9prskY=",
        "https://media.istockphoto.com/id/1577293855/photo/fresh-halal-beef-shank.webp?a=1&b=1&s=612x612&w=0&k=20&c=ROkd1EjV9B_WlqdcbQxvcGwBdNxYMxgyUC0B9JR0Qdg="
        ],
        rating: 4.5,
        reviews: 50,
        badge: "Fresh",
        tags: ["ram", "head", "leg", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 60,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Large Male Goat (15kg)",
        description: "Full large male goat, perfect for traditional dishes.",
        price: 11200000,
        originalPrice: 12000000,
        images: [
        "https://media.istockphoto.com/id/2150735881/photo/skinned.webp?a=1&b=1&s=612x612&w=0&k=20&c=7MGV1V0u4Ap4WTYyliViLkrYbHReoN2nQ1WUtjWzgHw=",
        "https://media.istockphoto.com/id/1300699678/photo/raw-pork-shoulder-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=GYwz52tI_UzV0032fnVElEexV7V508E4HY5AS9ESd_8="
        ],
        rating: 4.6,
        reviews: 75,
        badge: "Fresh",
        tags: ["goat", "meat", "fresh", "protein"],
        featured: true,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 15,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Half Large Male Goat (7.5kg)",
        description: "Half large male goat, ideal for medium-sized gatherings.",
        price: 5600000,
        originalPrice: 6000000,
        images: [
        "https://media.istockphoto.com/id/2220523660/photo/meat-with-bones-in-the-market-as-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=JnGhQ3ilz3iEpsm1OhFyPyzGQRhBQL7qH3FvP-35aZU=",
        "https://media.istockphoto.com/id/2187277624/photo/raw-pork-spare-ribs.webp?a=1&b=1&s=612x612&w=0&k=20&c=fjpR-5h3gwzBq8gWwCyrFzEIKO1NYIeXNhkuMci9Io8="
        ],
        rating: 4.6,
        reviews: 70,
        badge: "Fresh",
        tags: ["goat", "meat", "fresh", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 20,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Quarter Large Male Goat (3.75kg)",
        description: "Quarter large male goat, perfect for smaller meals.",
        price: 2800000,
        originalPrice: 3000000,
        images: [
        "https://media.istockphoto.com/id/2150735881/photo/skinned.webp?a=1&b=1&s=612x612&w=0&k=20&c=7MGV1V0u4Ap4WTYyliViLkrYbHReoN2nQ1WUtjWzgHw=",
        "https://media.istockphoto.com/id/1993983438/photo/beef.webp?a=1&b=1&s=612x612&w=0&k=20&c=2ke3ByD36xJMdzprJdsnun-1warg3n_Aye-e6Nid5os="
        ],
        rating: 4.6,
        reviews: 65,
        badge: "Fresh",
        tags: ["goat", "meat", "fresh", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 25,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Eighth Large Male Goat (1.8kg)",
        description: "Eighth portion of large male goat, ideal for small dishes.",
        price: 1400000,
        originalPrice: 1500000,
        images: [
        "https://media.istockphoto.com/id/2184568004/photo/whole-raw-rabbit-spices-and-knife-at-white-wooden-table-flat-lay.webp?a=1&b=1&s=612x612&w=0&k=20&c=RlN03HZBHmVNPcj7lP2attceS-5Qw2t9x7878Hx1QEY=",
        "https://media.istockphoto.com/id/1340963081/photo/lamb-carcass-on-cutting-table-in-butcher-shop-sheep-carcass-raw-meat-free-space-for-text.webp?a=1&b=1&s=612x612&w=0&k=20&c=l884WnVbqyJgNaNR4RnQo0FXTl43ebEiKx4AYRHIiag="
        ],
        rating: 4.6,
        reviews: 60,
        badge: "Fresh",
        tags: ["goat", "meat", "fresh", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 30,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Goat Meat No Offals (1kg)",
        description: "Fresh goat meat without offals, perfect for grilling or roasting.",
        price: 850000,
        originalPrice: 920000,
        images: [
        "https://media.istockphoto.com/id/1057746298/photo/raw-goat-meat.webp?a=1&b=1&s=612x612&w=0&k=20&c=ybJ3zo-KHYJDMbi-pr-yq_MMLx2AFUILTsbi43eqlIE=",
        "https://media.istockphoto.com/id/176101808/photo/piece-of-fresh-goat-meat.webp?a=1&b=1&s=612x612&w=0&k=20&c=lrpHYy7rilBn1sK1JxBFkSi1tQFQG1qbBgG3dCo3zxo="
        ],
        rating: 4.6,
        reviews: 70,
        badge: "Fresh",
        tags: ["goat", "meat", "fresh", "protein"],
        featured: true,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 40,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Goat Head and Leg (1kg)",
        description: "Fresh goat head and leg, ideal for traditional soups.",
        price: 600000,
        originalPrice: 660000,
        images: [
          "https://media.istockphoto.com/id/2207723859/photo/variety-of-offal-for-sale-at-the-market.webp?a=1&b=1&s=612x612&w=0&k=20&c=CF3bDb74QNikqi_9HrZex__Y2jccdoS65pf56AsbcGE=",
          "https://media.istockphoto.com/id/1094645684/photo/severed-goat-heads-on-a-market-in-hurghada-city-egypt.webp?a=1&b=1&s=612x612&w=0&k=20&c=KfT-e5Kc8KydTRmUUCk3HYies1AHNBV7oUMdz0gaZRI="
        ],
        rating: 4.5,
        reviews: 50,
        badge: "Fresh",
        tags: ["goat", "head", "leg", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 60,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Goat Head (1kg)",
        description: "Fresh goat head, perfect for traditional recipes.",
        price: 600000,
        originalPrice: 660000,
        images: [
        "https://media.istockphoto.com/id/1094645684/photo/severed-goat-heads-on-a-market-in-hurghada-city-egypt.webp?a=1&b=1&s=612x612&w=0&k=20&c=KfT-e5Kc8KydTRmUUCk3HYies1AHNBV7oUMdz0gaZRI=",
        "https://media.istockphoto.com/id/2214876883/photo/meat-market.webp?a=1&b=1&s=612x612&w=0&k=20&c=c_CupqgjU4mSWy9umXp4-mt0yYEAQAjOoujvspxceyo="
        ],
        rating: 4.5,
        reviews: 45,
        badge: "Fresh",
        tags: ["goat", "head", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 55,
        categoryId: animalBasedProtein.id
      },
        {
        name: "Goat Offals (1kg)",
        description: "Fresh goat offals, ideal for traditional soups and dishes.",
        price: 650000,
        originalPrice: 710000,
        images: [
        "https://media.istockphoto.com/id/1543543471/photo/the-internal-organs-of-the-sheep-sacrificed-for-eid-al-adha-are-offal.webp?a=1&b=1&s=612x612&w=0&k=20&c=DjUN_QWU1S1c8sb0pFGBe04k3skY_p7KvbMJW5pEz0w=",
        "https://media.istockphoto.com/id/2143350030/photo/mutton-offal-on-a-cutting-board-placed-on-a-wooden-coffee-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=vn9wJ02GW_e2Fbo1ncdAx9QTR_TLO07Io70LCI7FI28="
        ],
        rating: 4.4,
        reviews: 50,
        badge: "Fresh",
        tags: ["goat", "offals", "meat", "protein"],
        featured: false,
        bestSeller: false,
        organic: false,
        inStock: true,
        stockCount: 60,
        categoryId: animalBasedProtein.id
      },
        {
          name: "Boneless Goat Meat (1kg)",
          description: "Boneless goat meat, perfect for grilling or roasting.",
          price: 1040000,
          originalPrice: 1120000,
          images: [
            "https://media.istockphoto.com/id/1323003448/photo/fresh-raw-chicken-on-a-rustic-wooden-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=Kft2vBCjhcJDVVBeYOOlSoNIxU1jo5XJzgK68MhI3UU=",
            "https://media.istockphoto.com/id/2181951782/photo/raw-whole-thanksgiving-turkey.webp?a=1&b=1&s=612x612&w=0&k=20&c=_9hfh0pckaIa4d4K7Zuo1ESkz_iI3RUUFR9ajTymFtk="
          ],
          rating: 4.7,
          reviews: 75,
          badge: "Premium",
          tags: ["goat", "boneless", "meat", "protein"],
          featured: true,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 35,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Medium Large Whole Chicken",
          description: "Fresh medium-large whole chicken, ideal for roasting or grilling.",
          price: 1000000,
          originalPrice: 1100000,
          images: [
            "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJhdyUyMENoaWNrZW4lMjBDaGVzdCUyMGFuZCUyMExhcHN8ZW58MHx8MHx8fDA%3D",
            "https://images.unsplash.com/photo-1642102903909-560c5a7665bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmF3JTIwQ2hpY2tlbiUyMENoZXN0JTIwYW5kJTIwTGFwc3xlbnwwfHwwfHx8MA%3D%3D"          ],
          rating: 4.8,
          reviews: 120,
          badge: "Organic",
          tags: ["chicken", "poultry", "organic", "protein"],
          featured: true,
          bestSeller: true,
          organic: true,
          inStock: true,
          stockCount: 60,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Large Whole Chicken",
          description: "Fresh large whole chicken, perfect for roasting or grilling.",
          price: 1100000,
          originalPrice: 1250000,
          images: [
            "https://images.unsplash.com/photo-1642102903909-560c5a7665bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmF3JTIwQ2hpY2tlbiUyMENoZXN0JTIwYW5kJTIwTGFwc3xlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJhdyUyMENoaWNrZW4lMjBDaGVzdCUyMGFuZCUyMExhcHN8ZW58MHx8MHx8fDA%3D"
          ],
          rating: 4.8,
          reviews: 115,
          badge: "Organic",
          tags: ["chicken", "poultry", "organic", "protein"],
          featured: true,
          bestSeller: true,
          organic: true,
          inStock: true,
          stockCount: 55,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Chicken Cut 4 Chest and Laps (10kg)",
          description: "Fresh chicken chest and laps, ideal for grilling or frying.",
          price: 4500000,
          originalPrice: 4800000,
          images: [
            "https://media.istockphoto.com/id/2166586232/photo/raw-mixed-chicken-meat-parts-for-cooking-on-rustic-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=mf59Ybw61pb7JYntH9MpXAeNkoLmLHtkI8sCvJTUXDQ=",
            "https://media.istockphoto.com/id/2218406910/photo/diced-thai-chicken-thighs.webp?a=1&b=1&s=612x612&w=0&k=20&c=zCffBhFw9LGJK15fbL8bEOVOaW-XzFwpH7ATcb3x9RE="
          ],
          rating: 4.7,
          reviews: 100,
          badge: "Fresh",
          tags: ["chicken", "chest", "laps", "protein"],
          featured: true,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 40,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Chicken Cut 4 Chest and Laps (1kg)",
          description: "Fresh chicken chest and laps, perfect for quick meals.",
          price: 450000,
          originalPrice: 500000,
          images: [
            "https://images.unsplash.com/photo-1642497394469-188b0f4bcae6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmF3JTIwQ2hpY2tlbiUyMENoZXN0JTIwYW5kJTIwTGFwc3xlbnwwfHwwfHx8MA%3D%3D",
            "https://media.istockphoto.com/id/2166586232/photo/raw-mixed-chicken-meat-parts-for-cooking-on-rustic-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=mf59Ybw61pb7JYntH9MpXAeNkoLmLHtkI8sCvJTUXDQ="
          ],
          rating: 4.7,
          reviews: 95,
          badge: "Fresh",
          tags: ["chicken", "chest", "laps", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 50,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Chicken Laps (10kg)",
          description: "Fresh chicken laps, ideal for grilling or roasting.",
          price: 4500000,
          originalPrice: 4800000,
          images: [
            "https://media.istockphoto.com/id/2201265710/photo/fresh-chicken-selection-at-local-market.webp?a=1&b=1&s=612x612&w=0&k=20&c=hrUnGv3sy6wvxiDKycmXTC9mThRE62Ceo82sxXXC5NQ=",
            "https://media.istockphoto.com/id/2199666449/photo/close-up-of-raw-chicken-drumstick-in-a-plastic-box-on-kitchen-table-preparing-meat-for-cooking.webp?a=1&b=1&s=612x612&w=0&k=20&c=NOubHX_VifA8toqHD-tfmPnqEryTQBEXQgv93bfxiRM="
          ],
          rating: 4.7,
          reviews: 90,
          badge: "Fresh",
          tags: ["chicken", "laps", "poultry", "protein"],
          featured: true,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 45,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Chicken Laps (1kg)",
          description: "Fresh chicken laps, perfect for quick grilling or roasting.",
          price: 450000,
          originalPrice: 500000,
          images: [
            "https://media.istockphoto.com/id/1322432988/photo/raw-chicken-cuts-without-skin.webp?a=1&b=1&s=612x612&w=0&k=20&c=itrU0ikHzT9YQD_0q9quf-OC_mKm5dFb9OvnBAdZWS8=",
            "https://media.istockphoto.com/id/2199666449/photo/close-up-of-raw-chicken-drumstick-in-a-plastic-box-on-kitchen-table-preparing-meat-for-cooking.webp?a=1&b=1&s=612x612&w=0&k=20&c=NOubHX_VifA8toqHD-tfmPnqEryTQBEXQgv93bfxiRM="
          ],
          rating: 4.7,
          reviews: 85,
          badge: "Fresh",
          tags: ["chicken", "laps", "poultry", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 50,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Chicken Thighs (1kg)",
          description: "Fresh chicken thighs, ideal for grilling or baking.",
          price: 420000,
          originalPrice: 460000,
          images: [
            "https://media.istockphoto.com/id/1472798845/photo/raw-organic-chicken-thighs.webp?a=1&b=1&s=612x612&w=0&k=20&c=zXU9GdsBse-tClQepTIqTANabqT4nJ56wQem9ecxkN0=",
            "https://media.istockphoto.com/id/1361876533/photo/group-of-raw-chicken-legs-on-a-rustic-wooden-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=okwvUGLbUXDAo4o2OuRIf7Ni8VkCcfl9cxIAkYpqXQY="
          ],
          rating: 4.7,
          reviews: 80,
          badge: "Fresh",
          tags: ["chicken", "thighs", "poultry", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 55,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Chicken Wings (10kg)",
          description: "Fresh chicken wings, perfect for frying or grilling.",
          price: 5000000,
          originalPrice: 5400000,
          images: [
            "https://media.istockphoto.com/id/1130423940/photo/raw-chicken-wings.webp?a=1&b=1&s=612x612&w=0&k=20&c=3L_in81CK1aBq9viFOgYk0ZvPSkTZ2IHqcJkPZ5LTrU=",
            "https://media.istockphoto.com/id/172366264/photo/two-isolated-chicken-wings-on-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=7xLylXsk53UCHltPiVqeWunpWUbUSgfaoNv2BnIacCE="
          ],
          rating: 4.8,
          reviews: 100,
          badge: "Fresh",
          tags: ["chicken", "wings", "poultry", "protein"],
          featured: true,
          bestSeller: true,
          organic: false,
          inStock: true,
          stockCount: 40,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Chicken Wings (1kg)",
          description: "Fresh chicken wings, ideal for quick meals and snacks.",
          price: 500000,
          originalPrice: 550000,
          images: [
            "https://media.istockphoto.com/id/1458268268/photo/raw-chicken-wings-poultry-meat-with-spices-salt-and-pepper-on-gray-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=VIm-asmaAv5y6wM_CP-JKP4D986zs1UQ_BmztxZ2VNo=",
            "https://media.istockphoto.com/id/172374662/photo/chicken-wings-isolated-on-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=M6hrOBcTXrQFxakHdZDN6xorE4O8d5UNDfwqIvBOTZE="
          ],
          rating: 4.8,
          reviews: 95,
          badge: "Fresh",
          tags: ["chicken", "wings", "poultry", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 50,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Chicken Breast (10kg)",
          description: "Fresh chicken breast, perfect for healthy meals.",
          price: 5500000,
          originalPrice: 5900000,
          images: [
            "https://images.unsplash.com/photo-1682991136736-a2b44623eeba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fENoaWNrZW4lMjBCcmVhc3R8ZW58MHx8MHx8fDA%3D",
            "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q2hpY2tlbiUyMEJyZWFzdHxlbnwwfHwwfHx8MA%3D%3D"
          ],
          rating: 4.8,
          reviews: 110,
          badge: "Healthy",
          tags: ["chicken", "breast", "poultry", "protein"],
          featured: true,
          bestSeller: true,
          organic: false,
          inStock: true,
          stockCount: 45,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Chicken Breast (1kg)",
          description: "Fresh chicken breast, ideal for grilling or baking.",
          price: 550000,
          originalPrice: 600000,
          images: [
            "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q2hpY2tlbiUyMEJyZWFzdHxlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1682991136736-a2b44623eeba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fENoaWNrZW4lMjBCcmVhc3R8ZW58MHx8MHx8fDA%3D"
          ],
          rating: 4.8,
          reviews: 100,
          badge: "Healthy",
          tags: ["chicken", "breast", "poultry", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 50,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Chicken Gizzard (1kg)",
          description: "Fresh chicken gizzard, perfect for stews and grilling.",
          price: 550000,
          originalPrice: 600000,
          images: [
            "https://media.istockphoto.com/id/1153117467/photo/raw-chicken-gizzards-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=FfAaP7RnwYnrQoQvsClsbPqg0kiFuwxZgzgbFNpygC0=",
            "https://media.istockphoto.com/id/1277357936/photo/raw-uncooked-chicken-gizzards-stomach-black-background-top-view-copy-space.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZAt6XCe-Ywf7nxG4f0cPoTCZgFO5_uE2wxlOyf2ON2E="
          ],
          rating: 4.6,
          reviews: 85,
          badge: "Fresh",
          tags: ["chicken", "gizzard", "poultry", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 55,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Shredded Chicken (1kg)",
          description: "Fresh shredded chicken, ideal for fillings and quick meals.",
          price: 600000,
          originalPrice: 650000,
          images: [
            "https://media.istockphoto.com/id/1806344464/photo/shredded-chicken-meat-in-a-plate-isolated-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=aAPx8Qrjks6SjGLZlTzbXumr3lMMv6GqdZfajk-YwZ0=",
          ],
          rating: 4.7,
          reviews: 90,
          badge: "Fresh",
          tags: ["chicken", "shredded", "poultry", "protein"],
          featured: true,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 50,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Minced Chicken (1kg)",
          description: "Fresh minced chicken, perfect for burgers, meatballs, and sauces.",
          price: 690000,
          originalPrice: 750000,
          images: [
            "https://media.istockphoto.com/id/1868013254/photo/raw-ground-chicken.webp?a=1&b=1&s=612x612&w=0&k=20&c=RywIr4dTtCiww8ANMhIiihDjtikSdx573c_UU_2zr_E=",
            "https://media.istockphoto.com/id/1868013254/photo/raw-ground-chicken.webp?a=1&b=1&s=612x612&w=0&k=20&c=RywIr4dTtCiww8ANMhIiihDjtikSdx573c_UU_2zr_E="
          ],
          rating: 4.7,
          reviews: 95,
          badge: "Fresh",
          tags: ["chicken", "minced", "poultry", "protein"],
          featured: true,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 50,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Chicken Drumsticks (1kg)",
          description: "Fresh chicken drumsticks, ideal for grilling or roasting.",
          price: 650000,
          originalPrice: 710000,
          images: [
            "https://images.unsplash.com/photo-1638439430466-b2bb7fdc1d67?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2hpY2tlbiUyMERydW1zdGlja3N8ZW58MHx8MHx8fDA%3D",
            "https://plus.unsplash.com/premium_photo-1664391929657-f901ee7f1414?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fENoaWNrZW4lMjBEcnVtc3RpY2tzfGVufDB8fDB8fHww"
          ],
          rating: 4.8,
          reviews: 100,
          badge: "Fresh",
          tags: ["chicken", "drumsticks", "poultry", "protein"],
          featured: true,
          bestSeller: true,
          organic: false,
          inStock: true,
          stockCount: 55,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Whole Layers Chicken (Hard Chicken)",
          description: "Fresh whole layers chicken, perfect for traditional soups and stews.",
          price: 1000000,
          originalPrice: 1100000,
          images: [
            "https://images.unsplash.com/photo-1716174964448-5e35f07fd8fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJhdyUyMFdob2xlJTIwTGF5ZXJzJTIwQ2hpY2tlbiUyMGluJTIwc3RvcmV8ZW58MHx8MHx8fDA%3D",
            "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHJhdyUyMFdob2xlJTIwTGF5ZXJzJTIwQ2hpY2tlbiUyMGluJTIwc3RvcmV8ZW58MHx8MHx8fDA%3D"
          ],
          rating: 4.6,
          reviews: 85,
          badge: "Fresh",
          tags: ["chicken", "layers", "poultry", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 50,
          categoryId: animalBasedProtein.id
        },
        {
          name: "Small Snails (10 pieces)",
          description: "Fresh small snails, perfect for soups and stews.",
          price: 800000,
          originalPrice: 880000,
          images: [
            "https://images.unsplash.com/photo-1623501598404-231a59c813de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hbGwlMjBTbmFpbHMlMjBpbiUyMG1hcmtldHxlbnwwfHwwfHx8MA%3D%3D"
          ],
          rating: 4.5,
          reviews: 45,
          badge: "Fresh",
          tags: ["snails", "seafood", "fresh", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 30,
          categoryId: seafoodCategory.id
        },
        {
          name: "Medium/Small Snails (10 pieces)",
          description: "Fresh medium-small snails, ideal for traditional dishes.",
          price: 1300000,
          originalPrice: 1400000,
          images: [
            "https://images.unsplash.com/photo-1588937236364-d013ec9af6e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjN8fHNtYWxsJTIwU25haWxzJTIwaW4lMjBtYXJrZXR8ZW58MHx8MHx8fDA%3D",
            "https://images.unsplash.com/photo-1623501598404-231a59c813de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hbGwlMjBTbmFpbHMlMjBpbiUyMG1hcmtldHxlbnwwfHwwfHx8MA%3D%3D"
          ],
          rating: 4.5,
          reviews: 50,
          badge: "Fresh",
          tags: ["snails", "seafood", "fresh", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 25,
          categoryId: seafoodCategory.id
        },
        {
          name: "Medium Snails (10 pieces)",
          description: "Fresh medium-sized snails, perfect for soups and stews.",
          price: 1600000,
          originalPrice: 1800000,
          images: [
            "https://images.unsplash.com/photo-1623501598404-231a59c813de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWVkaXVtJTIwU25haWxzJTIwaW4lMjBtYXJrZXR8ZW58MHx8MHx8fDA%3D",
            "https://images.unsplash.com/photo-1647891190073-8218652ffdb7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TWVkaXVtJTIwU25haWxzJTIwaW4lMjBtYXJrZXR8ZW58MHx8MHx8fDA%3D"
          ],
          rating: 4.5,
          reviews: 55,
          badge: "Fresh",
          tags: ["snails", "seafood", "fresh", "protein"],
          featured: true,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 20,
          categoryId: seafoodCategory.id
        },
        {
          name: "Mackerel Fish (Titus) (1kg)",
          description: "Rich and flavorful mackerel fish, packed with omega-3, ideal for grilling or stews.",
          price: 750000,
          originalPrice: 820000,
          images: [
            "https://images.unsplash.com/photo-1567087978459-8a8eeac7bc75?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWFja2VyZWwlMjBGaXNofGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1554071407-1fb7259a9118?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TWFja2VyZWwlMjBGaXNofGVufDB8fDB8fHww"
          ],
          rating: 4.6,
          reviews: 80,
          badge: "Fresh",
          tags: ["mackerel", "fish", "omega3", "protein"],
          featured: true,
          bestSeller: true,
          organic: false,
          inStock: true,
          stockCount: 35,
          categoryId: seafoodCategory.id
        },
        {
          name: "Hake Fish (1kg)",
          description: "Fresh hake fish, perfect for grilling or frying.",
          price: 420000,
          originalPrice: 460000,
          images: [
            "https://plus.unsplash.com/premium_photo-1747953372900-b9b7246787b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fEhha2UlMjBGaXNofGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1572420054337-2cf7054ddd42?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fEhha2UlMjBGaXNofGVufDB8fDB8fHww"
          ],
          rating: 4.5,
          reviews: 70,
          badge: "Fresh",
          tags: ["hake", "fish", "seafood", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 40,
          categoryId: seafoodCategory.id
        },
        {
          name: "Croaker Fish (1kg)",
          description: "Fresh croaker fish, ideal for grilling or soups.",
          price: 500000,
          originalPrice: 550000,
          images: [
            "https://media.istockphoto.com/id/2186587759/photo/yellow-croaker-fish.webp?a=1&b=1&s=612x612&w=0&k=20&c=wXZln6XeDysmdLTADk3RPwXI80dcrNSUCoZLecVsKOQ=",
            "https://media.istockphoto.com/id/1497352248/photo/raw-yellow-croaker-fish.webp?a=1&b=1&s=612x612&w=0&k=20&c=vfFy9HQ4z6q9KYg1QIgfjxjnmHzZxsJ-RqWZnCUZL1k="
          ],
          rating: 4.6,
          reviews: 75,
          badge: "Fresh",
          tags: ["croaker", "fish", "seafood", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 45,
          categoryId: seafoodCategory.id
        },
        {
          name: "Tilapia Fish (1kg)",
          description: "Fresh tilapia fish, perfect for grilling or frying.",
          price: 500000,
          originalPrice: 550000,
          images: [
            "https://images.unsplash.com/photo-1637273446235-97a96c8ae6e5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8JTIyVGlsYXBpYSUyMEZpc2glMjAoMWtnKXxlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1618120995338-f1344edc054a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fCUyMlRpbGFwaWElMjBGaXNoJTIwKDFrZyl8ZW58MHx8MHx8fDA%3D"
          ],
          rating: 4.6,
          reviews: 70,
          badge: "Fresh",
          tags: ["tilapia", "fish", "seafood", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 50,
          categoryId: seafoodCategory.id
        },
        {
          name: "Rock Fish (1kg)",
          description: "Fresh rock fish, ideal for soups and grilling.",
          price: 380000,
          originalPrice: 420000,
          images: [
            "https://images.unsplash.com/photo-1518732751612-2c0787ff5684?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Um9jayUyMEZpc2glMjAoMWtnKXxlbnwwfHwwfHx8MA%3D%3D",
          ],
          rating: 4.5,
          reviews: 65,
          badge: "Fresh",
          tags: ["rock fish", "fish", "seafood", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 55,
          categoryId: seafoodCategory.id
        },
        {
          name: "Red Pacu Fish (Owere) (1kg)",
          description: "Fresh red pacu fish, perfect for traditional dishes.",
          price: 400000,
          originalPrice: 440000,
          images: [
            "https://images.unsplash.com/photo-1603431776785-4b9c86fe1a40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UmVkJTIwUGFjdSUyMEZpc2glMjAoT3dlcmUpJTIwKDFrZyl8ZW58MHx8MHx8fDA%3D",
            "https://images.unsplash.com/photo-1635474434045-f99c366e02ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8UmVkJTIwUGFjdSUyMEZpc2glMjAoT3dlcmUpJTIwKDFrZyl8ZW58MHx8MHx8fDA%3D"
          ],
          rating: 4.5,
          reviews: 60,
          badge: "Fresh",
          tags: ["red pacu", "fish", "seafood", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 50,
          categoryId: seafoodCategory.id
        },
        {
          name: "Meat Crumbs (Pet Food) (1kg)",
          description: "High-quality meat crumbs, ideal for pet food.",
          price: 400000,
          originalPrice: 440000,
          images: [
            "https://images.unsplash.com/photo-1727867168767-c67974f68508?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fE1lYXQlMjBDcnVtYnMlMjAoUGV0JTIwRm9vZCklMjAoMWtnKXxlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1727233430885-aab5af9a1cee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8TWVhdCUyMENydW1icyUyMChQZXQlMjBGb29kKSUyMCgxa2cpfGVufDB8fDB8fHww"
          ],
          rating: 4.4,
          reviews: 50,
          badge: "Pet Food",
          tags: ["meat crumbs", "pet food", "protein"],
          featured: false,
          bestSeller: false,
          organic: false,
          inStock: true,
          stockCount: 60,
          categoryId: animalBasedProtein.id
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