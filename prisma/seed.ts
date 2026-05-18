import "dotenv/config"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

// Unsplash photo IDs by product type (reliable, publicly accessible)
const IMG = {
  // Laptops
  laptop_business: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80&auto=format&fit=crop",
  laptop_business2: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80&auto=format&fit=crop",
  laptop_thin: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80&auto=format&fit=crop",
  laptop_surface: "https://images.unsplash.com/photo-1611186871525-9a13a3ded0a0?w=800&q=80&auto=format&fit=crop",
  laptop_hp: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80&auto=format&fit=crop",
  laptop_gaming: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80&auto=format&fit=crop",
  laptop_gaming2: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80&auto=format&fit=crop",
  laptop_gaming3: "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=800&q=80&auto=format&fit=crop",
  // Apple — official Apple CDN (confirmed working)
  macbook_air: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90",
  macbook_pro: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-m4pro-spacblk-gallery1-202410?wid=4000&hei=2800&fmt=jpeg&qlt=90",
  // Monitors
  monitor: "https://images.unsplash.com/photo-1527443224154-c4a573d3f8e1?w=800&q=80&auto=format&fit=crop",
  monitor_gaming: "https://images.unsplash.com/photo-1616449961837-b18a98e11e84?w=800&q=80&auto=format&fit=crop",
  monitor_4k: "https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=80&auto=format&fit=crop",
  // PC Components
  gpu: "https://images.unsplash.com/photo-1591489378430-ef2f4c626b6f?w=800&q=80&auto=format&fit=crop",
  cpu: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80&auto=format&fit=crop",
  ram: "https://images.unsplash.com/photo-1541185934-01b600ea069c?w=800&q=80&auto=format&fit=crop",
  ssd: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80&auto=format&fit=crop",
  psu: "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=800&q=80&auto=format&fit=crop",
  // Networking
  router: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&q=80&auto=format&fit=crop",
  switch_net: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&auto=format&fit=crop",
  ap: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80&auto=format&fit=crop",
  // Storage
  hdd: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80&auto=format&fit=crop",
  portable_hdd: "https://images.unsplash.com/photo-1597766353939-3b5f8d5c4c4c?w=800&q=80&auto=format&fit=crop",
  portable_ssd: "https://images.unsplash.com/photo-1639843506494-3a09e5b7c1cb?w=800&q=80&auto=format&fit=crop",
  // Peripherals
  keyboard: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80&auto=format&fit=crop",
  mouse: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80&auto=format&fit=crop",
  webcam: "https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?w=800&q=80&auto=format&fit=crop",
  headset: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop",
  // Printers
  printer_laser: "https://images.unsplash.com/photo-1612815091029-d7ffdcf2a9f8?w=800&q=80&auto=format&fit=crop",
  printer_inkjet: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80&auto=format&fit=crop",
  // Tablets
  tablet_surface: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80&auto=format&fit=crop",
  tablet_android: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80&auto=format&fit=crop",
}

