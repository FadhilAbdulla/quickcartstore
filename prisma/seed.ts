import "dotenv/config"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  // Admin user
  const adminPassword = await bcrypt.hash("Admin@123", 12)
  const admin = await db.user.upsert({
    where: { email: "admin@quickcart.ae" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@quickcart.ae",
      password: adminPassword,
      role: "ADMIN",
    },
  })
  console.log("✅ Admin user created:", admin.email)

  // Sample customer
  const customerPassword = await bcrypt.hash("Customer@123", 12)
  await db.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Ahmed Al Mansouri",
      email: "customer@example.com",
      password: customerPassword,
      phone: "+971 50 123 4567",
      role: "CUSTOMER",
    },
  })

  // Brands
  const brands = await Promise.all([
    db.brand.upsert({ where: { name: "Apple" }, update: {}, create: { name: "Apple" } }),
    db.brand.upsert({ where: { name: "Dell" }, update: {}, create: { name: "Dell" } }),
    db.brand.upsert({ where: { name: "Lenovo" }, update: {}, create: { name: "Lenovo" } }),
    db.brand.upsert({ where: { name: "HP" }, update: {}, create: { name: "HP" } }),
    db.brand.upsert({ where: { name: "ASUS" }, update: {}, create: { name: "ASUS" } }),
    db.brand.upsert({ where: { name: "Microsoft" }, update: {}, create: { name: "Microsoft" } }),
    db.brand.upsert({ where: { name: "Samsung" }, update: {}, create: { name: "Samsung" } }),
  ])

  const [apple, dell, lenovo, hp, asus, microsoft] = brands
  console.log("✅ Brands created:", brands.map((b) => b.name).join(", "))

  // Categories
  const categories = await Promise.all([
    db.category.upsert({ where: { name: "Business" }, update: {}, create: { name: "Business", slug: "business" } }),
    db.category.upsert({ where: { name: "Gaming" }, update: {}, create: { name: "Gaming", slug: "gaming" } }),
    db.category.upsert({ where: { name: "Student" }, update: {}, create: { name: "Student", slug: "student" } }),
    db.category.upsert({ where: { name: "Creative" }, update: {}, create: { name: "Creative", slug: "creative" } }),
    db.category.upsert({ where: { name: "Ultrabook" }, update: {}, create: { name: "Ultrabook", slug: "ultrabook" } }),
  ])

  const [business, gaming, student, creative, ultrabook] = categories
  console.log("✅ Categories created:", categories.map((c) => c.name).join(", "))

  // Products
  const products = [
    {
      name: "Apple MacBook Pro 14-inch M4 Pro",
      slug: "apple-macbook-pro-14-m4-pro",
      description:
        "The MacBook Pro 14-inch with M4 Pro chip delivers extraordinary performance with up to 24-core CPU and 40-core GPU. Perfect for professionals in the UAE who need the ultimate portable workstation.",
      price: 9999,
      comparePrice: 10999,
      brandId: apple.id,
      categoryId: creative.id,
      sku: "APPLE-MBP14-M4PRO-2024",
      stock: 25,
      isFeatured: true,
      images: [
        "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-m4pro-spacblk-gallery1-202410?wid=4000&hei=2800&fmt=jpeg&qlt=90&.v=1728916255679",
      ],
      specs: {
        processor: "Apple M4 Pro (12-core CPU, 20-core GPU)",
        ram: "24GB Unified Memory",
        storage: "512GB SSD",
        display: "14.2\" Liquid Retina XDR, 3024x1964, ProMotion 120Hz",
        graphics: "20-core GPU",
        battery: "Up to 22 hours",
        weight: "1.61 kg",
        os: "macOS Sequoia",
      },
    },
    {
      name: "Apple MacBook Air 13-inch M3",
      slug: "apple-macbook-air-13-m3",
      description:
        "Supercharged by M3, MacBook Air is more capable than ever. With a fanless design, all-day battery, and stunning 13.6-inch Liquid Retina display — it's the perfect everyday laptop for UAE users.",
      price: 5299,
      comparePrice: 5799,
      brandId: apple.id,
      categoryId: ultrabook.id,
      sku: "APPLE-MBA13-M3-2024",
      stock: 40,
      isFeatured: true,
      images: [
        "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034",
      ],
      specs: {
        processor: "Apple M3 (8-core CPU, 10-core GPU)",
        ram: "16GB Unified Memory",
        storage: "256GB SSD",
        display: "13.6\" Liquid Retina, 2560x1664",
        graphics: "10-core GPU",
        battery: "Up to 18 hours",
        weight: "1.24 kg",
        os: "macOS Sequoia",
      },
    },
    {
      name: "Dell XPS 15 9530 OLED",
      slug: "dell-xps-15-9530-oled",
      description:
        "The Dell XPS 15 with OLED display redefines visual excellence. Powered by Intel Core i9 and NVIDIA RTX 4070, this is the ultimate creative powerhouse for Dubai's creative professionals.",
      price: 8499,
      comparePrice: 9499,
      brandId: dell.id,
      categoryId: creative.id,
      sku: "DELL-XPS15-9530-OLED",
      stock: 15,
      isFeatured: true,
      images: [
        "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/black/notebook-xps-15-9530-black-gallery-1.psd?fmt=png-alpha&wid=800&hei=800",
      ],
      specs: {
        processor: "Intel Core i9-13900H (up to 5.4GHz)",
        ram: "32GB DDR5",
        storage: "1TB NVMe SSD",
        display: "15.6\" 3.5K OLED, 3456x2160, 60Hz",
        graphics: "NVIDIA GeForce RTX 4070 8GB",
        battery: "Up to 13 hours",
        weight: "1.86 kg",
        os: "Windows 11 Pro",
      },
    },
    {
      name: "Dell XPS 13 Plus 9320",
      slug: "dell-xps-13-plus-9320",
      description:
        "The XPS 13 Plus is a bold evolution of the iconic XPS 13. Futuristic design meets powerhouse performance with Intel Core i7 and a stunning 13.4\" OLED display.",
      price: 5999,
      brandId: dell.id,
      categoryId: ultrabook.id,
      sku: "DELL-XPS13-PLUS-9320",
      stock: 20,
      isFeatured: false,
      images: [],
      specs: {
        processor: "Intel Core i7-1360P",
        ram: "16GB LPDDR5",
        storage: "512GB SSD",
        display: '13.4" OLED, 2880x1800',
        graphics: "Intel Iris Xe",
        battery: "Up to 12 hours",
        weight: "1.24 kg",
        os: "Windows 11 Home",
      },
    },
    {
      name: "Lenovo ThinkPad X1 Carbon Gen 12",
      slug: "lenovo-thinkpad-x1-carbon-gen-12",
      description:
        "The world's best business ultrabook. Built for UAE executives who demand performance and security without compromise. MIL-SPEC durability, 5G connectivity, and legendary keyboard.",
      price: 7299,
      comparePrice: 8199,
      brandId: lenovo.id,
      categoryId: business.id,
      sku: "LNV-X1C-G12-2024",
      stock: 18,
      isFeatured: true,
      images: [],
      specs: {
        processor: "Intel Core Ultra 7 165U",
        ram: "32GB LPDDR5",
        storage: "1TB SSD",
        display: '14" IPS, 2880x1800, 90Hz',
        graphics: "Intel Arc Graphics",
        battery: "Up to 15 hours",
        weight: "1.12 kg",
        os: "Windows 11 Pro",
      },
    },
    {
      name: "Lenovo Legion Pro 7i Gen 9",
      slug: "lenovo-legion-pro-7i-gen-9",
      description:
        "Unleash gaming power with the Legion Pro 7i. Intel Core i9 + NVIDIA RTX 4080 with 16GB VRAM makes this the ultimate gaming laptop for UAE gamers who want desktop-class performance.",
      price: 11499,
      comparePrice: 12999,
      brandId: lenovo.id,
      categoryId: gaming.id,
      sku: "LNV-LEGION-PRO7I-G9",
      stock: 10,
      isFeatured: true,
      images: [],
      specs: {
        processor: "Intel Core i9-14900HX",
        ram: "32GB DDR5",
        storage: "1TB NVMe Gen4 SSD",
        display: '16" IPS, 2560x1600, 240Hz',
        graphics: "NVIDIA GeForce RTX 4080 16GB",
        battery: "Up to 4 hours gaming",
        weight: "2.9 kg",
        os: "Windows 11 Home",
      },
    },
    {
      name: "HP Spectre x360 14",
      slug: "hp-spectre-x360-14",
      description:
        "The HP Spectre x360 14 is a premium 2-in-1 laptop that adapts to your lifestyle. Ultra-slim design with OLED display, Intel Core Ultra, and HP Sure View Privacy Screen.",
      price: 6799,
      comparePrice: 7499,
      brandId: hp.id,
      categoryId: ultrabook.id,
      sku: "HP-SPECTRE-X360-14-2024",
      stock: 22,
      isFeatured: false,
      images: [],
      specs: {
        processor: "Intel Core Ultra 7 155H",
        ram: "32GB LPDDR5",
        storage: "2TB SSD",
        display: '14" 2.8K OLED OLED, 2880x1800, 120Hz',
        graphics: "Intel Arc Graphics",
        battery: "Up to 17 hours",
        weight: "1.49 kg",
        os: "Windows 11 Pro",
      },
    },
    {
      name: "HP EliteBook 840 G11",
      slug: "hp-elitebook-840-g11",
      description:
        "Enterprise-grade security and performance for UAE business users. HP EliteBook 840 G11 features Intel vPro, AI-accelerated performance, and military-grade durability.",
      price: 5499,
      brandId: hp.id,
      categoryId: business.id,
      sku: "HP-ELITE840-G11",
      stock: 30,
      isFeatured: false,
      images: [],
      specs: {
        processor: "Intel Core Ultra 5 135U vPro",
        ram: "16GB DDR5",
        storage: "512GB SSD",
        display: '14" WUXGA IPS, 1920x1200',
        graphics: "Intel Graphics",
        battery: "Up to 16 hours",
        weight: "1.40 kg",
        os: "Windows 11 Pro",
      },
    },
    {
      name: "ASUS ROG Zephyrus G16 2024",
      slug: "asus-rog-zephyrus-g16-2024",
      description:
        "The ASUS ROG Zephyrus G16 redefines gaming aesthetics. OLED display, AMD Ryzen 9, and RTX 4090 in an impossibly slim chassis — the ultimate gaming laptop for UAE enthusiasts.",
      price: 13999,
      comparePrice: 15499,
      brandId: asus.id,
      categoryId: gaming.id,
      sku: "ASUS-ROG-ZG16-2024",
      stock: 8,
      isFeatured: true,
      images: [],
      specs: {
        processor: "AMD Ryzen 9 8945HS",
        ram: "32GB DDR5",
        storage: "1TB PCIe 4.0 SSD",
        display: '16" QHD+ OLED, 2560x1600, 240Hz',
        graphics: "NVIDIA GeForce RTX 4090 16GB",
        battery: "Up to 10 hours",
        weight: "1.85 kg",
        os: "Windows 11 Home",
      },
    },
    {
      name: "ASUS ZenBook 14 OLED",
      slug: "asus-zenbook-14-oled",
      description:
        "Thin, light, and brilliant. The ASUS ZenBook 14 OLED features a gorgeous 2.8K OLED display and Intel Core Ultra processor in a featherweight design perfect for UAE students.",
      price: 3799,
      comparePrice: 4299,
      brandId: asus.id,
      categoryId: student.id,
      sku: "ASUS-ZB14-OLED-2024",
      stock: 35,
      isFeatured: false,
      images: [],
      specs: {
        processor: "Intel Core Ultra 5 125H",
        ram: "16GB LPDDR5",
        storage: "512GB SSD",
        display: '14" 2.8K OLED, 2880x1800, 120Hz',
        graphics: "Intel Arc Graphics",
        battery: "Up to 15 hours",
        weight: "1.28 kg",
        os: "Windows 11 Home",
      },
    },
    {
      name: "Microsoft Surface Laptop 7",
      slug: "microsoft-surface-laptop-7",
      description:
        "The Surface Laptop 7 with Snapdragon X Elite delivers exceptional battery life and AI performance. Ultra-slim, beautiful design with Copilot+ PC capabilities for UAE professionals.",
      price: 6499,
      brandId: microsoft.id,
      categoryId: ultrabook.id,
      sku: "MS-SURFACE-LP7-2024",
      stock: 12,
      isFeatured: false,
      images: [],
      specs: {
        processor: "Snapdragon X Elite X1E-80-100",
        ram: "32GB",
        storage: "1TB SSD",
        display: '13.8" PixelSense, 2304x1536, 120Hz',
        graphics: "Qualcomm Adreno",
        battery: "Up to 22 hours",
        weight: "1.34 kg",
        os: "Windows 11 Home",
      },
    },
    {
      name: "HP Victus 15 Gaming",
      slug: "hp-victus-15-gaming",
      description:
        "Affordable gaming power for UAE students and casual gamers. HP Victus 15 with AMD Ryzen 7 and RTX 4060 delivers serious gaming performance at a great value.",
      price: 3299,
      comparePrice: 3799,
      brandId: hp.id,
      categoryId: gaming.id,
      sku: "HP-VICTUS15-RTX4060",
      stock: 45,
      isFeatured: false,
      images: [],
      specs: {
        processor: "AMD Ryzen 7 7745HX",
        ram: "16GB DDR5",
        storage: "512GB SSD",
        display: '15.6" FHD IPS, 1920x1080, 144Hz',
        graphics: "NVIDIA GeForce RTX 4060 8GB",
        battery: "Up to 6 hours",
        weight: "2.29 kg",
        os: "Windows 11 Home",
      },
    },
  ]

  for (const product of products) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: { stock: product.stock },
      create: product,
    })
    process.stdout.write(".")
  }

  console.log(`\n✅ ${products.length} products seeded`)
  console.log("\n🎉 Database seeded successfully!")
  console.log("\nAdmin login: admin@quickcart.ae / Admin@123")
  console.log("Customer login: customer@example.com / Customer@123")
}

main()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect()
  })