async function main() {
  console.log("🌱 Seeding database...")

  // Users
  const adminPassword = await bcrypt.hash("Admin@123", 12)
  const admin = await db.user.upsert({
    where: { email: "admin@quickcart.ae" },
    update: {},
    create: { name: "Admin User", email: "admin@quickcart.ae", password: adminPassword, role: "ADMIN" },
  })
  console.log("✅ Admin user:", admin.email)

  await db.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: { name: "Ahmed Al Mansouri", email: "customer@example.com", password: await bcrypt.hash("Customer@123", 12), phone: "+971 50 123 4567", role: "CUSTOMER" },
  })

  // Brands
  const brandNames = ["Apple", "Acer", "ASUS", "Dell", "HP", "Lenovo", "Microsoft", "MSI", "Samsung", "TP-Link", "Seagate", "Western Digital", "Logitech", "Canon", "LG", "Intel", "Corsair", "Ubiquiti", "Epson"]
  const brandMap: Record<string, string> = {}
  for (const name of brandNames) {
    const b = await db.brand.upsert({ where: { name }, update: {}, create: { name } })
    brandMap[name] = b.id
  }
  console.log("✅ Brands:", brandNames.join(", "))

  // Categories
  const categoryDefs = [
    { name: "Laptops", slug: "laptops" },
    { name: "Gaming", slug: "gaming" },
    { name: "Desktops", slug: "desktops" },
    { name: "Monitors", slug: "monitors" },
    { name: "PC Components", slug: "pc-components" },
    { name: "Networking", slug: "networking" },
    { name: "Storage", slug: "storage" },
    { name: "Peripherals", slug: "peripherals" },
    { name: "Printers", slug: "printers" },
    { name: "Tablets", slug: "tablets" },
  ]
  const catMap: Record<string, string> = {}
  for (const cat of categoryDefs) {
    const c = await db.category.upsert({ where: { name: cat.name }, update: {}, create: cat })
    catMap[cat.slug] = c.id
  }
  console.log("✅ Categories:", categoryDefs.map((c) => c.name).join(", "))

  // Products
  const products = [
    // ── LAPTOPS ──────────────────────────────────────────────────────
    {
      name: "Acer TravelMate P6 14",
      slug: "acer-travelmate-p6-14",
      description: "Lightweight business laptop with Intel Core i5, 8GB RAM and 512GB SSD. Ideal for UAE professionals on the move with all-day battery life and a slim profile.",
      price: 2239, comparePrice: 2839,
      brandId: brandMap["Acer"], categoryId: catMap["laptops"],
      sku: "ACER-TMP6-I5-8-512", stock: 30, isFeatured: true,
      images: [IMG.laptop_business],
      specs: { processor: "Intel Core i5-1335U", ram: "8GB DDR5", storage: "512GB SSD", display: '14" WUXGA IPS 1920x1200', graphics: "Intel Iris Xe", battery: "Up to 12 hours", weight: "1.2 kg", os: "Windows 11 Pro" },
    },
    {
      name: "Acer TravelMate P6 14 Touch",
      slug: "acer-travelmate-p6-14-touch",
      description: "Business laptop with touchscreen, Intel Core i7, 16GB RAM and 512GB SSD. Perfect for executives who need versatile, touch-capable productivity in the UAE.",
      price: 2929, comparePrice: 3529,
      brandId: brandMap["Acer"], categoryId: catMap["laptops"],
      sku: "ACER-TMP6-I7-16-512T", stock: 20, isFeatured: false,
      images: [IMG.laptop_business2],
      specs: { processor: "Intel Core i7-1335U", ram: "16GB DDR5", storage: "512GB SSD", display: '14" WUXGA IPS Touch 1920x1200', graphics: "Intel Iris Xe", battery: "Up to 11 hours", weight: "1.3 kg", os: "Windows 11 Pro" },
    },
    {
      name: "Microsoft Surface Laptop 6 13.5\"",
      slug: "microsoft-surface-laptop-6-13",
      description: "Copilot+ PC with Intel Core Ultra 7 and stunning PixelSense display. Purpose-built for AI-powered productivity — a flagship for UAE professionals.",
      price: 10889, comparePrice: 11789,
      brandId: brandMap["Microsoft"], categoryId: catMap["laptops"],
      sku: "MS-SL6-CU7-64-1TB", stock: 12, isFeatured: true,
      images: [IMG.laptop_surface],
      specs: { processor: "Intel Core Ultra 7 165H", ram: "64GB LPDDR5x", storage: "1TB SSD", display: '13.5" PixelSense 2256x1504', graphics: "Intel Arc", battery: "Up to 19 hours", weight: "1.34 kg", os: "Windows 11 Home" },
    },
    {
      name: "Microsoft Surface Laptop 7 15\"",
      slug: "microsoft-surface-laptop-7-15",
      description: "Snapdragon X Elite powered Copilot+ PC with up to 22 hours battery. Exceptional AI performance in a premium, slim chassis for UAE power users.",
      price: 6729, comparePrice: 7629,
      brandId: brandMap["Microsoft"], categoryId: catMap["laptops"],
      sku: "MS-SL7-SX-16-1TB", stock: 18, isFeatured: true,
      images: [IMG.laptop_surface],
      specs: { processor: "Snapdragon X Elite X1E-80-100", ram: "16GB", storage: "1TB SSD", display: '15" PixelSense Flow 2496x1664 120Hz', graphics: "Qualcomm Adreno X1", battery: "Up to 22 hours", weight: "1.66 kg", os: "Windows 11 Home" },
    },
    {
      name: "HP EliteBook 8 G1i 14",
      slug: "hp-elitebook-8-g1i-14",
      description: "Premium business ultrabook with Intel Core Ultra 7, 32GB RAM and 1TB SSD. Enterprise-grade security and AI features built for UAE organisations.",
      price: 6199, comparePrice: 7229,
      brandId: brandMap["HP"], categoryId: catMap["laptops"],
      sku: "HP-EB8G1I-CU7-32-1TB", stock: 15, isFeatured: false,
      images: [IMG.laptop_hp],
      specs: { processor: "Intel Core Ultra 7 258V", ram: "32GB LPDDR5x", storage: "1TB SSD", display: '14" WUXGA IPS 1920x1200', graphics: "Intel Arc", battery: "Up to 17 hours", weight: "1.3 kg", os: "Windows 11 Pro" },
    },
    {
      name: "HP Laptop 15 FHD",
      slug: "hp-laptop-15-fhd",
      description: "Everyday laptop with Intel Core 5, 16GB DDR5 RAM and 512GB SSD. Reliable and affordable computing for UAE students and home users.",
      price: 2369, comparePrice: 2969,
      brandId: brandMap["HP"], categoryId: catMap["laptops"],
      sku: "HP-15-C5-16-512", stock: 50, isFeatured: false,
      images: [IMG.laptop_business],
      specs: { processor: "Intel Core 5 120U", ram: "16GB DDR5", storage: "512GB SSD", display: '15.6" FHD IPS 1920x1080', graphics: "Intel UHD", battery: "Up to 9 hours", weight: "1.75 kg", os: "Windows 11 Home" },
    },
    {
      name: "Acer TravelMate P2 14",
      slug: "acer-travelmate-p2-14",
      description: "Entry-level business laptop with Intel Core i5, 8GB RAM and 512GB SSD. Dependable performance for everyday office work across the UAE.",
      price: 2289, comparePrice: 2889,
      brandId: brandMap["Acer"], categoryId: catMap["laptops"],
      sku: "ACER-TMP2-I5-8-512", stock: 35, isFeatured: false,
      images: [IMG.laptop_thin],
      specs: { processor: "Intel Core i5-1335U", ram: "8GB DDR4", storage: "512GB SSD", display: '14" FHD IPS 1920x1080', graphics: "Intel Iris Xe", battery: "Up to 10 hours", weight: "1.55 kg", os: "Windows 11 Pro" },
    },
    {
      name: "Apple MacBook Air 13\" M3",
      slug: "apple-macbook-air-13-m3",
      description: "Supercharged by M3, MacBook Air is the ultimate everyday laptop. Fanless design, all-day battery and stunning Liquid Retina display for UAE creatives.",
      price: 5299, comparePrice: 5799,
      brandId: brandMap["Apple"], categoryId: catMap["laptops"],
      sku: "APPLE-MBA13-M3-16-256", stock: 40, isFeatured: true,
      images: [IMG.macbook_air],
      specs: { processor: "Apple M3 (8-core CPU)", ram: "16GB Unified Memory", storage: "256GB SSD", display: '13.6" Liquid Retina 2560x1664', graphics: "10-core GPU", battery: "Up to 18 hours", weight: "1.24 kg", os: "macOS Sequoia" },
    },
    {
      name: "Apple MacBook Pro 14\" M4 Pro",
      slug: "apple-macbook-pro-14-m4-pro",
      description: "Extraordinary professional performance with M4 Pro chip. The go-to workstation for designers, developers and video editors across the UAE.",
      price: 9999, comparePrice: 10999,
      brandId: brandMap["Apple"], categoryId: catMap["laptops"],
      sku: "APPLE-MBP14-M4P-24-512", stock: 20, isFeatured: true,
      images: [IMG.macbook_pro],
      specs: { processor: "Apple M4 Pro (12-core CPU)", ram: "24GB Unified Memory", storage: "512GB SSD", display: '14.2" Liquid Retina XDR 3024x1964 120Hz', graphics: "20-core GPU", battery: "Up to 22 hours", weight: "1.61 kg", os: "macOS Sequoia" },
    },

    // ── GAMING ───────────────────────────────────────────────────────
    {
      name: "Acer Predator Helios Neo 16 AI (RTX 5070)",
      slug: "acer-predator-helios-neo-16-rtx5070",
      description: "Next-gen gaming powerhouse with Intel Core Ultra 9, 32GB RAM and RTX 5070 GPU. Destroy every game at blazing speeds on the 180Hz WQXGA display.",
      price: 8009, comparePrice: 8909,
      brandId: brandMap["Acer"], categoryId: catMap["gaming"],
      sku: "ACER-PHN16-CU9-32-5070", stock: 15, isFeatured: true,
      images: [IMG.laptop_gaming],
      specs: { processor: "Intel Core Ultra 9 275HX", ram: "32GB DDR5", storage: "1TB SSD", display: '16" WQXGA IPS 2560x1600 180Hz', graphics: "NVIDIA GeForce RTX 5070 8GB", battery: "Up to 4 hours gaming", weight: "2.6 kg", os: "Windows 11 Home" },
    },
    {
      name: "Acer Predator Helios Neo 16 AI (RTX 5060)",
      slug: "acer-predator-helios-neo-16-rtx5060",
      description: "High-performance gaming with Intel Core Ultra 9 and RTX 5060, at a compelling price point. 180Hz WQXGA display ensures buttery-smooth visuals.",
      price: 6339, comparePrice: 7239,
      brandId: brandMap["Acer"], categoryId: catMap["gaming"],
      sku: "ACER-PHN16-CU9-16-5060", stock: 20, isFeatured: false,
      images: [IMG.laptop_gaming2],
      specs: { processor: "Intel Core Ultra 9 275HX", ram: "16GB DDR5", storage: "1TB SSD", display: '16" WQXGA IPS 2560x1600 180Hz', graphics: "NVIDIA GeForce RTX 5060 8GB", battery: "Up to 5 hours gaming", weight: "2.6 kg", os: "Windows 11 Home" },
    },
    {
      name: "Acer Nitro V 16S Gaming",
      slug: "acer-nitro-v-16s-gaming",
      description: "Affordable gaming beast with Intel Core 7 240H and RTX 4060. The Nitro V 16S delivers 1440p gaming performance that won't break the bank.",
      price: 4999, comparePrice: 5589,
      brandId: brandMap["Acer"], categoryId: catMap["gaming"],
      sku: "ACER-NV16S-C7-16-4060", stock: 25, isFeatured: true,
      images: [IMG.laptop_gaming],
      specs: { processor: "Intel Core 7 240H", ram: "16GB DDR5", storage: "1TB SSD", display: '16" WQXGA IPS 2560x1600 165Hz', graphics: "NVIDIA GeForce RTX 4060 8GB", battery: "Up to 6 hours", weight: "2.5 kg", os: "Windows 11 Home" },
    },
    {
      name: "ASUS ROG Strix G16 G615LR",
      slug: "asus-rog-strix-g16-g615lr",
      description: "Premium gaming laptop with Intel Core Ultra 7 and RTX 5070 Ti. The ROG Strix G16 sets the bar for gaming performance with its 165Hz FHD+ display.",
      price: 8759, comparePrice: 9659,
      brandId: brandMap["ASUS"], categoryId: catMap["gaming"],
      sku: "ASUS-ROG-G615LR-CU7-32", stock: 12, isFeatured: true,
      images: [IMG.laptop_gaming2],
      specs: { processor: "Intel Core Ultra 7 255HX", ram: "32GB DDR5", storage: "1TB SSD", display: '16" FHD+ IPS 1920x1200 165Hz', graphics: "NVIDIA GeForce RTX 5070 Ti 12GB", battery: "Up to 4 hours gaming", weight: "2.5 kg", os: "Windows 11 Home" },
    },
    {
      name: "Acer Predator Helios 18",
      slug: "acer-predator-helios-18",
      description: "Flagship 18-inch gaming powerhouse with Core i9-14900HX and RTX 4080. The largest Predator for gamers who want the ultimate desktop-replacement experience.",
      price: 9859, comparePrice: 10759,
      brandId: brandMap["Acer"], categoryId: catMap["gaming"],
      sku: "ACER-PH18-I9-32-4080", stock: 8, isFeatured: false,
      images: [IMG.laptop_gaming3],
      specs: { processor: "Intel Core i9-14900HX", ram: "32GB DDR5", storage: "1TB SSD", display: '18" FHD+ IPS 1920x1200 250Hz', graphics: "NVIDIA GeForce RTX 4080 12GB", battery: "Up to 3 hours gaming", weight: "3.8 kg", os: "Windows 11 Home" },
    },
    {
      name: "Lenovo LOQ 15IRX9",
      slug: "lenovo-loq-15irx9",
      description: "Budget-friendly gaming with Core i5-13450HX and RTX 3050. The Lenovo LOQ is the best entry point for gamers in the UAE who want real GPU performance.",
      price: 2869, comparePrice: 3469,
      brandId: brandMap["Lenovo"], categoryId: catMap["gaming"],
      sku: "LNV-LOQ15-I5-16-3050", stock: 40, isFeatured: false,
      images: [IMG.laptop_gaming3],
      specs: { processor: "Intel Core i5-13450HX", ram: "16GB DDR5", storage: "512GB SSD", display: '15.6" FHD IPS 1920x1080 144Hz', graphics: "NVIDIA GeForce RTX 3050 6GB", battery: "Up to 7 hours", weight: "2.4 kg", os: "Windows 11 Home" },
    },
    {
      name: "HP OMEN Transcend 14",
      slug: "hp-omen-transcend-14",
      description: "Ultra-portable gaming with Core Ultra 9 and RTX 4070 in a 14-inch OLED package. The OMEN Transcend redefines thin gaming laptops for UAE enthusiasts.",
      price: 7469, comparePrice: 8369,
      brandId: brandMap["HP"], categoryId: catMap["gaming"],
      sku: "HP-OMEN14-CU9-32-4070", stock: 10, isFeatured: true,
      images: [IMG.laptop_gaming],
      specs: { processor: "Intel Core Ultra 9 185H", ram: "32GB LPDDR5x", storage: "1TB SSD", display: '14" 3K OLED 2880x1800 120Hz', graphics: "NVIDIA GeForce RTX 4070 8GB", battery: "Up to 8 hours", weight: "1.75 kg", os: "Windows 11 Home" },
    },

    // ── MONITORS ─────────────────────────────────────────────────────
    {
      name: "Dell P2425H 24\" FHD Monitor",
      slug: "dell-p2425h-24-fhd",
      description: "24-inch FHD IPS monitor with USB-C and daisy-chaining. Perfect for multi-monitor productivity setups in UAE offices.",
      price: 799, comparePrice: 999,
      brandId: brandMap["Dell"], categoryId: catMap["monitors"],
      sku: "DELL-P2425H-24", stock: 60, isFeatured: true,
      images: [IMG.monitor],
      specs: { size: '24"', resolution: "1920x1080 (FHD)", panel: "IPS", refreshRate: "100Hz", responseTime: "5ms", ports: "USB-C, HDMI, DisplayPort, USB-A Hub", brightness: "250 nits", aspectRatio: "16:9" },
    },
    {
      name: "LG 27UK850 27\" 4K IPS Monitor",
      slug: "lg-27uk850-27-4k",
      description: "27-inch 4K UHD IPS display with USB-C Power Delivery and HDR10. Exceptional colour accuracy for creatives and professionals in the UAE.",
      price: 1599, comparePrice: 1999,
      brandId: brandMap["LG"], categoryId: catMap["monitors"],
      sku: "LG-27UK850-4K-USB-C", stock: 35, isFeatured: true,
      images: [IMG.monitor_4k],
      specs: { size: '27"', resolution: "3840x2160 (4K UHD)", panel: "IPS", refreshRate: "60Hz", responseTime: "5ms", ports: "USB-C 60W PD, 2x HDMI, DisplayPort, USB Hub", brightness: "400 nits", hdr: "HDR10" },
    },
    {
      name: "Samsung Odyssey G5 27\" QHD Gaming",
      slug: "samsung-odyssey-g5-27-qhd",
      description: "27-inch QHD curved gaming monitor with 165Hz refresh rate and 1ms response. Immersive visuals for UAE gamers who want the competitive edge.",
      price: 1099, comparePrice: 1399,
      brandId: brandMap["Samsung"], categoryId: catMap["monitors"],
      sku: "SAMSUNG-G5-27-QHD-165", stock: 45, isFeatured: false,
      images: [IMG.monitor_gaming],
      specs: { size: '27"', resolution: "2560x1440 (QHD)", panel: "VA Curved 1000R", refreshRate: "165Hz", responseTime: "1ms MPRT", ports: "HDMI 2.0, DisplayPort 1.2", brightness: "350 nits", hdr: "HDR10" },
    },
    {
      name: "ASUS ProArt PA279CRV 27\" 4K Professional",
      slug: "asus-proart-pa279crv-27-4k",
      description: "Factory-calibrated 4K display with 99% DCI-P3 and USB-C 96W PD. The professional monitor of choice for designers and photographers in the UAE.",
      price: 2299, comparePrice: 2799,
      brandId: brandMap["ASUS"], categoryId: catMap["monitors"],
      sku: "ASUS-PA279CRV-4K-96W", stock: 20, isFeatured: true,
      images: [IMG.monitor_4k],
      specs: { size: '27"', resolution: "3840x2160 (4K UHD)", panel: "IPS", refreshRate: "60Hz", responseTime: "5ms", ports: "USB-C 96W PD, 2x HDMI 2.0, DisplayPort 1.4, 4x USB-A", brightness: "400 nits", colorCoverage: "99% DCI-P3" },
    },
    {
      name: "HP E24 G5 24\" FHD Business Monitor",
      slug: "hp-e24-g5-24-fhd",
      description: "Ergonomic 24-inch FHD monitor with height-adjustable stand and daisy-chaining support. Built for ergonomic UAE office environments.",
      price: 649, comparePrice: 799,
      brandId: brandMap["HP"], categoryId: catMap["monitors"],
      sku: "HP-E24G5-FHD-USB-C", stock: 70, isFeatured: false,
      images: [IMG.monitor],
      specs: { size: '24"', resolution: "1920x1080 (FHD)", panel: "IPS", refreshRate: "60Hz", responseTime: "5ms", ports: "USB-C, HDMI, DisplayPort, USB Hub", brightness: "250 nits", ergonomics: "Height, tilt, swivel, pivot" },
    },

    // ── PC COMPONENTS ────────────────────────────────────────────────
    {
      name: "ASUS ProArt RTX 5080 OC 16GB",
      slug: "asus-proart-rtx5080-oc-16gb",
      description: "Next-generation NVIDIA RTX 5080 with 16GB GDDR7 and PCIe 5.0 interface. Unmatched AI and creative rendering power for UAE workstation builders.",
      price: 7579, comparePrice: 8479,
      brandId: brandMap["ASUS"], categoryId: catMap["pc-components"],
      sku: "ASUS-PROART-RTX5080-16GB", stock: 15, isFeatured: true,
      images: [IMG.gpu],
      specs: { gpu: "NVIDIA GeForce RTX 5080", vram: "16GB GDDR7", memoryBus: "256-bit", interface: "PCIe 5.0 x16", tdp: "360W", outputs: "3x DisplayPort 2.1, 1x HDMI 2.1", aiTops: "1801 AI TOPS" },
    },
    {
      name: "Samsung 870 EVO 1TB SATA SSD",
      slug: "samsung-870-evo-1tb-sata",
      description: "Industry-leading SATA SSD with V-NAND technology and up to 560 MB/s read speeds. The reliable upgrade for any UAE PC or laptop.",
      price: 349, comparePrice: 449,
      brandId: brandMap["Samsung"], categoryId: catMap["pc-components"],
      sku: "SAMSUNG-870EVO-1TB", stock: 100, isFeatured: false,
      images: [IMG.ssd],
      specs: { type: "2.5\" SATA III SSD", capacity: "1TB", readSpeed: "560 MB/s", writeSpeed: "530 MB/s", nand: "Samsung V-NAND 3-bit MLC", formFactor: '2.5"', warranty: "5 years" },
    },
    {
      name: "Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz",
      slug: "corsair-vengeance-ddr5-32gb-6000",
      description: "High-performance DDR5 RAM optimised for Intel and AMD platforms. Automatic XMP 3.0 overclocking support for UAE system builders.",
      price: 399, comparePrice: 499,
      brandId: brandMap["Corsair"], categoryId: catMap["pc-components"],
      sku: "CORSAIR-VEN-DDR5-32GB-6K", stock: 80, isFeatured: false,
      images: [IMG.ram],
      specs: { type: "DDR5 DIMM", capacity: "32GB (2x16GB)", speed: "6000MHz", latency: "CL30", voltage: "1.35V", profile: "Intel XMP 3.0 / AMD EXPO", heatspreader: "Aluminum" },
    },
    {
      name: "Intel Core Ultra 9 285K Processor",
      slug: "intel-core-ultra-9-285k",
      description: "24-core Arrow Lake desktop processor with NPU for AI acceleration. The flagship Intel CPU for high-end UAE workstation and gaming builds.",
      price: 1899, comparePrice: 2299,
      brandId: brandMap["Intel"], categoryId: catMap["pc-components"],
      sku: "INTEL-CU9-285K-24C", stock: 25, isFeatured: true,
      images: [IMG.cpu],
      specs: { cores: "24 (8P+16E)", threads: "24", baseClock: "3.7 GHz", boostClock: "5.7 GHz", cache: "36MB L3", socket: "LGA1851", tdp: "125W (PBP)", npu: "13 TOPS" },
    },
    {
      name: "Seasonic Focus GX-850 80+ Gold PSU",
      slug: "seasonic-focus-gx-850-gold",
      description: "850W fully modular power supply with 80+ Gold efficiency and 10-year warranty. The reliable foundation for any UAE high-performance PC build.",
      price: 549, comparePrice: 699,
      brandId: brandMap["Corsair"], categoryId: catMap["pc-components"],
      sku: "SEASONIC-FGX850-GOLD", stock: 40, isFeatured: false,
      images: [IMG.psu],
      specs: { wattage: "850W", efficiency: "80+ Gold (≥90%)", modular: "Fully Modular", fanSize: "135mm FDB", protections: "OVP, OCP, OPP, SCP, OTP, NLO", connectors: "2x EPS, 4x PCIe 8-pin, 8x SATA", warranty: "10 years" },
    },

    // ── NETWORKING ───────────────────────────────────────────────────
    {
      name: "TP-Link Archer AX73 WiFi 6 Router",
      slug: "tp-link-archer-ax73-wifi6",
      description: "AX5400 WiFi 6 router with 6 antennas and OFDMA technology. Handles dozens of connected devices in UAE homes and small offices with ease.",
      price: 449, comparePrice: 599,
      brandId: brandMap["TP-Link"], categoryId: catMap["networking"],
      sku: "TP-ARCHER-AX73-5400", stock: 55, isFeatured: true,
      images: [IMG.router],
      specs: { standard: "WiFi 6 (802.11ax)", speed: "AX5400 (574+4804 Mbps)", bands: "Dual Band 2.4GHz + 5GHz", antennas: "6 Fixed Antennas", ports: "1x WAN 2.5G, 4x LAN Gigabit", features: "OFDMA, MU-MIMO, Beamforming", processor: "1.5GHz Tri-Core" },
    },
    {
      name: "Ubiquiti UniFi AP Pro WiFi 6",
      slug: "ubiquiti-unifi-ap-pro-wifi6",
      description: "Enterprise-grade WiFi 6 access point with 4x4 MU-MIMO. The preferred choice for UAE businesses and high-density environments requiring reliable wireless.",
      price: 799, comparePrice: 999,
      brandId: brandMap["Ubiquiti"], categoryId: catMap["networking"],
      sku: "UBNT-UNIFI-AP-PRO-6", stock: 30, isFeatured: false,
      images: [IMG.ap],
      specs: { standard: "WiFi 6 (802.11ax)", speed: "AX5300", spatialStreams: "4x4 MU-MIMO", poE: "PoE+ (802.3at)", coverage: "Up to 300m²", maxClients: "300+", management: "UniFi Network Controller" },
    },
    {
      name: "TP-Link TL-SG1024 24-Port Gigabit Switch",
      slug: "tp-link-tl-sg1024-24port",
      description: "Unmanaged 24-port Gigabit switch with fanless design. Silent, reliable and rack-mountable — perfect for UAE SMB network expansion.",
      price: 299, comparePrice: 399,
      brandId: brandMap["TP-Link"], categoryId: catMap["networking"],
      sku: "TP-SG1024-24PORT", stock: 45, isFeatured: false,
      images: [IMG.switch_net],
      specs: { ports: "24x Gigabit RJ45", switching: "Unmanaged", capacity: "48 Gbps", macTable: "8K", formFactor: "19\" Rack Mountable 1U", cooling: "Fanless", standards: "IEEE 802.3, 802.3u, 802.3ab" },
    },
    {
      name: "Cisco SG350-28 28-Port Managed Switch",
      slug: "cisco-sg350-28-managed",
      description: "Layer 3 managed switch with 24 Gigabit + 2 combo SFP ports. Enterprise-class network management for UAE business infrastructure.",
      price: 1999, comparePrice: 2499,
      brandId: brandMap["Ubiquiti"], categoryId: catMap["networking"],
      sku: "CISCO-SG350-28-L3", stock: 15, isFeatured: true,
      images: [IMG.switch_net],
      specs: { ports: "24x Gigabit, 2x SFP Combo, 2x SFP", layer: "Layer 3", management: "Web, CLI, SNMP, RMON", vlans: "Up to 4096 VLANs", routing: "Static and RIP routing", security: "ACL, SSH, HTTPS, 802.1X", formFactor: "19\" Rack Mountable 1U" },
    },

    // ── STORAGE ──────────────────────────────────────────────────────
    {
      name: "Seagate IronWolf 4TB NAS HDD",
      slug: "seagate-ironwolf-4tb-nas",
      description: "Purpose-built 4TB NAS hard drive with CMR and AgileArray technology. Optimised for 24/7 multi-user access in UAE home and business NAS systems.",
      price: 549, comparePrice: 699,
      brandId: brandMap["Seagate"], categoryId: catMap["storage"],
      sku: "SEAGATE-IW-4TB-NAS", stock: 40, isFeatured: true,
      images: [IMG.hdd],
      specs: { capacity: "4TB", type: "3.5\" SATA HDD NAS", rpm: "5400 RPM CMR", cache: "64MB", readSpeed: "180 MB/s", tbw: "180 TB/year", vibration: "RV Sensors", warranty: "3 years" },
    },
    {
      name: "Western Digital My Passport 2TB Portable",
      slug: "wd-my-passport-2tb-portable",
      description: "2TB portable hard drive with USB 3.0 and hardware encryption. Take your data everywhere in the UAE with password protection built in.",
      price: 299, comparePrice: 399,
      brandId: brandMap["Western Digital"], categoryId: catMap["storage"],
      sku: "WD-PASSPORT-2TB-USB3", stock: 70, isFeatured: false,
      images: [IMG.portable_hdd],
      specs: { capacity: "2TB", type: "2.5\" Portable HDD", interface: "USB 3.0 (USB-A + USB-C cable)", speed: "Up to 130 MB/s", encryption: "256-bit AES hardware", compatibility: "Windows, Mac, Linux", weight: "130g" },
    },
    {
      name: "Samsung T7 Shield 1TB Portable SSD",
      slug: "samsung-t7-shield-1tb-ssd",
      description: "Rugged, fast USB 3.2 Gen2 portable SSD with IP65 rating. Up to 1050 MB/s transfer speeds for UAE professionals who work on the go.",
      price: 349, comparePrice: 449,
      brandId: brandMap["Samsung"], categoryId: catMap["storage"],
      sku: "SAMSUNG-T7-SHIELD-1TB", stock: 50, isFeatured: true,
      images: [IMG.portable_ssd],
      specs: { capacity: "1TB", type: "Portable SSD", interface: "USB 3.2 Gen2 (USB-C)", readSpeed: "1050 MB/s", writeSpeed: "1000 MB/s", protection: "IP65 Drop-resistant (3m)", encryption: "256-bit AES", weight: "98g" },
    },
    {
      name: "Seagate Backup Plus Hub 8TB Desktop",
      slug: "seagate-backup-plus-hub-8tb",
      description: "8TB desktop external drive with built-in 2-port USB hub. Generous backup capacity for UAE home users and small businesses.",
      price: 649, comparePrice: 799,
      brandId: brandMap["Seagate"], categoryId: catMap["storage"],
      sku: "SEAGATE-BPH-8TB-USB3", stock: 30, isFeatured: false,
      images: [IMG.hdd],
      specs: { capacity: "8TB", type: "Desktop HDD", interface: "USB 3.0", builtInHub: "2x USB 3.0 ports", compatibility: "Windows, Mac", includes: "AC Adapter", warranty: "2 years" },
    },

    // ── PERIPHERALS ──────────────────────────────────────────────────
    {
      name: "Logitech MX Keys S Wireless Keyboard",
      slug: "logitech-mx-keys-s-wireless",
      description: "Premium wireless keyboard with smart illumination and cross-device typing. Connects to 3 devices via Bluetooth or USB receiver for UAE multi-device users.",
      price: 499, comparePrice: 599,
      brandId: brandMap["Logitech"], categoryId: catMap["peripherals"],
      sku: "LOGI-MXKEYS-S-WIRELESS", stock: 60, isFeatured: true,
      images: [IMG.keyboard],
      specs: { connectivity: "Bluetooth 5.0 / USB Receiver", multiDevice: "Up to 3 devices", backlighting: "Smart per-key backlighting", battery: "Up to 10 days (with backlight)", compatibility: "Windows, Mac, Linux, iOS, Android", layout: "Full-size with numpad" },
    },
    {
      name: "Logitech MX Master 3S Wireless Mouse",
      slug: "logitech-mx-master-3s-wireless",
      description: "Ultra-precise wireless mouse with 8000 DPI sensor and near-silent clicks. MagSpeed scroll wheel and cross-device control for UAE power users.",
      price: 349, comparePrice: 449,
      brandId: brandMap["Logitech"], categoryId: catMap["peripherals"],
      sku: "LOGI-MXMASTER3S-WIRELESS", stock: 75, isFeatured: true,
      images: [IMG.mouse],
      specs: { connectivity: "Bluetooth 5.0 / USB Receiver", dpi: "200–8000 DPI", buttons: "7 programmable buttons", scroll: "MagSpeed Electromagnetic (near-silent)", battery: "Up to 70 days", multiDevice: "Up to 3 devices", compatibility: "Windows, Mac, Linux" },
    },
    {
      name: "Dell WB7022 4K Auto-focus Webcam",
      slug: "dell-wb7022-4k-webcam",
      description: "Professional 4K webcam with AI auto-framing and noise-cancelling microphones. Perfect for video calls and remote work across UAE enterprises.",
      price: 699, comparePrice: 899,
      brandId: brandMap["Dell"], categoryId: catMap["peripherals"],
      sku: "DELL-WB7022-4K-AI", stock: 40, isFeatured: false,
      images: [IMG.webcam],
      specs: { resolution: "4K (3840x2160) @ 30fps / 1080p @ 60fps", fov: "90° wide-angle", autoFocus: "AI-powered auto-framing", microphone: "4-mic array with noise cancellation", connection: "USB-A / USB-C", compatibility: "Windows, macOS, Zoom, Teams, Meet" },
    },
    {
      name: "Jabra Evolve2 75 Wireless Headset",
      slug: "jabra-evolve2-75-wireless",
      description: "Professional dual-speaker headset with 28 hours battery and active noise cancellation. Certified for Microsoft Teams and Zoom for UAE remote workers.",
      price: 1299, comparePrice: 1599,
      brandId: brandMap["Logitech"], categoryId: catMap["peripherals"],
      sku: "JABRA-EV2-75-MS-TEAMS", stock: 25, isFeatured: false,
      images: [IMG.headset],
      specs: { connectivity: "Bluetooth 5.0 + USB Dongle", anc: "Advanced ANC with 8 microphones", battery: "Up to 28 hours with ANC", charging: "USB-C, wireless Qi charging pad", certification: "Microsoft Teams Certified, Zoom Certified", weight: "339g" },
    },

    // ── PRINTERS ─────────────────────────────────────────────────────
    {
      name: "HP LaserJet Pro M404dn",
      slug: "hp-laserjet-pro-m404dn",
      description: "Fast monochrome laser printer with automatic duplex and Gigabit Ethernet. Designed for high-volume UAE office printing with low cost per page.",
      price: 899, comparePrice: 1199,
      brandId: brandMap["HP"], categoryId: catMap["printers"],
      sku: "HP-LJP-M404DN-MONO", stock: 30, isFeatured: true,
      images: [IMG.printer_laser],
      specs: { type: "Monochrome Laser", speed: "38 ppm", resolution: "1200x1200 dpi", duplex: "Automatic two-sided", connectivity: "Gigabit Ethernet, USB 2.0", paperCapacity: "250-sheet input", monthly: "Up to 80,000 pages", os: "Windows, Mac, Linux" },
    },
    {
      name: "Canon PIXMA G3770 MegaTank MFP",
      slug: "canon-pixma-g3770-megatank",
      description: "Colour inkjet MFP with refillable ink tanks — print thousands of pages at ultra-low cost. Perfect for UAE homes and small businesses with high colour volume.",
      price: 649, comparePrice: 799,
      brandId: brandMap["Canon"], categoryId: catMap["printers"],
      sku: "CANON-G3770-MEGATANK", stock: 45, isFeatured: false,
      images: [IMG.printer_inkjet],
      specs: { type: "Colour Inkjet MFP (Print, Scan, Copy)", speed: "11 ipm colour / 13 ipm mono", resolution: "4800x1200 dpi", inkSystem: "Refillable MegaTank", yield: "7700 colour / 6000 mono pages per fill", connectivity: "WiFi, USB", scanning: "Flatbed 600x1200 dpi" },
    },
    {
      name: "Epson EcoTank L3250 WiFi MFP",
      slug: "epson-ecotank-l3250-wifi",
      description: "Refillable inkjet MFP with mobile printing and wireless connectivity. Lowest cost-per-print for UAE home users who print frequently.",
      price: 549, comparePrice: 699,
      brandId: brandMap["Epson"], categoryId: catMap["printers"],
      sku: "EPSON-L3250-ECOTANK-WIFI", stock: 55, isFeatured: false,
      images: [IMG.printer_inkjet],
      specs: { type: "Colour Inkjet MFP (Print, Scan, Copy)", speed: "10 ipm colour / 15 ipm mono", resolution: "5760x1440 dpi", inkSystem: "EcoTank Refillable", yield: "Up to 4500 colour / 7500 mono pages", connectivity: "WiFi, USB, WiFi Direct" },
    },

    // ── TABLETS ──────────────────────────────────────────────────────
    {
      name: "Microsoft Surface Pro 11 (Snapdragon X Plus)",
      slug: "microsoft-surface-pro-11-snapdragon",
      description: "Copilot+ 2-in-1 with Snapdragon X Plus and PixelSense Flow display. A versatile tablet and laptop in one slim device, perfect for UAE mobile professionals.",
      price: 3959, comparePrice: 4659,
      brandId: brandMap["Microsoft"], categoryId: catMap["tablets"],
      sku: "MS-SP11-SXP-16-512", stock: 22, isFeatured: true,
      images: [IMG.tablet_surface],
      specs: { processor: "Snapdragon X Plus X1P-64-100", ram: "16GB", storage: "512GB SSD", display: '13" PixelSense Flow 2880x1920 120Hz', camera: "10MP rear, 5MP front", battery: "Up to 14 hours", connectivity: "WiFi 7, Bluetooth 5.4, USB-C (USB4)", os: "Windows 11 Home" },
    },
    {
      name: "Microsoft Surface Pro 11 (Intel Core Ultra 7)",
      slug: "microsoft-surface-pro-11-intel",
      description: "High-performance 2-in-1 with Intel Core Ultra 7 and 3K 120Hz display. Unparalleled versatility for UAE creatives who need full Windows and touch in one device.",
      price: 6789, comparePrice: 7689,
      brandId: brandMap["Microsoft"], categoryId: catMap["tablets"],
      sku: "MS-SP11-CU7-16-256", stock: 15, isFeatured: false,
      images: [IMG.tablet_surface],
      specs: { processor: "Intel Core Ultra 7 268V", ram: "16GB LPDDR5x", storage: "256GB SSD", display: '13" PixelSense Flow 2880x1920 120Hz', camera: "10MP rear, 5MP front", battery: "Up to 12 hours", connectivity: "Thunderbolt 4, WiFi 6E, Bluetooth 5.3", os: "Windows 11 Home" },
    },
    {
      name: "Samsung Galaxy Tab S9 FE 10.9\"",
      slug: "samsung-galaxy-tab-s9-fe",
      description: "Feature-packed Android tablet with S Pen included and IP68 water resistance. Ideal for UAE students and creatives who want an affordable Samsung flagship experience.",
      price: 1299, comparePrice: 1599,
      brandId: brandMap["Samsung"], categoryId: catMap["tablets"],
      sku: "SAMSUNG-TABS9FE-6-128", stock: 40, isFeatured: false,
      images: [IMG.tablet_android],
      specs: { processor: "Samsung Exynos 1380", ram: "6GB", storage: "128GB (expandable)", display: '10.9" TFT 2304x1440 90Hz', battery: "8000 mAh, 45W fast charge", camera: "8MP rear, 10MP front", stylus: "S Pen included", protection: "IP68 water resistance" },
    },
  ]

  for (const product of products) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: { stock: product.stock, price: product.price, images: product.images },
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
  .finally(async () => { await db.$disconnect() })
