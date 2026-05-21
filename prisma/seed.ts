import "dotenv/config"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`
const IMG = {
  laptop_business:  U("1496181133206-80ce9b88a853"),
  laptop_business2: U("1541807084-5c52b6b3adef"),
  laptop_thin:      U("1525547719571-a2d4ac8945e2"),
  laptop_surface:   U("1611186871525-9a13a3ded0a0"),
  laptop_hp:        U("1593642702821-c8da6771f0c6"),
  laptop_gaming:    U("1603302576837-37561b2e2302"),
  laptop_gaming2:   U("1593642632559-0c6d3fc62b89"),
  laptop_gaming3:   U("1593642634315-48f5414c3ad9"),
  macbook_air:      U("1496181133206-80ce9b88a853"),
  macbook_pro:      U("1541807084-5c52b6b3adef"),
  desktop_pc:       U("1587202372583-49330a15584d"),
  mini_pc:          U("1591799264318-7e6ef8ddb7ea"),
  monitor:          U("1527443224154-c4a573d3f8e1"),
  monitor_gaming:   U("1616449961837-b18a98e11e84"),
  monitor_4k:       U("1587202372583-49330a15584d"),
  monitor_wide:     U("1527443224154-c4a573d3f8e1"),
  gpu:              U("1591489378430-ef2f4c626b6f"),
  cpu:              U("1591799264318-7e6ef8ddb7ea"),
  ram:              U("1541185934-01b600ea069c"),
  ssd:              U("1531492746076-161ca9bcad58"),
  psu:              U("1602080858428-57174f9431cf"),
  motherboard:      U("1591799264318-7e6ef8ddb7ea"),
  pc_case:          U("1591489378430-ef2f4c626b6f"),
  router:           U("1606904825846-647eb07f5be2"),
  switch_net:       U("1558494949-ef010cbdcc31"),
  ap:               U("1544197150-b99a580bb7a8"),
  hdd:              U("1531492746076-161ca9bcad58"),
  portable_hdd:     U("1531492746076-161ca9bcad58"),
  portable_ssd:     U("1531492746076-161ca9bcad58"),
  usb_drive:        U("1531492746076-161ca9bcad58"),
  keyboard:         U("1587829741301-dc798b83add3"),
  keyboard_gaming:  U("1587829741301-dc798b83add3"),
  mouse:            U("1527864550417-7fd91fc51a46"),
  mouse_gaming:     U("1527864550417-7fd91fc51a46"),
  webcam:           U("1616587226960-4a03badbe8bf"),
  headset:          U("1505740420928-5e560c06d30e"),
  microphone:       U("1505740420928-5e560c06d30e"),
  printer_laser:    U("1612815091029-d7ffdcf2a9f8"),
  printer_inkjet:   U("1585771724684-38269d6639fd"),
  tablet_surface:   U("1561154464-82e9adf32764"),
  tablet_android:   U("1544244015-0df4b3ffc6b0"),
  tablet_ipad:      U("1561154464-82e9adf32764"),
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
  const brandNames = [
    "Apple", "Acer", "ASUS", "Dell", "HP", "Lenovo", "Microsoft", "MSI", "Samsung",
    "TP-Link", "Seagate", "Western Digital", "Logitech", "Canon", "LG", "Intel",
    "Corsair", "Ubiquiti", "Epson", "Razer", "Kingston", "Gigabyte", "ViewSonic",
    "BenQ", "Brother", "D-Link", "Netgear", "SteelSeries", "HyperX", "Cooler Master",
    "Philips", "Belkin", "Anker", "AMD", "Crucial",
  ]
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

    // ── MORE LAPTOPS ─────────────────────────────────────────────────
    { name: "Dell Latitude 5540 15\" Business", slug: "dell-latitude-5540-15", description: "Reliable business laptop with Intel Core i5, 16GB RAM and 512GB SSD. Dell's mid-range workhorse for UAE enterprise deployments.", price: 3199, comparePrice: 3799, brandId: brandMap["Dell"], categoryId: catMap["laptops"], sku: "DELL-LAT5540-I5-16-512", stock: 28, isFeatured: false, images: [IMG.laptop_business], specs: { processor: "Intel Core i5-1335U", ram: "16GB DDR4", storage: "512GB SSD", display: '15.6" FHD IPS 1920x1080', graphics: "Intel Iris Xe", battery: "Up to 12 hours", weight: "1.78 kg", os: "Windows 11 Pro" } },
    { name: "Dell XPS 13 9340", slug: "dell-xps-13-9340", description: "Premium ultrabook with Intel Core Ultra 7 in a stunning InfinityEdge display design. The benchmark for premium Windows ultrabooks in the UAE.", price: 6299, comparePrice: 7199, brandId: brandMap["Dell"], categoryId: catMap["laptops"], sku: "DELL-XPS13-CU7-16-512", stock: 18, isFeatured: true, images: [IMG.laptop_thin], specs: { processor: "Intel Core Ultra 7 155H", ram: "16GB LPDDR5x", storage: "512GB SSD", display: '13.4" FHD+ IPS 1920x1200', graphics: "Intel Arc", battery: "Up to 12 hours", weight: "1.17 kg", os: "Windows 11 Home" } },
    { name: "Lenovo ThinkPad X1 Carbon Gen 12", slug: "lenovo-thinkpad-x1-carbon-gen12", description: "Ultra-lightweight business flagship with Intel Core Ultra 7, MIL-SPEC tested. The ultimate travel laptop for UAE executives.", price: 8499, comparePrice: 9499, brandId: brandMap["Lenovo"], categoryId: catMap["laptops"], sku: "LNV-X1C12-CU7-32-1TB", stock: 14, isFeatured: true, images: [IMG.laptop_thin], specs: { processor: "Intel Core Ultra 7 165U", ram: "32GB LPDDR5", storage: "1TB SSD", display: '14" WUXGA IPS 1920x1200', graphics: "Intel Graphics", battery: "Up to 15 hours", weight: "1.12 kg", os: "Windows 11 Pro" } },
    { name: "Lenovo IdeaPad Slim 5 14\" AMD", slug: "lenovo-ideapad-slim5-14-amd", description: "Slim everyday laptop with AMD Ryzen 7, 16GB RAM and OLED display. Outstanding colour and performance for UAE home users at a great price.", price: 2799, comparePrice: 3299, brandId: brandMap["Lenovo"], categoryId: catMap["laptops"], sku: "LNV-IPS5-R7-16-512", stock: 45, isFeatured: false, images: [IMG.laptop_business], specs: { processor: "AMD Ryzen 7 7730U", ram: "16GB DDR4", storage: "512GB SSD", display: '14" 2.8K OLED 2880x1800 90Hz', graphics: "AMD Radeon 610M", battery: "Up to 12 hours", weight: "1.46 kg", os: "Windows 11 Home" } },
    { name: "ASUS VivoBook 16 Intel Core i7", slug: "asus-vivobook-16-i7", description: "16-inch everyday performer with Intel Core i7, 16GB RAM and OLED display. Great value for UAE students and professionals.", price: 2499, comparePrice: 2999, brandId: brandMap["ASUS"], categoryId: catMap["laptops"], sku: "ASUS-VB16-I7-16-512", stock: 55, isFeatured: false, images: [IMG.laptop_business2], specs: { processor: "Intel Core i7-12700H", ram: "16GB DDR4", storage: "512GB SSD", display: '16" FHD+ IPS 1920x1200', graphics: "NVIDIA GeForce MX550", battery: "Up to 10 hours", weight: "1.88 kg", os: "Windows 11 Home" } },
    { name: "ASUS ZenBook 14 OLED UX3405", slug: "asus-zenbook-14-oled-ux3405", description: "Ultra-premium thin laptop with Intel Core Ultra 9 and stunning 3K OLED display. Designed for creators and professionals who demand the best.", price: 5699, comparePrice: 6499, brandId: brandMap["ASUS"], categoryId: catMap["laptops"], sku: "ASUS-ZB14-CU9-32-1TB", stock: 16, isFeatured: true, images: [IMG.laptop_thin], specs: { processor: "Intel Core Ultra 9 185H", ram: "32GB LPDDR5", storage: "1TB SSD", display: '14" 3K OLED 2880x1800 120Hz', graphics: "NVIDIA GeForce RTX 3050", battery: "Up to 15 hours", weight: "1.2 kg", os: "Windows 11 Home" } },
    { name: "HP Spectre x360 14 2-in-1", slug: "hp-spectre-x360-14-2in1", description: "Luxury 2-in-1 convertible with Intel Core Ultra 7 and OLED touchscreen. The most elegant laptop-tablet hybrid available in the UAE.", price: 6899, comparePrice: 7799, brandId: brandMap["HP"], categoryId: catMap["laptops"], sku: "HP-SPX360-CU7-16-1TB", stock: 12, isFeatured: true, images: [IMG.laptop_hp], specs: { processor: "Intel Core Ultra 7 155H", ram: "16GB LPDDR5", storage: "1TB SSD", display: '14" 3K OLED Touch 2880x1800', graphics: "Intel Arc", battery: "Up to 17 hours", weight: "1.36 kg", os: "Windows 11 Home" } },
    { name: "MSI Modern 15 B12M", slug: "msi-modern-15-b12m", description: "Slim business laptop with Intel Core i7, 16GB RAM and 512GB SSD. MSI's professional ultrabook for UAE corporate users on a budget.", price: 2599, comparePrice: 3099, brandId: brandMap["MSI"], categoryId: catMap["laptops"], sku: "MSI-MOD15-I7-16-512", stock: 30, isFeatured: false, images: [IMG.laptop_thin], specs: { processor: "Intel Core i7-1255U", ram: "16GB DDR4", storage: "512GB SSD", display: '15.6" FHD IPS 1920x1080', graphics: "Intel Iris Xe", battery: "Up to 10 hours", weight: "1.6 kg", os: "Windows 11 Pro" } },
    { name: "Lenovo ThinkPad E14 Gen 5 AMD", slug: "lenovo-thinkpad-e14-gen5-amd", description: "Reliable mid-range business laptop with AMD Ryzen 7, 16GB RAM. Entry-level ThinkPad for UAE SMBs needing durability without the premium price.", price: 2699, comparePrice: 3199, brandId: brandMap["Lenovo"], categoryId: catMap["laptops"], sku: "LNV-E14G5-R7-16-512", stock: 35, isFeatured: false, images: [IMG.laptop_business], specs: { processor: "AMD Ryzen 7 7730U", ram: "16GB DDR4", storage: "512GB SSD", display: '14" WUXGA IPS 1920x1200', graphics: "AMD Radeon 610M", battery: "Up to 10 hours", weight: "1.56 kg", os: "Windows 11 Pro" } },
    { name: "Samsung Galaxy Book4 Pro 16\"", slug: "samsung-galaxy-book4-pro-16", description: "Premium Samsung laptop with Intel Core Ultra 7 and AMOLED display. Seamlessly integrates with Galaxy ecosystem for UAE Samsung users.", price: 6199, comparePrice: 7099, brandId: brandMap["Samsung"], categoryId: catMap["laptops"], sku: "SAMSUNG-GB4P-CU7-16-1TB", stock: 20, isFeatured: false, images: [IMG.laptop_thin], specs: { processor: "Intel Core Ultra 7 155H", ram: "16GB LPDDR5", storage: "1TB SSD", display: '16" 3K AMOLED 2880x1800 120Hz', graphics: "NVIDIA GeForce RTX 4070", battery: "Up to 22 hours", weight: "1.55 kg", os: "Windows 11 Home" } },

    // ── MORE GAMING LAPTOPS ──────────────────────────────────────────
    { name: "MSI Titan GT77 HX 17\" RTX 4090", slug: "msi-titan-gt77-rtx4090", description: "The world's most powerful gaming laptop with Intel Core i9 and RTX 4090. No compromise desktop-replacement gaming at 4K in the UAE.", price: 14999, comparePrice: 16499, brandId: brandMap["MSI"], categoryId: catMap["gaming"], sku: "MSI-GT77-I9-64-4090", stock: 5, isFeatured: true, images: [IMG.laptop_gaming3], specs: { processor: "Intel Core i9-13980HX", ram: "64GB DDR5", storage: "2TB SSD", display: '17.3" UHD IPS 3840x2160 144Hz', graphics: "NVIDIA GeForce RTX 4090 16GB", battery: "Up to 2 hours gaming", weight: "3.3 kg", os: "Windows 11 Home" } },
    { name: "Razer Blade 16 RTX 4080", slug: "razer-blade-16-rtx4080", description: "Ultra-premium gaming laptop with RTX 4080 in a sleek CNC aluminium chassis. The most powerful thin gaming laptop available in the UAE.", price: 12999, comparePrice: 14499, brandId: brandMap["Razer"], categoryId: catMap["gaming"], sku: "RAZER-B16-I9-32-4080", stock: 7, isFeatured: true, images: [IMG.laptop_gaming2], specs: { processor: "Intel Core i9-14900HX", ram: "32GB DDR5", storage: "1TB SSD", display: '16" QHD+ OLED 2560x1600 240Hz', graphics: "NVIDIA GeForce RTX 4080 12GB", battery: "Up to 4 hours", weight: "2.14 kg", os: "Windows 11 Home" } },
    { name: "Dell Alienware m18 R2", slug: "dell-alienware-m18-r2", description: "18-inch gaming powerhouse with Intel Core i9 and RTX 4090. Alienware's most extreme desktop replacement for UAE gaming enthusiasts.", price: 13499, comparePrice: 14999, brandId: brandMap["Dell"], categoryId: catMap["gaming"], sku: "DELL-AWM18-I9-32-4090", stock: 6, isFeatured: false, images: [IMG.laptop_gaming3], specs: { processor: "Intel Core i9-14900HX", ram: "32GB DDR5", storage: "2TB SSD", display: '18" QHD+ IPS 2560x1600 165Hz', graphics: "NVIDIA GeForce RTX 4090 16GB", battery: "Up to 3 hours gaming", weight: "4.2 kg", os: "Windows 11 Home" } },
    { name: "ASUS TUF Gaming A15 FA507 AMD", slug: "asus-tuf-gaming-a15-fa507", description: "Budget gaming laptop with AMD Ryzen 9 and RTX 4070. Military-grade durability meets genuine gaming power — best value for UAE gamers.", price: 4299, comparePrice: 4999, brandId: brandMap["ASUS"], categoryId: catMap["gaming"], sku: "ASUS-TUF-A15-R9-16-4070", stock: 30, isFeatured: false, images: [IMG.laptop_gaming], specs: { processor: "AMD Ryzen 9 7940HS", ram: "16GB DDR5", storage: "512GB SSD", display: '15.6" FHD IPS 1920x1080 144Hz', graphics: "NVIDIA GeForce RTX 4070 8GB", battery: "Up to 7 hours", weight: "2.2 kg", os: "Windows 11 Home" } },
    { name: "Lenovo Legion 5 Pro 16\" AMD", slug: "lenovo-legion-5-pro-16-amd", description: "Mid-range gaming laptop with AMD Ryzen 7 and RTX 4070 Ti in a 16-inch 165Hz display. Excellent price-performance ratio for UAE gamers.", price: 5499, comparePrice: 6199, brandId: brandMap["Lenovo"], categoryId: catMap["gaming"], sku: "LNV-L5P16-R7-16-4070TI", stock: 22, isFeatured: true, images: [IMG.laptop_gaming2], specs: { processor: "AMD Ryzen 7 7745HX", ram: "16GB DDR5", storage: "512GB SSD", display: '16" WQXGA IPS 2560x1600 165Hz', graphics: "NVIDIA GeForce RTX 4070 Ti 12GB", battery: "Up to 6 hours", weight: "2.4 kg", os: "Windows 11 Home" } },
    { name: "MSI Katana 15 B13V RTX 4060", slug: "msi-katana-15-b13v-rtx4060", description: "Mid-range gaming laptop with Intel Core i7 and RTX 4060 at an accessible price. Perfect entry point for UAE gamers upgrading from integrated graphics.", price: 3699, comparePrice: 4299, brandId: brandMap["MSI"], categoryId: catMap["gaming"], sku: "MSI-KAT15-I7-16-4060", stock: 28, isFeatured: false, images: [IMG.laptop_gaming], specs: { processor: "Intel Core i7-13620H", ram: "16GB DDR5", storage: "512GB SSD", display: '15.6" FHD IPS 1920x1080 144Hz', graphics: "NVIDIA GeForce RTX 4060 8GB", battery: "Up to 7 hours", weight: "2.25 kg", os: "Windows 11 Home" } },
    { name: "HP Victus 16 AMD Ryzen 5", slug: "hp-victus-16-ryzen5", description: "Budget gaming laptop with AMD Ryzen 5 and RX 7600M XT. The most affordable way to get real gaming performance in the UAE.", price: 2699, comparePrice: 3299, brandId: brandMap["HP"], categoryId: catMap["gaming"], sku: "HP-VICTUS16-R5-8-RX7600", stock: 40, isFeatured: false, images: [IMG.laptop_gaming3], specs: { processor: "AMD Ryzen 5 7535HS", ram: "8GB DDR5", storage: "512GB SSD", display: '16.1" FHD IPS 1920x1080 144Hz', graphics: "AMD Radeon RX 7600M XT 8GB", battery: "Up to 8 hours", weight: "2.29 kg", os: "Windows 11 Home" } },
    { name: "ASUS ROG Flow X13 2-in-1 Gaming", slug: "asus-rog-flow-x13-2in1", description: "Compact 13-inch gaming 2-in-1 with AMD Ryzen 9 and RTX 4070. The most portable serious gaming laptop for UAE gamers who travel.", price: 7299, comparePrice: 8199, brandId: brandMap["ASUS"], categoryId: catMap["gaming"], sku: "ASUS-FLOW-X13-R9-32-4070", stock: 10, isFeatured: false, images: [IMG.laptop_gaming2], specs: { processor: "AMD Ryzen 9 7940HS", ram: "32GB LPDDR5", storage: "1TB SSD", display: '13.4" QHD+ IPS 2560x1600 165Hz Touch', graphics: "NVIDIA GeForce RTX 4070 8GB", battery: "Up to 10 hours", weight: "1.3 kg", os: "Windows 11 Home" } },

    // ── DESKTOPS ─────────────────────────────────────────────────────
    { name: "Dell OptiPlex 5000 SFF Desktop", slug: "dell-optiplex-5000-sff", description: "Compact small-form-factor business desktop with Intel Core i5, 16GB RAM and 512GB SSD. Perfect for UAE office deployments needing minimal desk footprint.", price: 2299, comparePrice: 2899, brandId: brandMap["Dell"], categoryId: catMap["desktops"], sku: "DELL-OPT5000-I5-16-512", stock: 40, isFeatured: false, images: [IMG.desktop_pc], specs: { processor: "Intel Core i5-12500", ram: "16GB DDR4", storage: "512GB SSD", graphics: "Intel UHD 770", formFactor: "Small Form Factor", ports: "USB-C, 4x USB-A, HDMI, DP", opticalDrive: "None", os: "Windows 11 Pro" } },
    { name: "HP ProDesk 400 G9 Mini Desktop", slug: "hp-prodesk-400-g9-mini", description: "Ultra-compact business mini PC with Intel Core i5 and enterprise management tools. Ideal for hot-desking UAE corporate environments.", price: 1999, comparePrice: 2499, brandId: brandMap["HP"], categoryId: catMap["desktops"], sku: "HP-PD400G9-I5-8-256", stock: 35, isFeatured: false, images: [IMG.mini_pc], specs: { processor: "Intel Core i5-12500T", ram: "8GB DDR4", storage: "256GB SSD", graphics: "Intel UHD 770", formFactor: "Mini PC", ports: "USB-C, 4x USB-A, DisplayPort, VGA", management: "HP Manageability Integration Kit", os: "Windows 11 Pro" } },
    { name: "Lenovo ThinkCentre M70q Gen 4 Tiny", slug: "lenovo-thinkcentre-m70q-gen4", description: "Tiny but powerful business PC with Intel Core i7, 16GB RAM. A full Windows 11 Pro desktop in a palm-sized form factor for UAE offices.", price: 2499, comparePrice: 2999, brandId: brandMap["Lenovo"], categoryId: catMap["desktops"], sku: "LNV-M70Q4-I7-16-512", stock: 30, isFeatured: false, images: [IMG.mini_pc], specs: { processor: "Intel Core i7-13700T", ram: "16GB DDR4", storage: "512GB SSD", graphics: "Intel UHD 770", formFactor: "Tiny (1L)", ports: "2x USB-C, 4x USB-A, HDMI, DP", management: "Lenovo ThinkShield", os: "Windows 11 Pro" } },
    { name: "Apple Mac Mini M4", slug: "apple-mac-mini-m4", description: "The most powerful Mac mini ever with M4 chip in a compact aluminium design. Ideal for UAE creatives, developers and home studio setups.", price: 2999, comparePrice: 3499, brandId: brandMap["Apple"], categoryId: catMap["desktops"], sku: "APPLE-MACMINI-M4-16-256", stock: 25, isFeatured: true, images: [IMG.mini_pc], specs: { processor: "Apple M4 (10-core CPU)", ram: "16GB Unified Memory", storage: "256GB SSD", graphics: "10-core GPU", ports: "3x USB-C (Thunderbolt 4), 2x USB-A, HDMI, Ethernet", dimensions: "12.7 x 12.7 x 3.5 cm", os: "macOS Sequoia" } },
    { name: "Apple iMac 24\" M4", slug: "apple-imac-24-m4", description: "Strikingly thin all-in-one with Apple M4 chip and 4.5K Retina display. The statement desktop for UAE creative professionals.", price: 8999, comparePrice: 9999, brandId: brandMap["Apple"], categoryId: catMap["desktops"], sku: "APPLE-IMAC24-M4-16-512", stock: 15, isFeatured: true, images: [IMG.monitor_4k], specs: { processor: "Apple M4 (10-core CPU)", ram: "16GB Unified Memory", storage: "512GB SSD", display: '24" 4.5K Retina 4480x2520', graphics: "10-core GPU", camera: "12MP Center Stage", os: "macOS Sequoia" } },
    { name: "Dell Inspiron 3030 Desktop Tower", slug: "dell-inspiron-3030-tower", description: "Affordable tower desktop with Intel Core i5, 8GB RAM and 512GB SSD. A reliable everyday PC for UAE home users and students.", price: 1799, comparePrice: 2299, brandId: brandMap["Dell"], categoryId: catMap["desktops"], sku: "DELL-INS3030-I5-8-512", stock: 50, isFeatured: false, images: [IMG.desktop_pc], specs: { processor: "Intel Core i5-13400", ram: "8GB DDR4", storage: "512GB SSD", graphics: "Intel UHD 730", formFactor: "Tower", ports: "USB-C, 4x USB-A, HDMI, DisplayPort", os: "Windows 11 Home" } },
    { name: "HP Pavilion Desktop TP01 AMD", slug: "hp-pavilion-desktop-tp01-amd", description: "Stylish consumer desktop with AMD Ryzen 5, 16GB RAM and 1TB HDD + 256GB SSD combo. Great home PC for UAE families.", price: 1999, comparePrice: 2499, brandId: brandMap["HP"], categoryId: catMap["desktops"], sku: "HP-PAV-TP01-R5-16-256S1T", stock: 40, isFeatured: false, images: [IMG.desktop_pc], specs: { processor: "AMD Ryzen 5 5600G", ram: "16GB DDR4", storage: "256GB SSD + 1TB HDD", graphics: "AMD Radeon Vega 7", formFactor: "Tower", ports: "USB-C, 5x USB-A, HDMI, DP, SD Card", os: "Windows 11 Home" } },
    { name: "MSI Trident X2 Plus Gaming PC", slug: "msi-trident-x2-plus-gaming", description: "Compact gaming desktop with Intel Core i9 and RTX 4080 Super. MSI's best balance of gaming power and small-footprint design for UAE gamers.", price: 9999, comparePrice: 11499, brandId: brandMap["MSI"], categoryId: catMap["desktops"], sku: "MSI-TRDX2P-I9-32-4080S", stock: 8, isFeatured: true, images: [IMG.pc_case], specs: { processor: "Intel Core i9-14900KF", ram: "32GB DDR5", storage: "1TB NVMe SSD", graphics: "NVIDIA GeForce RTX 4080 Super 16GB", formFactor: "Compact Tower (10L)", cooling: "Liquid cooling", os: "Windows 11 Home" } },
    { name: "Lenovo IdeaCentre Gaming 5i Gen 8", slug: "lenovo-ideacentre-gaming-5i-gen8", description: "Mid-range gaming tower with Intel Core i7 and RTX 4060 Ti. Lenovo's accessible gaming desktop for UAE families getting into PC gaming.", price: 5299, comparePrice: 6299, brandId: brandMap["Lenovo"], categoryId: catMap["desktops"], sku: "LNV-ICG5I-I7-16-4060TI", stock: 18, isFeatured: false, images: [IMG.desktop_pc], specs: { processor: "Intel Core i7-13700F", ram: "16GB DDR5", storage: "512GB SSD", graphics: "NVIDIA GeForce RTX 4060 Ti 8GB", formFactor: "Tower", cooling: "Air cooled", os: "Windows 11 Home" } },
    { name: "HP ENVY TE02 Tower Desktop", slug: "hp-envy-te02-tower", description: "Premium consumer tower with Intel Core i7 and NVIDIA RTX 3060. HP's home powerhouse for UAE content creators and gamers.", price: 3799, comparePrice: 4499, brandId: brandMap["HP"], categoryId: catMap["desktops"], sku: "HP-ENVY-TE02-I7-16-3060", stock: 22, isFeatured: false, images: [IMG.desktop_pc], specs: { processor: "Intel Core i7-13700", ram: "16GB DDR4", storage: "1TB SSD", graphics: "NVIDIA GeForce RTX 3060 12GB", formFactor: "Tower", ports: "USB-C (front), 6x USB-A, HDMI, DP", os: "Windows 11 Home" } },
    { name: "Custom Gaming PC — Intel i9 + RTX 4090", slug: "custom-pc-i9-rtx4090", description: "Top-tier custom-built gaming PC with Intel Core i9-14900K, 64GB DDR5 and RTX 4090. The absolute pinnacle of PC gaming performance available in the UAE.", price: 17999, comparePrice: 19999, brandId: brandMap["Intel"], categoryId: catMap["desktops"], sku: "CUSTOM-I9-64-4090-2TB", stock: 5, isFeatured: true, images: [IMG.gpu], specs: { processor: "Intel Core i9-14900K", ram: "64GB DDR5 6000MHz", storage: "2TB NVMe Gen5 SSD", graphics: "NVIDIA GeForce RTX 4090 24GB", motherboard: "ASUS ROG MAXIMUS Z790 HERO", cooling: "360mm AIO Liquid", psu: "1000W 80+ Platinum", os: "Windows 11 Pro" } },
    { name: "Custom PC — AMD Ryzen 9 + RX 7900 XTX", slug: "custom-pc-amd-r9-rx7900xtx", description: "High-performance AMD custom build with Ryzen 9 7950X and RX 7900 XTX. Exceptional 4K gaming and creative workstation power for UAE enthusiasts.", price: 14999, comparePrice: 16999, brandId: brandMap["AMD"], categoryId: catMap["desktops"], sku: "CUSTOM-R9-64-RX7900XTX-2TB", stock: 6, isFeatured: false, images: [IMG.gpu], specs: { processor: "AMD Ryzen 9 7950X", ram: "64GB DDR5 6000MHz", storage: "2TB NVMe Gen5 SSD", graphics: "AMD Radeon RX 7900 XTX 24GB", motherboard: "ASUS ROG CROSSHAIR X670E", cooling: "360mm AIO Liquid", psu: "850W 80+ Gold", os: "Windows 11 Pro" } },
    { name: "Acer Veriton N4690GT Mini PC", slug: "acer-veriton-n4690gt-mini", description: "Business mini PC with Intel Core i5, 8GB RAM and 256GB SSD. Acer's reliable compact desktop for UAE SMB deployments.", price: 1699, comparePrice: 2099, brandId: brandMap["Acer"], categoryId: catMap["desktops"], sku: "ACER-VN4690-I5-8-256", stock: 30, isFeatured: false, images: [IMG.mini_pc], specs: { processor: "Intel Core i5-12400T", ram: "8GB DDR4", storage: "256GB SSD", graphics: "Intel UHD 730", formFactor: "Mini PC (1L)", ports: "USB-C, 4x USB-A, HDMI, DP, RJ45", os: "Windows 11 Pro" } },
    { name: "ASUS ProArt Station PD5 Workstation", slug: "asus-proart-station-pd5-workstation", description: "Professional workstation with Intel Core i9 and NVIDIA RTX 4070 Ti. Purpose-built for UAE designers, architects and 3D professionals.", price: 11499, comparePrice: 12999, brandId: brandMap["ASUS"], categoryId: catMap["desktops"], sku: "ASUS-PA-PD5-I9-64-4070TI", stock: 8, isFeatured: false, images: [IMG.desktop_pc], specs: { processor: "Intel Core i9-13900K", ram: "64GB DDR5", storage: "2TB SSD", graphics: "NVIDIA RTX 4070 Ti 12GB", formFactor: "Tower", certifications: "ISV certified", os: "Windows 11 Pro" } },

    // ── MORE MONITORS ─────────────────────────────────────────────────
    { name: "ASUS TUF Gaming VG279QL1A 27\" FHD 165Hz", slug: "asus-tuf-gaming-vg279ql1a", description: "27-inch FHD gaming monitor with 165Hz refresh rate and 1ms MPRT. Fast, affordable gaming display for UAE gamers upgrading from a basic monitor.", price: 799, comparePrice: 999, brandId: brandMap["ASUS"], categoryId: catMap["monitors"], sku: "ASUS-VG279QL1A-27-165", stock: 55, isFeatured: false, images: [IMG.monitor_gaming], specs: { size: '27"', resolution: "1920x1080 (FHD)", panel: "IPS", refreshRate: "165Hz", responseTime: "1ms MPRT", ports: "2x HDMI 1.4, 1x DP 1.2", brightness: "400 nits", freesync: "FreeSync Premium" } },
    { name: "Samsung Odyssey G5 32\" QHD Curved", slug: "samsung-odyssey-g5-32-qhd", description: "32-inch 1000R curved QHD monitor with 165Hz and VA panel. Immersive widescreen gaming at QHD resolution for UAE gamers.", price: 1299, comparePrice: 1599, brandId: brandMap["Samsung"], categoryId: catMap["monitors"], sku: "SAMSUNG-G5-32-QHD-165", stock: 40, isFeatured: false, images: [IMG.monitor_gaming], specs: { size: '32"', resolution: "2560x1440 (QHD)", panel: "VA Curved 1000R", refreshRate: "165Hz", responseTime: "1ms MPRT", ports: "HDMI 2.0, DisplayPort 1.2", brightness: "350 nits", hdr: "HDR10" } },
    { name: "Dell U2723DE 27\" 4K USB-C Hub Monitor", slug: "dell-u2723de-27-4k-hub", description: "27-inch 4K IPS monitor with built-in USB-C hub and 90W power delivery. The perfect single-cable productivity solution for UAE laptop users.", price: 2099, comparePrice: 2599, brandId: brandMap["Dell"], categoryId: catMap["monitors"], sku: "DELL-U2723DE-4K-90W", stock: 30, isFeatured: true, images: [IMG.monitor_4k], specs: { size: '27"', resolution: "3840x2160 (4K UHD)", panel: "IPS Black", refreshRate: "60Hz", responseTime: "5ms", ports: "USB-C 90W PD, HDMI 2.0, DP 1.4, 3x USB-A", brightness: "400 nits", colorCoverage: "98% DCI-P3" } },
    { name: "BenQ PD3220U 32\" 4K Professional", slug: "benq-pd3220u-32-4k-pro", description: "32-inch 4K UHD monitor with Thunderbolt 3 and factory-calibrated colour. BenQ's top professional display for UAE creative studios.", price: 3999, comparePrice: 4799, brandId: brandMap["BenQ"], categoryId: catMap["monitors"], sku: "BENQ-PD3220U-4K-TB3", stock: 15, isFeatured: false, images: [IMG.monitor_4k], specs: { size: '32"', resolution: "3840x2160 (4K UHD)", panel: "IPS", refreshRate: "60Hz", responseTime: "5ms", ports: "Thunderbolt 3, USB-C, 2x HDMI 2.0, DP 1.4, 4x USB-A", brightness: "350 nits", colorCoverage: "95% DCI-P3" } },
    { name: "ViewSonic VX3418-2KPC 34\" Ultrawide", slug: "viewsonic-vx3418-2kpc-34-ultrawide", description: "34-inch UWQHD curved ultrawide with 144Hz and 1ms. Immersive productivity and gaming on one expansive screen for UAE power users.", price: 1799, comparePrice: 2199, brandId: brandMap["ViewSonic"], categoryId: catMap["monitors"], sku: "VS-VX3418-34-UW-144", stock: 25, isFeatured: true, images: [IMG.monitor_wide], specs: { size: '34"', resolution: "3440x1440 (UWQHD)", panel: "MVA Curved 1800R", refreshRate: "144Hz", responseTime: "1ms MPRT", ports: "2x HDMI 2.0, 1x DP 1.4, USB Hub", brightness: "300 nits", hdr: "HDR10" } },
    { name: "LG 34WN80C-B 34\" IPS Ultrawide", slug: "lg-34wn80c-b-34-ultrawide", description: "34-inch UWQHD IPS Nano curved display with USB-C 60W PD and sRGB 99%. Elegant productivity ultrawide for UAE professionals.", price: 2199, comparePrice: 2699, brandId: brandMap["LG"], categoryId: catMap["monitors"], sku: "LG-34WN80C-34-UW-60W", stock: 22, isFeatured: false, images: [IMG.monitor_wide], specs: { size: '34"', resolution: "3440x1440 (UWQHD)", panel: "IPS Nano Curved", refreshRate: "75Hz", responseTime: "5ms", ports: "USB-C 60W PD, 2x HDMI 2.0, DP 1.4, USB Hub", brightness: "300 nits", colorCoverage: "99% sRGB" } },
    { name: "Acer Nitro XV272U V3 27\" QHD 170Hz", slug: "acer-nitro-xv272u-v3-27-qhd", description: "27-inch QHD gaming monitor with 170Hz IPS and FreeSync Premium. Sharp, fast and affordable for UAE gamers who want a QHD upgrade.", price: 999, comparePrice: 1299, brandId: brandMap["Acer"], categoryId: catMap["monitors"], sku: "ACER-XV272UV3-27-QHD-170", stock: 45, isFeatured: false, images: [IMG.monitor_gaming], specs: { size: '27"', resolution: "2560x1440 (QHD)", panel: "IPS", refreshRate: "170Hz", responseTime: "1ms MPRT", ports: "HDMI 2.0, DP 1.4, USB Hub", brightness: "400 nits", freesync: "FreeSync Premium" } },
    { name: "ASUS ROG Swift PG279QM 27\" QHD 240Hz", slug: "asus-rog-swift-pg279qm-27-240hz", description: "27-inch QHD IPS gaming monitor with 240Hz and G-Sync. ASUS ROG's flagship esports display for competitive UAE gamers.", price: 3499, comparePrice: 3999, brandId: brandMap["ASUS"], categoryId: catMap["monitors"], sku: "ASUS-PG279QM-27-QHD-240", stock: 18, isFeatured: true, images: [IMG.monitor_gaming], specs: { size: '27"', resolution: "2560x1440 (QHD)", panel: "IPS", refreshRate: "240Hz", responseTime: "1ms GTG", ports: "HDMI 2.0, DP 1.4, USB 3.0 Hub", brightness: "400 nits", gsync: "G-Sync Compatible" } },
    { name: "Philips 346E2CUAE 34\" Curved Ultrawide", slug: "philips-346e2cuae-34-ultrawide", description: "34-inch curved UWQHD monitor with USB-C 65W PD and MultiView. Philips' productivity ultrawide for UAE professionals wanting a premium value option.", price: 1599, comparePrice: 1999, brandId: brandMap["Philips"], categoryId: catMap["monitors"], sku: "PHILIPS-346E2C-34-UW-65W", stock: 28, isFeatured: false, images: [IMG.monitor_wide], specs: { size: '34"', resolution: "3440x1440 (UWQHD)", panel: "VA Curved", refreshRate: "100Hz", responseTime: "4ms", ports: "USB-C 65W PD, HDMI 2.0, DP 1.4", brightness: "300 nits", multiview: "PBP/PIP support" } },
    { name: "HP E27k G5 4K USB-C Business Monitor", slug: "hp-e27k-g5-4k-usbc", description: "27-inch 4K IPS business monitor with USB-C 65W PD and ergonomic stand. HP's professional display solution for UAE corporate environments.", price: 1899, comparePrice: 2399, brandId: brandMap["HP"], categoryId: catMap["monitors"], sku: "HP-E27KG5-4K-65W", stock: 35, isFeatured: false, images: [IMG.monitor_4k], specs: { size: '27"', resolution: "3840x2160 (4K UHD)", panel: "IPS", refreshRate: "60Hz", responseTime: "5ms", ports: "USB-C 65W PD, HDMI 2.0, DP 1.4, 4x USB-A", brightness: "350 nits", ergonomics: "Height, tilt, swivel, pivot" } },

    // ── MORE PC COMPONENTS ───────────────────────────────────────────
    { name: "AMD Radeon RX 7900 XTX 24GB", slug: "amd-radeon-rx7900xtx-24gb", description: "AMD's flagship RDNA 3 GPU with 24GB GDDR6 and PCIe 4.0. Top-tier 4K gaming and content creation performance for UAE enthusiast builders.", price: 5299, comparePrice: 6299, brandId: brandMap["AMD"], categoryId: catMap["pc-components"], sku: "AMD-RX7900XTX-24GB", stock: 12, isFeatured: true, images: [IMG.gpu], specs: { gpu: "AMD Radeon RX 7900 XTX", vram: "24GB GDDR6", memoryBus: "384-bit", interface: "PCIe 4.0 x16", tdp: "355W", outputs: "1x HDMI 2.1, 3x DisplayPort 2.1", aiTops: "122 AI TOPS" } },
    { name: "MSI GeForce RTX 4070 Super Ventus 12GB", slug: "msi-rtx4070-super-ventus-12gb", description: "NVIDIA RTX 4070 Super with 12GB GDDR6X — the sweet spot for UAE 1440p gaming. Excellent rasterisation and ray tracing performance.", price: 2399, comparePrice: 2799, brandId: brandMap["MSI"], categoryId: catMap["pc-components"], sku: "MSI-RTX4070S-VENTUS-12GB", stock: 25, isFeatured: false, images: [IMG.gpu], specs: { gpu: "NVIDIA GeForce RTX 4070 Super", vram: "12GB GDDR6X", memoryBus: "192-bit", interface: "PCIe 4.0 x16", tdp: "220W", outputs: "3x DisplayPort 1.4, 1x HDMI 2.1" } },
    { name: "Gigabyte GeForce RTX 4060 Gaming OC 8GB", slug: "gigabyte-rtx4060-gaming-oc-8gb", description: "RTX 4060 with 8GB GDDR6 and WINDFORCE 3X cooling. Great 1080p/1440p gaming GPU for UAE budget builders upgrading to Ada Lovelace.", price: 1299, comparePrice: 1599, brandId: brandMap["Gigabyte"], categoryId: catMap["pc-components"], sku: "GIGABYTE-RTX4060-OC-8GB", stock: 40, isFeatured: false, images: [IMG.gpu], specs: { gpu: "NVIDIA GeForce RTX 4060", vram: "8GB GDDR6", memoryBus: "128-bit", interface: "PCIe 4.0 x16", tdp: "115W", outputs: "3x DisplayPort 1.4, 1x HDMI 2.1" } },
    { name: "AMD Ryzen 9 7950X 16-Core Processor", slug: "amd-ryzen-9-7950x-16core", description: "AMD's flagship 16-core desktop CPU with 5.7GHz boost clock. The best workstation processor for UAE content creators and developers.", price: 3299, comparePrice: 3999, brandId: brandMap["AMD"], categoryId: catMap["pc-components"], sku: "AMD-R9-7950X-16C32T", stock: 15, isFeatured: false, images: [IMG.cpu], specs: { cores: "16", threads: "32", baseClock: "4.5 GHz", boostClock: "5.7 GHz", cache: "64MB L3", socket: "AM5", tdp: "170W (PBP)", architecture: "Zen 4" } },
    { name: "AMD Ryzen 5 7600X 6-Core Processor", slug: "amd-ryzen-5-7600x-6core", description: "6-core Zen 4 CPU with exceptional single-threaded speed and DDR5 support. The best value gaming processor for AM5 builds in the UAE.", price: 899, comparePrice: 1199, brandId: brandMap["AMD"], categoryId: catMap["pc-components"], sku: "AMD-R5-7600X-6C12T", stock: 50, isFeatured: false, images: [IMG.cpu], specs: { cores: "6", threads: "12", baseClock: "4.7 GHz", boostClock: "5.3 GHz", cache: "32MB L3", socket: "AM5", tdp: "105W (PBP)", architecture: "Zen 4" } },
    { name: "Corsair Vengeance DDR4 32GB (2x16GB) 3200MHz", slug: "corsair-vengeance-ddr4-32gb-3200", description: "Reliable DDR4 RAM with XMP 2.0 support and Intel/AMD compatibility. The standard memory upgrade for UAE PC builders on LGA1700 or AM4 platforms.", price: 279, comparePrice: 379, brandId: brandMap["Corsair"], categoryId: catMap["pc-components"], sku: "CORSAIR-VEN-DDR4-32GB-3200", stock: 90, isFeatured: false, images: [IMG.ram], specs: { type: "DDR4 DIMM", capacity: "32GB (2x16GB)", speed: "3200MHz", latency: "CL16", voltage: "1.35V", profile: "Intel XMP 2.0 / AMD EXPO" } },
    { name: "Kingston Fury Beast DDR5 32GB 5200MHz", slug: "kingston-fury-beast-ddr5-32gb", description: "Next-gen DDR5 memory with low-profile heatspreader and XMP 3.0. The go-to DDR5 upgrade for Intel 13th/14th gen and AMD AM5 builds.", price: 449, comparePrice: 549, brandId: brandMap["Kingston"], categoryId: catMap["pc-components"], sku: "KINGSTON-FURY-DDR5-32GB-5200", stock: 70, isFeatured: false, images: [IMG.ram], specs: { type: "DDR5 DIMM", capacity: "32GB (2x16GB)", speed: "5200MHz", latency: "CL36", voltage: "1.25V", profile: "Intel XMP 3.0 / AMD EXPO" } },
    { name: "Samsung 990 Pro 2TB NVMe SSD", slug: "samsung-990-pro-2tb-nvme", description: "Flagship PCIe 4.0 NVMe SSD with 7450 MB/s read and advanced heat management. Samsung's best SSD for PS5 and high-end UAE PC builds.", price: 699, comparePrice: 899, brandId: brandMap["Samsung"], categoryId: catMap["pc-components"], sku: "SAMSUNG-990PRO-2TB", stock: 55, isFeatured: true, images: [IMG.ssd], specs: { type: "M.2 2280 NVMe PCIe 4.0", capacity: "2TB", readSpeed: "7450 MB/s", writeSpeed: "6900 MB/s", nand: "Samsung V-NAND 3-bit MLC", warranty: "5 years" } },
    { name: "Crucial P3 Plus 2TB NVMe SSD", slug: "crucial-p3-plus-2tb-nvme", description: "Budget PCIe 4.0 NVMe SSD with solid performance at an accessible price. Best value 2TB SSD for UAE PC builders looking to save money.", price: 349, comparePrice: 449, brandId: brandMap["Crucial"], categoryId: catMap["pc-components"], sku: "CRUCIAL-P3P-2TB-NVME", stock: 80, isFeatured: false, images: [IMG.ssd], specs: { type: "M.2 2280 NVMe PCIe 4.0", capacity: "2TB", readSpeed: "5000 MB/s", writeSpeed: "4200 MB/s", warranty: "5 years" } },
    { name: "ASUS ROG CROSSHAIR X670E Hero Motherboard", slug: "asus-rog-crosshair-x670e-hero", description: "Premium AM5 motherboard with PCIe 5.0 and DDR5 support. ASUS ROG's flagship X670E board for UAE Ryzen 7000 enthusiast builds.", price: 2199, comparePrice: 2699, brandId: brandMap["ASUS"], categoryId: catMap["pc-components"], sku: "ASUS-ROG-X670E-HERO", stock: 18, isFeatured: false, images: [IMG.motherboard], specs: { socket: "AM5", chipset: "AMD X670E", formFactor: "ATX", memorySlots: "4x DDR5 (max 128GB)", pcie: "PCIe 5.0 x16, PCIe 5.0 M.2", ports: "USB 3.2 Gen2x2, WiFi 6E", rgb: "AURA Sync" } },
    { name: "Gigabyte Z790 AORUS Elite AX Motherboard", slug: "gigabyte-z790-aorus-elite-ax", description: "High-value Intel LGA1700 ATX motherboard with PCIe 5.0 and DDR5. AORUS' best mid-range board for UAE 13th/14th gen Intel builds.", price: 1299, comparePrice: 1599, brandId: brandMap["Gigabyte"], categoryId: catMap["pc-components"], sku: "GIGABYTE-Z790-AORUS-ELITE-AX", stock: 25, isFeatured: false, images: [IMG.motherboard], specs: { socket: "LGA1700", chipset: "Intel Z790", formFactor: "ATX", memorySlots: "4x DDR5 (max 192GB)", pcie: "PCIe 5.0 x16, 4x M.2", ports: "USB 3.2 Gen2x2, WiFi 6E, 2.5G LAN", rgb: "RGB Fusion 2.0" } },
    { name: "NZXT H510 Flow ATX Mid Tower Case", slug: "nzxt-h510-flow-atx", description: "Clean minimalist ATX mid tower with perforated front panel for maximum airflow. NZXT's popular case for UAE builders who value cable management.", price: 499, comparePrice: 649, brandId: brandMap["Corsair"], categoryId: catMap["pc-components"], sku: "NZXT-H510-FLOW-ATX", stock: 35, isFeatured: false, images: [IMG.pc_case], specs: { formFactor: "ATX Mid Tower", motherboards: "ATX, mATX, ITX", frontPanel: "Perforated mesh", fans: "2x 120mm included", radiator: "Up to 280mm front, 120mm rear", clearance: "165mm CPU, 368mm GPU", drive: "2x 2.5\", 1x 3.5\"" } },
    { name: "Cooler Master MasterLiquid 360 ATMOS AIO", slug: "cooler-master-ml360-atmos-aio", description: "360mm all-in-one liquid cooler with 3x 120mm ARGB fans. Excellent cooling performance for UAE high-end CPU overclocks.", price: 699, comparePrice: 899, brandId: brandMap["Cooler Master"], categoryId: catMap["pc-components"], sku: "CM-ML360-ATMOS-ARGB", stock: 30, isFeatured: false, images: [IMG.cpu], specs: { radiator: "360mm", fans: "3x 120mm ARGB", pump: "Dual-chamber pump", compatibility: "Intel LGA1700/1200/115x, AMD AM5/AM4", rgb: "ARGB sync", noise: "Up to 27 dBA" } },
    { name: "WD Black SN850X 1TB NVMe SSD", slug: "wd-black-sn850x-1tb-nvme", description: "WD's flagship gaming NVMe SSD with 7300 MB/s reads and PCIe 4.0. Optimised for PS5 and high-end PC gaming in the UAE.", price: 449, comparePrice: 599, brandId: brandMap["Western Digital"], categoryId: catMap["pc-components"], sku: "WD-SN850X-1TB-NVME", stock: 60, isFeatured: false, images: [IMG.ssd], specs: { type: "M.2 2280 NVMe PCIe 4.0", capacity: "1TB", readSpeed: "7300 MB/s", writeSpeed: "6300 MB/s", warranty: "5 years" } },

    // ── MORE NETWORKING ──────────────────────────────────────────────
    { name: "TP-Link Deco XE75 AXE5400 Mesh 2-Pack", slug: "tp-link-deco-xe75-mesh-2pack", description: "Tri-band WiFi 6E mesh system covering up to 500m². Eliminates dead zones across large UAE villas and offices with seamless roaming.", price: 1299, comparePrice: 1599, brandId: brandMap["TP-Link"], categoryId: catMap["networking"], sku: "TP-DECO-XE75-2PK", stock: 30, isFeatured: true, images: [IMG.ap], specs: { standard: "WiFi 6E (802.11axe)", speed: "AXE5400 (574+2402+2402 Mbps)", bands: "Tri-Band (2.4GHz + 5GHz + 6GHz)", coverage: "Up to 500m²", units: "2 nodes", backhaul: "6GHz dedicated", ports: "1x 2.5G WAN, 1x 1G LAN per node" } },
    { name: "TP-Link Archer BE550 WiFi 7 Router", slug: "tp-link-archer-be550-wifi7", description: "WiFi 7 router delivering up to 9.4 Gbps combined wireless bandwidth. Future-proof connectivity for UAE homes and businesses.", price: 1099, comparePrice: 1399, brandId: brandMap["TP-Link"], categoryId: catMap["networking"], sku: "TP-ARCHER-BE550-WIFI7", stock: 25, isFeatured: false, images: [IMG.router], specs: { standard: "WiFi 7 (802.11be)", speed: "BE9400", bands: "Tri-Band", ports: "1x 10G WAN, 4x 1G LAN", features: "MLO, 4096-QAM, Beamforming", processor: "1.8GHz Quad-Core" } },
    { name: "Netgear Nighthawk RAX50 AX5400", slug: "netgear-nighthawk-rax50-ax5400", description: "6-stream WiFi 6 router with 1.8GHz quad-core processor and Nighthawk app. Fast, reliable WiFi for UAE multi-device households.", price: 799, comparePrice: 999, brandId: brandMap["Netgear"], categoryId: catMap["networking"], sku: "NETGEAR-RAX50-AX5400", stock: 35, isFeatured: false, images: [IMG.router], specs: { standard: "WiFi 6 (802.11ax)", speed: "AX5400 (1201+4804 Mbps)", bands: "Dual Band", antennas: "4 Fixed Antennas", ports: "1x 1G WAN, 4x 1G LAN, USB 3.0", features: "OFDMA, MU-MIMO" } },
    { name: "D-Link DIR-X1560 AX1500 Router", slug: "d-link-dir-x1560-ax1500", description: "Entry-level WiFi 6 router with AX1500 speeds and 4 Gigabit LAN ports. Affordable wireless upgrade for UAE apartments.", price: 299, comparePrice: 399, brandId: brandMap["D-Link"], categoryId: catMap["networking"], sku: "DLINK-DIRX1560-AX1500", stock: 60, isFeatured: false, images: [IMG.router], specs: { standard: "WiFi 6 (802.11ax)", speed: "AX1500", bands: "Dual Band", antennas: "4 Fixed Antennas", ports: "1x 1G WAN, 4x 1G LAN", features: "OFDMA, Beamforming" } },
    { name: "TP-Link RE605X AX1800 Range Extender", slug: "tp-link-re605x-ax1800", description: "WiFi 6 range extender with Gigabit port and 1800 Mbps speeds. Eliminates blind spots in large UAE homes and offices.", price: 249, comparePrice: 349, brandId: brandMap["TP-Link"], categoryId: catMap["networking"], sku: "TP-RE605X-AX1800", stock: 55, isFeatured: false, images: [IMG.ap], specs: { standard: "WiFi 6 (802.11ax)", speed: "AX1800 (574+1201 Mbps)", bands: "Dual Band", port: "1x Gigabit Ethernet", features: "Access Point Mode, Seamless Roaming", form: "Wall plug" } },
    { name: "Netgear GS308E 8-Port Smart Switch", slug: "netgear-gs308e-8port-smart", description: "8-port Gigabit smart managed switch with VLAN and QoS support. Ideal for UAE home labs and small business network management.", price: 199, comparePrice: 279, brandId: brandMap["Netgear"], categoryId: catMap["networking"], sku: "NETGEAR-GS308E-8P", stock: 50, isFeatured: false, images: [IMG.switch_net], specs: { ports: "8x Gigabit RJ45", layer: "Layer 2 Smart Managed", vlans: "802.1Q VLAN, Port-based VLAN", qos: "802.1p, DSCP", formFactor: "Desktop/Wall mount", cooling: "Fanless" } },
    { name: "TP-Link TL-SG116E 16-Port Easy Smart Switch", slug: "tp-link-tl-sg116e-16port", description: "16-port Gigabit smart switch with VLAN, QoS and IGMP Snooping. Affordable managed switching for UAE growing businesses.", price: 349, comparePrice: 449, brandId: brandMap["TP-Link"], categoryId: catMap["networking"], sku: "TP-SG116E-16PORT", stock: 40, isFeatured: false, images: [IMG.switch_net], specs: { ports: "16x Gigabit RJ45", layer: "Layer 2 Easy Smart", vlans: "802.1Q VLAN", qos: "8 queues per port, 802.1p", formFactor: "Desktop", cooling: "Fanless" } },
    { name: "Ubiquiti UniFi Dream Machine Pro", slug: "ubiquiti-unifi-dream-machine-pro", description: "Enterprise security gateway with 10G SFP+ and full UniFi Network Controller on-board. The all-in-one network hub for UAE enterprise deployments.", price: 1699, comparePrice: 1999, brandId: brandMap["Ubiquiti"], categoryId: catMap["networking"], sku: "UBNT-UDM-PRO", stock: 15, isFeatured: true, images: [IMG.router], specs: { wan: "1x 10G SFP+, 1x 1G RJ45", lan: "8x 1G RJ45", controller: "UniFi Network Controller built-in", storage: "128GB SSD", throughput: "3.5 Gbps IPS/IDS", formFactor: "1U Rack Mountable" } },
    { name: "D-Link DGS-1210-28P PoE Smart Switch", slug: "d-link-dgs-1210-28p-poe", description: "24-port Gigabit PoE+ smart switch for powering IP cameras, APs and phones. Ideal for UAE structured cabling and smart building deployments.", price: 1299, comparePrice: 1599, brandId: brandMap["D-Link"], categoryId: catMap["networking"], sku: "DLINK-DGS1210-28P-POE", stock: 20, isFeatured: false, images: [IMG.switch_net], specs: { ports: "24x Gigabit PoE+, 4x SFP", layer: "Layer 2 Smart Managed", poe: "PoE+ IEEE 802.3at (193W budget)", vlans: "802.1Q, 4K VLANs", management: "Web, CLI, SNMP", formFactor: "19\" Rack 1U" } },
    { name: "TP-Link TL-WR841N N300 Wireless Router", slug: "tp-link-tl-wr841n-n300", description: "Budget-friendly 300Mbps router for basic home WiFi needs. Reliable and easy to set up — perfect for UAE studio apartments.", price: 79, comparePrice: 109, brandId: brandMap["TP-Link"], categoryId: catMap["networking"], sku: "TP-WR841N-N300", stock: 100, isFeatured: false, images: [IMG.router], specs: { standard: "802.11n", speed: "N300 (300 Mbps)", bands: "Single Band 2.4GHz", antennas: "2 Fixed 5dBi", ports: "1x 100M WAN, 4x 100M LAN", features: "WPA3, Parental Controls" } },
    { name: "Belkin USB-C to 2.5G Ethernet Adapter", slug: "belkin-usbc-2-5g-ethernet-adapter", description: "USB-C to 2.5 Gigabit Ethernet adapter for modern laptops and tablets. Connect to a wired network at 2.5G speeds from any USB-C port.", price: 149, comparePrice: 199, brandId: brandMap["Belkin"], categoryId: catMap["networking"], sku: "BELKIN-INC001-2-5G", stock: 70, isFeatured: false, images: [IMG.ap], specs: { interface: "USB-C (USB 3.1 Gen 1)", ethernet: "2.5 Gigabit Ethernet (2500 Mbps)", compatibility: "Windows, macOS, Linux, ChromeOS", drivers: "Plug and play" } },

    // ── MORE STORAGE ─────────────────────────────────────────────────
    { name: "Samsung 980 Pro 2TB NVMe SSD", slug: "samsung-980-pro-2tb-nvme", description: "PCIe 4.0 NVMe SSD with 7000 MB/s reads — perfect for PS5 and high-end PCs. Samsung's reliable storage upgrade for UAE enthusiasts.", price: 599, comparePrice: 799, brandId: brandMap["Samsung"], categoryId: catMap["storage"], sku: "SAMSUNG-980PRO-2TB", stock: 60, isFeatured: false, images: [IMG.ssd], specs: { type: "M.2 2280 NVMe PCIe 4.0", capacity: "2TB", readSpeed: "7000 MB/s", writeSpeed: "5100 MB/s", nand: "Samsung V-NAND 3-bit MLC", warranty: "5 years" } },
    { name: "Seagate Barracuda 2TB Desktop HDD", slug: "seagate-barracuda-2tb-desktop", description: "Reliable 2TB SATA desktop hard drive for mass storage. Seagate's most popular HDD for UAE desktop PCs and NAS systems.", price: 199, comparePrice: 279, brandId: brandMap["Seagate"], categoryId: catMap["storage"], sku: "SEAGATE-BARR-2TB-SATA", stock: 100, isFeatured: false, images: [IMG.hdd], specs: { capacity: "2TB", type: "3.5\" SATA HDD", rpm: "7200 RPM", cache: "256MB", readSpeed: "220 MB/s", formFactor: '3.5"', warranty: "2 years" } },
    { name: "Kingston DataTraveler Max 256GB USB 3.2", slug: "kingston-datatraveler-max-256gb", description: "High-speed USB 3.2 Gen 2 flash drive with 1000 MB/s read. Transfer large files instantly — the fastest USB stick available in the UAE.", price: 249, comparePrice: 329, brandId: brandMap["Kingston"], categoryId: catMap["storage"], sku: "KINGSTON-DTM-256GB-USB32", stock: 80, isFeatured: false, images: [IMG.usb_drive], specs: { capacity: "256GB", interface: "USB 3.2 Gen 2 (USB-A)", readSpeed: "1000 MB/s", writeSpeed: "900 MB/s", compatibility: "Windows, macOS, Linux" } },
    { name: "WD Red Plus 6TB NAS Hard Drive", slug: "wd-red-plus-6tb-nas", description: "6TB NAS optimised hard drive with CMR recording and NASware 3.0. Purpose-built for always-on UAE home and business NAS systems.", price: 699, comparePrice: 899, brandId: brandMap["Western Digital"], categoryId: catMap["storage"], sku: "WD-RED-PLUS-6TB-NAS", stock: 35, isFeatured: false, images: [IMG.hdd], specs: { capacity: "6TB", type: "3.5\" SATA NAS HDD", rpm: "5400 RPM CMR", cache: "128MB", readSpeed: "180 MB/s", nasware: "NASware 3.0", vibration: "IsoAware", warranty: "3 years" } },
    { name: "Crucial X9 Pro 1TB Portable SSD", slug: "crucial-x9-pro-1tb-portable", description: "Compact USB-C portable SSD with 1050 MB/s reads and IP55 protection. Durable, fast and pocket-sized for UAE professionals on the move.", price: 299, comparePrice: 399, brandId: brandMap["Crucial"], categoryId: catMap["storage"], sku: "CRUCIAL-X9PRO-1TB", stock: 55, isFeatured: false, images: [IMG.portable_ssd], specs: { capacity: "1TB", type: "Portable SSD", interface: "USB 3.2 Gen 2 (USB-C)", readSpeed: "1050 MB/s", writeSpeed: "1000 MB/s", protection: "IP55 water/dust, drop-resistant (2m)", weight: "54g" } },
    { name: "WD Blue 4TB 3.5\" Desktop HDD", slug: "wd-blue-4tb-desktop", description: "Spacious 4TB desktop SATA drive from Western Digital. Reliable bulk storage for UAE desktop PCs and home servers at an affordable price.", price: 349, comparePrice: 449, brandId: brandMap["Western Digital"], categoryId: catMap["storage"], sku: "WD-BLUE-4TB-DESKTOP", stock: 65, isFeatured: false, images: [IMG.hdd], specs: { capacity: "4TB", type: "3.5\" SATA HDD", rpm: "5400 RPM", cache: "256MB", readSpeed: "180 MB/s", warranty: "2 years" } },
    { name: "Seagate Expansion Hub 8TB Desktop", slug: "seagate-expansion-hub-8tb-desktop", description: "8TB desktop external drive with built-in 3-port USB hub. Generous backup capacity and device charging for UAE home users.", price: 599, comparePrice: 799, brandId: brandMap["Seagate"], categoryId: catMap["storage"], sku: "SEAGATE-EXP-HUB-8TB", stock: 30, isFeatured: false, images: [IMG.portable_hdd], specs: { capacity: "8TB", type: "Desktop HDD", interface: "USB 3.0", hub: "3x USB 3.0 ports", compatibility: "Windows, Mac", warranty: "2 years" } },
    { name: "Samsung Portable SSD T7 500GB", slug: "samsung-t7-500gb-portable", description: "Pocket-sized USB 3.2 Gen2 portable SSD with 1050 MB/s and password protection. Compact and fast storage for UAE students and travellers.", price: 199, comparePrice: 279, brandId: brandMap["Samsung"], categoryId: catMap["storage"], sku: "SAMSUNG-T7-500GB", stock: 75, isFeatured: false, images: [IMG.portable_ssd], specs: { capacity: "500GB", type: "Portable SSD", interface: "USB 3.2 Gen2 (USB-C)", readSpeed: "1050 MB/s", writeSpeed: "1000 MB/s", encryption: "256-bit AES", weight: "58g" } },
    { name: "Kingston IronKey Locker+ 32GB Encrypted USB", slug: "kingston-ironkey-locker-32gb", description: "Hardware-encrypted USB drive with XTS-AES 256-bit and USB2 to AWS backup. Secure data transport compliant with UAE cybersecurity regulations.", price: 179, comparePrice: 249, brandId: brandMap["Kingston"], categoryId: catMap["storage"], sku: "KINGSTON-IKL-32GB-ENCRYPT", stock: 40, isFeatured: false, images: [IMG.usb_drive], specs: { capacity: "32GB", interface: "USB 3.2 Gen 1 (USB-A)", encryption: "XTS-AES 256-bit hardware", protection: "Password (brute force lockout)", cloud: "Optional cloud backup", compatibility: "Windows, macOS, Linux" } },
    { name: "Seagate One Touch 4TB Portable HDD", slug: "seagate-one-touch-4tb-portable", description: "4TB portable hard drive with Seagate Toolkit for automatic backup. Large-capacity portable storage for UAE content creators and video editors.", price: 349, comparePrice: 449, brandId: brandMap["Seagate"], categoryId: catMap["storage"], sku: "SEAGATE-OT-4TB-USB3", stock: 45, isFeatured: false, images: [IMG.portable_hdd], specs: { capacity: "4TB", type: "Portable HDD", interface: "USB 3.0", speed: "Up to 120 MB/s", compatibility: "Windows, Mac", backup: "Seagate Toolkit software", weight: "270g" } },
    { name: "Samsung 870 QVO 4TB SATA SSD", slug: "samsung-870-qvo-4tb-sata", description: "Budget-friendly 4TB SATA SSD with V-NAND and Intelligent TurboWrite. Largest SATA SSD capacity for UAE desktop mass storage upgrades.", price: 849, comparePrice: 1099, brandId: brandMap["Samsung"], categoryId: catMap["storage"], sku: "SAMSUNG-870QVO-4TB", stock: 30, isFeatured: false, images: [IMG.ssd], specs: { type: "2.5\" SATA III SSD", capacity: "4TB", readSpeed: "560 MB/s", writeSpeed: "530 MB/s", nand: "Samsung V-NAND 4-bit QLC", warranty: "3 years" } },

    // ── MORE PERIPHERALS ─────────────────────────────────────────────
    { name: "Razer BlackWidow V4 Pro Wireless Keyboard", slug: "razer-blackwidow-v4-pro-wireless", description: "Premium wireless mechanical gaming keyboard with Green switches and Chroma RGB. Razer's flagship for UAE esports professionals who need wireless freedom.", price: 999, comparePrice: 1199, brandId: brandMap["Razer"], categoryId: catMap["peripherals"], sku: "RAZER-BW-V4PRO-GREEN-WL", stock: 30, isFeatured: true, images: [IMG.keyboard_gaming], specs: { connectivity: "Bluetooth, USB Receiver, USB-C wired", switches: "Razer Green Mechanical", backlighting: "Razer Chroma RGB per-key", battery: "Up to 200 hours (no lighting)", layout: "Full-size with numpad", features: "Command Dial, wrist rest included" } },
    { name: "SteelSeries Apex Pro TKL Wireless", slug: "steelseries-apex-pro-tkl-wireless", description: "TKL wireless keyboard with adjustable actuation OmniPoint 2.0 switches. The most advanced gaming keyboard for UAE competitive players.", price: 899, comparePrice: 1099, brandId: brandMap["SteelSeries"], categoryId: catMap["peripherals"], sku: "SS-APEX-PRO-TKL-WL", stock: 20, isFeatured: false, images: [IMG.keyboard_gaming], specs: { connectivity: "USB Receiver, USB-C wired", switches: "OmniPoint 2.0 (adjustable 0.1-4mm)", backlighting: "Per-key RGB", battery: "Up to 40 hours", layout: "Tenkeyless (TKL)", display: "OLED smart display" } },
    { name: "HyperX Alloy Origins Core TKL Keyboard", slug: "hyperx-alloy-origins-core-tkl", description: "Compact TKL keyboard with HyperX Red linear switches and full RGB. Best budget gaming keyboard for UAE console-desk setups.", price: 399, comparePrice: 499, brandId: brandMap["HyperX"], categoryId: catMap["peripherals"], sku: "HX-ALLOY-ORIGINS-TKL-RED", stock: 55, isFeatured: false, images: [IMG.keyboard], specs: { connectivity: "USB-C detachable", switches: "HyperX Red Linear", backlighting: "Full RGB per-key", layout: "Tenkeyless (TKL)", frame: "Aircraft grade aluminium", software: "HyperX NGENUITY" } },
    { name: "Corsair K70 RGB PRO Mechanical Keyboard", slug: "corsair-k70-rgb-pro-mechanical", description: "Full-size Cherry MX Red mechanical keyboard with aircraft aluminium frame and dynamic RGB. Corsair's best for UAE enthusiasts wanting build quality.", price: 649, comparePrice: 799, brandId: brandMap["Corsair"], categoryId: catMap["peripherals"], sku: "CORSAIR-K70-RGB-PRO-MX-RED", stock: 35, isFeatured: false, images: [IMG.keyboard], specs: { connectivity: "USB-C detachable", switches: "Cherry MX Red", backlighting: "Per-key Dynamic RGB", layout: "Full-size", frame: "Aircraft grade aluminium", features: "iCUE, PBT double-shot keycaps, USB pass-through" } },
    { name: "Logitech G Pro X Superlight 2 Gaming Mouse", slug: "logitech-g-pro-x-superlight-2", description: "Ultra-light 60g wireless gaming mouse with HERO 25K sensor and LIGHTSPEED. The mouse of choice for UAE esports professionals.", price: 699, comparePrice: 849, brandId: brandMap["Logitech"], categoryId: catMap["peripherals"], sku: "LOGI-GPXSL2-WIRELESS", stock: 40, isFeatured: true, images: [IMG.mouse_gaming], specs: { connectivity: "LIGHTSPEED Wireless + USB-C", sensor: "HERO 25K (100-25600 DPI)", weight: "60g", battery: "Up to 95 hours", buttons: "5 programmable", clicks: "90M click lifecycle", compatibility: "Windows, macOS" } },
    { name: "Razer DeathAdder V3 HyperSpeed Wireless", slug: "razer-deathadder-v3-hyperspeed", description: "Ergonomic wireless gaming mouse with Focus Pro 26K sensor in a 64g frame. Razer's best wireless mouse for right-handed UAE gamers.", price: 449, comparePrice: 599, brandId: brandMap["Razer"], categoryId: catMap["peripherals"], sku: "RAZER-DAV3-HYPERSPEED", stock: 45, isFeatured: false, images: [IMG.mouse_gaming], specs: { connectivity: "HyperSpeed Wireless + USB-C", sensor: "Focus Pro 26K (100-26000 DPI)", weight: "64g", battery: "Up to 300 hours", buttons: "6 programmable", clicks: "90M Optical switches" } },
    { name: "SteelSeries Aerox 5 Wireless Gaming Mouse", slug: "steelseries-aerox-5-wireless", description: "Ultra-light 74g wireless mouse with 9 programmable buttons and TrueMove Air sensor. Best multi-button wireless mouse for UAE MMO/MOBA players.", price: 499, comparePrice: 649, brandId: brandMap["SteelSeries"], categoryId: catMap["peripherals"], sku: "SS-AEROX5-WL-9BTN", stock: 30, isFeatured: false, images: [IMG.mouse_gaming], specs: { connectivity: "USB Receiver, Bluetooth, USB-C", sensor: "TrueMove Air (18000 DPI)", weight: "74g", battery: "Up to 180 hours", buttons: "9 programmable", protection: "IP54" } },
    { name: "HyperX Cloud III Wireless Headset", slug: "hyperx-cloud-iii-wireless", description: "53mm angled drivers with DTS Headphone:X Spatial Audio and 120-hour battery. HyperX's best wireless headset for UAE gamers who game for long sessions.", price: 699, comparePrice: 849, brandId: brandMap["HyperX"], categoryId: catMap["peripherals"], sku: "HX-CLOUD-III-WL", stock: 35, isFeatured: false, images: [IMG.headset], specs: { connectivity: "2.4GHz USB Receiver", drivers: "53mm angled", frequency: "10Hz–21kHz", battery: "Up to 120 hours", mic: "Detachable boom mic with noise cancellation", spatial: "DTS Headphone:X", compatibility: "PC, PlayStation" } },
    { name: "Razer BlackShark V2 X Gaming Headset", slug: "razer-blackshark-v2x-gaming", description: "Budget esports headset with TriForce Titanium 50mm drivers and cardioid mic. Great entry-level gaming audio for UAE console and PC gamers.", price: 249, comparePrice: 349, brandId: brandMap["Razer"], categoryId: catMap["peripherals"], sku: "RAZER-BSV2X-WIRED", stock: 60, isFeatured: false, images: [IMG.headset], specs: { connectivity: "3.5mm + USB audio", drivers: "50mm TriForce Titanium", frequency: "12Hz–28kHz", mic: "HyperClear Cardioid (Detachable)", weight: "240g", compatibility: "PC, Console, Mobile" } },
    { name: "SteelSeries Arctis Nova Pro Wireless", slug: "steelseries-arctis-nova-pro-wireless", description: "Dual wireless gaming headset with active noise cancellation and Hi-Res audio. SteelSeries' audiophile-grade gaming headset for UAE enthusiasts.", price: 1299, comparePrice: 1599, brandId: brandMap["SteelSeries"], categoryId: catMap["peripherals"], sku: "SS-ARCTIS-NOVA-PRO-WL", stock: 18, isFeatured: true, images: [IMG.headset], specs: { connectivity: "2.4GHz + Bluetooth (simultaneous)", anc: "Active Noise Cancellation", battery: "Up to 44 hours (with hot-swap)", hi_res: "Hi-Res Audio (40kHz)", base_station: "GameDAC Gen 2 included", compatibility: "PC, PlayStation" } },
    { name: "Logitech G435 Wireless Bluetooth Headset", slug: "logitech-g435-wireless-bluetooth", description: "Ultra-light 165g wireless headset with dual wireless (Bluetooth + USB) for UAE gamers who switch between PC and console.", price: 349, comparePrice: 449, brandId: brandMap["Logitech"], categoryId: catMap["peripherals"], sku: "LOGI-G435-WL-BT", stock: 45, isFeatured: false, images: [IMG.headset], specs: { connectivity: "LIGHTSPEED + Bluetooth 5.1", weight: "165g", battery: "Up to 18 hours", mic: "Built-in dual beamforming mics", spatial: "Dolby Atmos", compatibility: "PC, PlayStation, Mobile" } },
    { name: "Elgato Wave:3 USB Condenser Microphone", slug: "elgato-wave3-usb-condenser", description: "Professional USB condenser mic with Clipguard technology and Wave Link mixer software. The streamer's choice microphone for UAE content creators.", price: 699, comparePrice: 849, brandId: brandMap["Logitech"], categoryId: catMap["peripherals"], sku: "ELGATO-WAVE3-USB", stock: 30, isFeatured: false, images: [IMG.microphone], specs: { type: "Condenser (cardioid/omni)", frequency: "70Hz–20kHz", sampleRate: "96kHz / 24-bit", connection: "USB-C", software: "Wave Link mixing software", clipguard: "Dual capsule Clipguard", compatibility: "Windows, macOS" } },
    { name: "Logitech C930e 1080p Business Webcam", slug: "logitech-c930e-1080p-business", description: "1080p business webcam with 90° FOV, zoom and H.264 encoding. Certified for Microsoft Teams, Zoom and Cisco for UAE remote workers.", price: 449, comparePrice: 599, brandId: brandMap["Logitech"], categoryId: catMap["peripherals"], sku: "LOGI-C930E-1080P-BSNS", stock: 40, isFeatured: false, images: [IMG.webcam], specs: { resolution: "1920x1080 @ 30fps", fov: "90° adjustable", zoom: "4x digital zoom", encoding: "H.264 hardware", connection: "USB-A", certifications: "Microsoft Teams, Zoom, Cisco Webex", privacy: "Privacy shutter" } },
    { name: "Razer Kiyo Pro Ultra 4K Webcam", slug: "razer-kiyo-pro-ultra-4k", description: "4K Sony STARVIS 2 webcam with adaptive light sensor and AI-powered background removal. Premium streaming quality for UAE creators.", price: 899, comparePrice: 1099, brandId: brandMap["Razer"], categoryId: catMap["peripherals"], sku: "RAZER-KIYO-PRO-ULTRA-4K", stock: 20, isFeatured: false, images: [IMG.webcam], specs: { resolution: "4K @ 24fps / 1080p @ 60fps", sensor: "Sony STARVIS 2 1/1.8\"", fov: "Adjustable 82-103°", autofocus: "Phase detect autofocus", connection: "USB-C", software: "Razer Synapse AI background removal" } },
    { name: "Anker USB-C 10-in-1 Hub Dock", slug: "anker-usbc-10in1-hub-dock", description: "USB-C hub with 4K HDMI, SD card reader, PD 100W and Gigabit Ethernet. Transforms any UAE laptop into a full desktop workstation.", price: 299, comparePrice: 399, brandId: brandMap["Anker"], categoryId: catMap["peripherals"], sku: "ANKER-A8383-10IN1-USBC", stock: 70, isFeatured: false, images: [IMG.usb_drive], specs: { ports: "4K HDMI, USB-C PD 100W, 2x USB-A 3.0, USB-C 3.0, SD, microSD, Gigabit Ethernet, 3.5mm Audio", connection: "USB-C", pdThrough: "100W Power Delivery" } },
    { name: "Dell KB216 USB Multimedia Keyboard", slug: "dell-kb216-usb-multimedia", description: "Reliable slim USB keyboard with quiet keys and multimedia shortcuts. Perfect budget keyboard for UAE offices and home desks.", price: 79, comparePrice: 119, brandId: brandMap["Dell"], categoryId: catMap["peripherals"], sku: "DELL-KB216-USB-BLK", stock: 150, isFeatured: false, images: [IMG.keyboard], specs: { connectivity: "USB-A", layout: "Full-size", keys: "104 keys with multimedia shortcuts", compatibility: "Windows", color: "Black" } },
    { name: "Logitech K380 Multi-Device Bluetooth Keyboard", slug: "logitech-k380-multi-device-bt", description: "Compact multi-device Bluetooth keyboard connecting up to 3 devices simultaneously. Perfect for UAE tablet and smartphone productivity on the go.", price: 199, comparePrice: 269, brandId: brandMap["Logitech"], categoryId: catMap["peripherals"], sku: "LOGI-K380-BT-3DEV", stock: 80, isFeatured: false, images: [IMG.keyboard], specs: { connectivity: "Bluetooth 3.0", multiDevice: "3 devices Easy-Switch", battery: "Up to 24 months", compatibility: "Windows, macOS, iOS, Android, ChromeOS", layout: "Compact (75%)" } },
    { name: "Corsair Scimitar RGB Elite Gaming Mouse", slug: "corsair-scimitar-rgb-elite", description: "MMO gaming mouse with 17 programmable buttons and 18000 DPI. Designed for UAE MMO and MOBA players who need more macros.", price: 349, comparePrice: 449, brandId: brandMap["Corsair"], categoryId: catMap["peripherals"], sku: "CORSAIR-SCIMITAR-RGB-ELITE", stock: 35, isFeatured: false, images: [IMG.mouse_gaming], specs: { connectivity: "USB-A wired", sensor: "PixArt PMW3391 (18000 DPI)", buttons: "17 programmable (12-button side panel)", sidePanel: "Adjustable slide system", weight: "131g", software: "iCUE" } },
    { name: "HP 280 Silent USB Mouse", slug: "hp-280-silent-usb-mouse", description: "Quiet click USB mouse for office use with 1200 DPI and ergonomic design. The silent, reliable mouse for UAE open-plan offices.", price: 69, comparePrice: 99, brandId: brandMap["HP"], categoryId: catMap["peripherals"], sku: "HP-280-SILENT-USB-BLK", stock: 200, isFeatured: false, images: [IMG.mouse], specs: { connectivity: "USB-A", dpi: "1200 DPI", buttons: "3 (silent left/right click)", compatibility: "Windows, macOS, Linux" } },
    { name: "SteelSeries QcK Prism XL Gaming Mousepad", slug: "steelseries-qck-prism-xl", description: "Extra-large dual-zone RGB gaming mousepad with smooth micro-woven surface. Desk-covering precision surface for UAE gaming setups.", price: 249, comparePrice: 329, brandId: brandMap["SteelSeries"], categoryId: catMap["peripherals"], sku: "SS-QCK-PRISM-XL-RGB", stock: 45, isFeatured: false, images: [IMG.keyboard_gaming], specs: { size: "900x300mm (XL)", surface: "Micro-woven cloth", base: "Non-slip rubber", rgb: "Dual-zone RGB (12 zones)", connection: "USB-A", compatibility: "SteelSeries GG software" } },

    // ── MORE PRINTERS ────────────────────────────────────────────────
    { name: "HP LaserJet Pro MFP M428fdw", slug: "hp-laserjet-pro-m428fdw", description: "Fast mono laser MFP with 38ppm, automatic duplex and WiFi. HP's best wireless all-in-one for UAE medium-sized offices.", price: 1499, comparePrice: 1799, brandId: brandMap["HP"], categoryId: catMap["printers"], sku: "HP-LJPM428FDW-MFP", stock: 25, isFeatured: true, images: [IMG.printer_laser], specs: { type: "Monochrome Laser MFP (Print, Scan, Copy, Fax)", speed: "38 ppm", resolution: "1200x1200 dpi", duplex: "Automatic", connectivity: "WiFi, Ethernet, USB", adf: "50-sheet ADF", monthly: "Up to 80,000 pages" } },
    { name: "Brother HL-L3270CDW Colour Laser", slug: "brother-hl-l3270cdw-colour", description: "Wireless colour laser printer with automatic duplex and 25ppm colour. Brother's top colour laser for UAE small offices wanting vibrant prints.", price: 1299, comparePrice: 1599, brandId: brandMap["Brother"], categoryId: catMap["printers"], sku: "BROTHER-HLL3270-COLOUR", stock: 22, isFeatured: false, images: [IMG.printer_laser], specs: { type: "Colour Laser Printer", speed: "25 ppm (mono & colour)", resolution: "2400x600 dpi", duplex: "Automatic", connectivity: "WiFi, Ethernet, USB", input: "250-sheet paper tray", monthly: "Up to 30,000 pages" } },
    { name: "HP Colour LaserJet Pro M255dw", slug: "hp-colour-laserjet-pro-m255dw", description: "Compact wireless colour laser printer with 21ppm. HP's accessible colour laser for UAE home offices needing professional colour output.", price: 999, comparePrice: 1299, brandId: brandMap["HP"], categoryId: catMap["printers"], sku: "HP-CLJPM255DW-COLOUR", stock: 30, isFeatured: false, images: [IMG.printer_laser], specs: { type: "Colour Laser Printer", speed: "21 ppm (mono & colour)", resolution: "600x600 dpi", connectivity: "WiFi, Ethernet, USB", input: "150-sheet tray", monthly: "Up to 40,000 pages" } },
    { name: "Epson EcoTank ET-4850 All-in-One", slug: "epson-ecotank-et4850-aio", description: "WiFi MFP with refillable ink tanks printing up to 14,000 mono pages per fill. Lowest running cost for UAE small offices with high print volume.", price: 799, comparePrice: 999, brandId: brandMap["Epson"], categoryId: catMap["printers"], sku: "EPSON-ET4850-ECOTANK-MFP", stock: 35, isFeatured: false, images: [IMG.printer_inkjet], specs: { type: "Colour Inkjet MFP (Print, Scan, Copy, Fax)", speed: "15 ipm mono / 8 ipm colour", resolution: "5760x1440 dpi", inkSystem: "EcoTank Refillable", yield: "14,000 mono / 11,200 colour pages", connectivity: "WiFi, Ethernet, USB" } },
    { name: "Canon MAXIFY GX6020 MegaTank", slug: "canon-maxify-gx6020-megatank", description: "High-volume refillable inkjet printer with 6000-page yield. Canon's best business inkjet for UAE companies printing hundreds of pages a day.", price: 999, comparePrice: 1299, brandId: brandMap["Canon"], categoryId: catMap["printers"], sku: "CANON-GX6020-MAXIFY", stock: 25, isFeatured: false, images: [IMG.printer_inkjet], specs: { type: "Colour Inkjet Printer", speed: "24 ipm mono / 15.5 ipm colour", resolution: "600x1200 dpi", inkSystem: "Refillable MegaTank", yield: "6000 mono / 14,000 colour pages", connectivity: "WiFi, Ethernet, USB" } },
    { name: "Brother MFC-L2750DW Mono Laser MFP", slug: "brother-mfc-l2750dw-mono", description: "High-speed mono laser MFP with 34ppm, fax and automatic duplex. Brother's best value wireless all-in-one for UAE small businesses.", price: 899, comparePrice: 1099, brandId: brandMap["Brother"], categoryId: catMap["printers"], sku: "BROTHER-MFCL2750-MONO-MFP", stock: 30, isFeatured: false, images: [IMG.printer_laser], specs: { type: "Monochrome Laser MFP (Print, Scan, Copy, Fax)", speed: "34 ppm", resolution: "1200x1200 dpi", duplex: "Automatic", connectivity: "WiFi, Ethernet, USB", adf: "50-sheet ADF" } },
    { name: "HP OfficeJet Pro 9015e All-in-One", slug: "hp-officejet-pro-9015e", description: "Smart HP+ inkjet MFP with automatic duplex and Smart Tasks for faster workflows. Excellent colour MFP for UAE small businesses needing fast colour output.", price: 749, comparePrice: 949, brandId: brandMap["HP"], categoryId: catMap["printers"], sku: "HP-OJP9015E-MFP-HPPLUS", stock: 35, isFeatured: false, images: [IMG.printer_inkjet], specs: { type: "Colour Inkjet MFP (Print, Scan, Copy, Fax)", speed: "22 ppm mono / 18 ppm colour", resolution: "4800x1200 dpi", duplex: "Automatic", connectivity: "WiFi, Ethernet, USB, HP+", adf: "35-sheet ADF" } },
    { name: "Epson WorkForce Pro WF-4830DTWF", slug: "epson-workforce-pro-wf4830", description: "Business inkjet MFP with RIPS and high-yield ink cartridges for low cost per page. Fast, quiet and connected for UAE office printing environments.", price: 1099, comparePrice: 1399, brandId: brandMap["Epson"], categoryId: catMap["printers"], sku: "EPSON-WF4830-WORKFORCE-MFP", stock: 20, isFeatured: false, images: [IMG.printer_inkjet], specs: { type: "Colour Inkjet MFP (Print, Scan, Copy, Fax)", speed: "25 ppm mono / 12 ppm colour", resolution: "4800x1200 dpi", duplex: "Automatic", connectivity: "WiFi, Ethernet, USB, WiFi Direct", adf: "50-sheet ADF" } },
    { name: "Canon i-SENSYS MF267dw II Laser MFP", slug: "canon-i-sensys-mf267dw-ii", description: "Compact A4 laser MFP with wireless printing and 28ppm. Canon's best value mono laser all-in-one for UAE home offices.", price: 799, comparePrice: 999, brandId: brandMap["Canon"], categoryId: catMap["printers"], sku: "CANON-MF267DW2-LASER-MFP", stock: 28, isFeatured: false, images: [IMG.printer_laser], specs: { type: "Monochrome Laser MFP (Print, Scan, Copy)", speed: "28 ppm", resolution: "600x600 dpi", duplex: "Automatic", connectivity: "WiFi, USB", input: "150-sheet tray" } },
    { name: "HP LaserJet Tank 1020w Mono Printer", slug: "hp-laserjet-tank-1020w", description: "High-yield mono laser with up to 5000-page toner and WiFi. HP's cartridge-free laser for UAE users who hate running out of toner.", price: 649, comparePrice: 849, brandId: brandMap["HP"], categoryId: catMap["printers"], sku: "HP-LJTTANK1020W-MONO", stock: 35, isFeatured: false, images: [IMG.printer_laser], specs: { type: "Monochrome Laser Printer", speed: "22 ppm", resolution: "600x600 dpi", connectivity: "WiFi, USB", inkSystem: "HP Toner Tank (5000 pages)", duplex: "Manual" } },
    { name: "Brother DCP-L3550CDW Colour Laser MFP", slug: "brother-dcp-l3550cdw-colour-mfp", description: "Wireless colour laser all-in-one with 19ppm and automatic duplex. Brother's accessible colour MFP for UAE small businesses and schools.", price: 1499, comparePrice: 1899, brandId: brandMap["Brother"], categoryId: catMap["printers"], sku: "BROTHER-DCPL3550-COLOUR-MFP", stock: 18, isFeatured: false, images: [IMG.printer_laser], specs: { type: "Colour Laser MFP (Print, Scan, Copy)", speed: "19 ppm (mono & colour)", resolution: "2400x600 dpi", duplex: "Automatic", connectivity: "WiFi, Ethernet, USB", input: "250-sheet tray" } },
    { name: "Lexmark MB2236adw Mono Laser MFP", slug: "lexmark-mb2236adw-mono-mfp", description: "Compact wireless mono laser MFP with 36ppm and security features. Lexmark's reliable office all-in-one for UAE businesses needing document security.", price: 849, comparePrice: 1049, brandId: brandMap["Brother"], categoryId: catMap["printers"], sku: "LEXMARK-MB2236ADW-MONO", stock: 20, isFeatured: false, images: [IMG.printer_laser], specs: { type: "Monochrome Laser MFP (Print, Scan, Copy, Fax)", speed: "36 ppm", resolution: "1200x1200 dpi", duplex: "Automatic", connectivity: "WiFi, Ethernet, USB", security: "PIN printing, Secure NFC" } },

    // ── MORE TABLETS ─────────────────────────────────────────────────
    { name: "Apple iPad Pro 13\" M4 Wi-Fi 256GB", slug: "apple-ipad-pro-13-m4-256", description: "The most advanced iPad with M4 chip and Ultra Retina XDR OLED tandem display. Unparalleled performance for UAE creative professionals.", price: 6499, comparePrice: 7199, brandId: brandMap["Apple"], categoryId: catMap["tablets"], sku: "APPLE-IPADPRO13-M4-256", stock: 18, isFeatured: true, images: [IMG.tablet_ipad], specs: { processor: "Apple M4 (9-core CPU)", ram: "8GB", storage: "256GB", display: '13" Ultra Retina XDR OLED 2752x2064 120Hz', camera: "12MP rear, 12MP ultra-wide TrueDepth front", battery: "Up to 10 hours", connectivity: "WiFi 6E, Bluetooth 5.3, USB-C (USB4)", os: "iPadOS 17" } },
    { name: "Apple iPad Air 13\" M2 Wi-Fi 256GB", slug: "apple-ipad-air-13-m2-256", description: "Larger iPad Air with M2 chip and 13-inch Liquid Retina display. The best all-round large tablet for UAE students and professionals.", price: 4299, comparePrice: 4899, brandId: brandMap["Apple"], categoryId: catMap["tablets"], sku: "APPLE-IPADAIR13-M2-256", stock: 25, isFeatured: false, images: [IMG.tablet_ipad], specs: { processor: "Apple M2 (8-core CPU)", ram: "8GB", storage: "256GB", display: '13" Liquid Retina 2732x2048', camera: "12MP rear, 12MP front", battery: "Up to 10 hours", connectivity: "WiFi 6E, Bluetooth 5.3, USB-C", os: "iPadOS 17" } },
    { name: "Apple iPad 10th Gen 64GB Wi-Fi", slug: "apple-ipad-10th-gen-64gb", description: "The everyday iPad with A14 Bionic chip and 10.9-inch Liquid Retina display. Perfect entry-level iPad for UAE students and casual users.", price: 1699, comparePrice: 1999, brandId: brandMap["Apple"], categoryId: catMap["tablets"], sku: "APPLE-IPAD10-64-WIFI", stock: 50, isFeatured: false, images: [IMG.tablet_ipad], specs: { processor: "Apple A14 Bionic", storage: "64GB", display: '10.9" Liquid Retina 2360x1640', camera: "12MP rear, 12MP ultra-wide front", battery: "Up to 10 hours", connectivity: "WiFi 6, Bluetooth 5.2, USB-C", os: "iPadOS 17" } },
    { name: "Apple iPad mini 7th Gen 128GB Wi-Fi", slug: "apple-ipad-mini-7th-gen-128", description: "Compact iPad mini with A17 Pro chip in an 8.3-inch ultra-portable design. The most portable premium tablet for UAE on-the-go users.", price: 2599, comparePrice: 2999, brandId: brandMap["Apple"], categoryId: catMap["tablets"], sku: "APPLE-IPADMINI7-128-WIFI", stock: 30, isFeatured: false, images: [IMG.tablet_ipad], specs: { processor: "Apple A17 Pro", storage: "128GB", display: '8.3" Liquid Retina 2266x1488', camera: "12MP rear, 12MP front", battery: "Up to 10 hours", connectivity: "WiFi 6E, Bluetooth 5.3, USB-C", os: "iPadOS 18" } },
    { name: "Samsung Galaxy Tab S9 Ultra 5G 256GB", slug: "samsung-galaxy-tab-s9-ultra-5g", description: "14.6-inch AMOLED flagship tablet with S Pen and 5G. Samsung's most powerful Android tablet for UAE power users who need maximum display real estate.", price: 5299, comparePrice: 5999, brandId: brandMap["Samsung"], categoryId: catMap["tablets"], sku: "SAMSUNG-TABS9-ULTRA-5G-256", stock: 15, isFeatured: true, images: [IMG.tablet_android], specs: { processor: "Snapdragon 8 Gen 2", ram: "12GB", storage: "256GB (expandable)", display: '14.6" Dynamic AMOLED 2960x1848 120Hz', battery: "11200 mAh, 45W fast charge", camera: "13MP+8MP rear, 12MP+12MP front", stylus: "S Pen included", connectivity: "5G, WiFi 6E" } },
    { name: "Samsung Galaxy Tab A9+ Wi-Fi 64GB", slug: "samsung-galaxy-tab-a9-plus-wifi", description: "Budget 11-inch Android tablet with Snapdragon 695 and 90Hz display. Excellent value for UAE students and casual users wanting a big-screen tablet.", price: 999, comparePrice: 1299, brandId: brandMap["Samsung"], categoryId: catMap["tablets"], sku: "SAMSUNG-TABA9P-64-WIFI", stock: 55, isFeatured: false, images: [IMG.tablet_android], specs: { processor: "Snapdragon 695", ram: "4GB", storage: "64GB (expandable)", display: '11" TFT LCD 1920x1200 90Hz', battery: "7040 mAh, 15W fast charge", camera: "8MP rear, 5MP front", connectivity: "WiFi 5, Bluetooth 5.3" } },
    { name: "Lenovo Tab P12 Pro 12.6\" AMOLED", slug: "lenovo-tab-p12-pro-amoled", description: "12.6-inch AMOLED 2K Android tablet with Snapdragon 870 and keyboard cover support. Lenovo's premium productivity tablet for UAE professionals.", price: 2499, comparePrice: 2999, brandId: brandMap["Lenovo"], categoryId: catMap["tablets"], sku: "LNV-TABP12PRO-12-256", stock: 20, isFeatured: false, images: [IMG.tablet_android], specs: { processor: "Snapdragon 870", ram: "8GB", storage: "256GB", display: '12.6" AMOLED 2560x1600 120Hz', battery: "10200 mAh, 45W", camera: "13MP rear, 8MP front", stylus: "Lenovo Precision Pen 3 (optional)", connectivity: "WiFi 6, Bluetooth 5.2" } },
    { name: "Lenovo Tab M11 4G LTE 128GB", slug: "lenovo-tab-m11-4g-128", description: "Affordable 11-inch Android tablet with 4G LTE and MediaTek Helio G88. Budget-friendly connected tablet for UAE families and students.", price: 849, comparePrice: 1099, brandId: brandMap["Lenovo"], categoryId: catMap["tablets"], sku: "LNV-TABM11-4G-128", stock: 40, isFeatured: false, images: [IMG.tablet_android], specs: { processor: "MediaTek Helio G88", ram: "4GB", storage: "128GB (expandable)", display: '11" IPS 1920x1200 90Hz', battery: "7040 mAh, 20W", camera: "8MP rear, 8MP front", connectivity: "4G LTE, WiFi 5, Bluetooth 5.1" } },
    { name: "Huawei MatePad 11.5 Wi-Fi 128GB", slug: "huawei-matepad-11-5-wifi-128", description: "11.5-inch IPS display tablet with Snapdragon 7 Gen 1 and HarmonyOS. Huawei's best mid-range tablet for UAE productivity and entertainment.", price: 1499, comparePrice: 1799, brandId: brandMap["Lenovo"], categoryId: catMap["tablets"], sku: "HUAWEI-MATEPAD115-128", stock: 25, isFeatured: false, images: [IMG.tablet_android], specs: { processor: "Snapdragon 7 Gen 1", ram: "6GB", storage: "128GB (expandable)", display: '11.5" IPS 2200x1440 144Hz', battery: "7700 mAh, 22.5W", camera: "13MP rear, 8MP front", os: "HarmonyOS 4", connectivity: "WiFi 6, Bluetooth 5.1" } },
    { name: "Microsoft Surface Go 4 Intel N200", slug: "microsoft-surface-go-4-intel-n200", description: "Compact 10.5-inch Windows 11 tablet with Intel N200 processor. The most portable Windows experience for UAE students and light users.", price: 1999, comparePrice: 2499, brandId: brandMap["Microsoft"], categoryId: catMap["tablets"], sku: "MS-SG4-N200-8-256", stock: 22, isFeatured: false, images: [IMG.tablet_surface], specs: { processor: "Intel N200", ram: "8GB", storage: "256GB SSD", display: '10.5" PixelSense 1920x1280 60Hz', battery: "Up to 10 hours", camera: "10MP rear, 5MP front", connectivity: "WiFi 6, Bluetooth 5.1, USB-C", os: "Windows 11 Home S Mode" } },
    { name: "Amazon Fire HD 10 Plus 64GB", slug: "amazon-fire-hd10-plus-64gb", description: "10-inch Full HD tablet with 4GB RAM and wireless charging. Amazon's most capable Fire tablet for UAE media consumption at an accessible price.", price: 549, comparePrice: 699, brandId: brandMap["Anker"], categoryId: catMap["tablets"], sku: "AMAZON-FIREHD10-PLUS-64", stock: 45, isFeatured: false, images: [IMG.tablet_android], specs: { processor: "Octa-core 2.0 GHz", ram: "4GB", storage: "64GB (expandable)", display: '10.1" IPS FHD 1920x1200', battery: "Up to 12 hours", camera: "5MP rear, 2MP front", charging: "Wireless charging (15W)", connectivity: "WiFi 5, Bluetooth 5.0" } },
    { name: "Xiaomi Pad 6 Pro 128GB Wi-Fi", slug: "xiaomi-pad-6-pro-128-wifi", description: "High-performance 11-inch Android tablet with Snapdragon 8+ Gen 1 and 144Hz display. Xiaomi's flagship tablet offering great specs-for-money in the UAE.", price: 1699, comparePrice: 1999, brandId: brandMap["Samsung"], categoryId: catMap["tablets"], sku: "XIAOMI-PAD6PRO-128", stock: 30, isFeatured: false, images: [IMG.tablet_android], specs: { processor: "Snapdragon 8+ Gen 1", ram: "8GB", storage: "128GB", display: '11" IPS 2880x1800 144Hz', battery: "8600 mAh, 67W fast charge", camera: "50MP rear, 20MP front", connectivity: "WiFi 6E, Bluetooth 5.3" } },

    // ── EXTRA LAPTOPS ─────────────────────────────────────────────────
    { name: "Dell Vostro 3530 15\" Business", slug: "dell-vostro-3530-15-business", description: "Affordable business laptop with Intel Core i5, 8GB RAM and 256GB SSD. Dell's entry-level business laptop for UAE SMBs on a tight budget.", price: 1899, comparePrice: 2399, brandId: brandMap["Dell"], categoryId: catMap["laptops"], sku: "DELL-VOS3530-I5-8-256", stock: 45, isFeatured: false, images: [IMG.laptop_hp], specs: { processor: "Intel Core i5-1334U", ram: "8GB DDR4", storage: "256GB SSD", display: '15.6" FHD IPS 1920x1080', graphics: "Intel Iris Xe", battery: "Up to 10 hours", weight: "1.77 kg", os: "Windows 11 Pro" } },
    { name: "ASUS ExpertBook B1 14\" Business", slug: "asus-expertbook-b1-14-business", description: "MIL-SPEC certified business laptop with Intel Core i5 and 12-hour battery. ASUS's durable corporate laptop for UAE field workers.", price: 2099, comparePrice: 2599, brandId: brandMap["ASUS"], categoryId: catMap["laptops"], sku: "ASUS-EB1-I5-8-512", stock: 35, isFeatured: false, images: [IMG.laptop_business2], specs: { processor: "Intel Core i5-1235U", ram: "8GB DDR4", storage: "512GB SSD", display: '14" FHD IPS 1920x1080', graphics: "Intel Iris Xe", battery: "Up to 12 hours", weight: "1.45 kg", os: "Windows 11 Pro" } },
    { name: "Lenovo ThinkPad L14 Gen 4 AMD", slug: "lenovo-thinkpad-l14-gen4-amd", description: "Mid-range AMD business laptop with Ryzen 5, 16GB RAM and MIL-SPEC durability. Reliable value-focused ThinkPad for UAE businesses.", price: 2399, comparePrice: 2899, brandId: brandMap["Lenovo"], categoryId: catMap["laptops"], sku: "LNV-L14G4-R5-16-512", stock: 28, isFeatured: false, images: [IMG.laptop_business], specs: { processor: "AMD Ryzen 5 PRO 7530U", ram: "16GB DDR4", storage: "512GB SSD", display: '14" FHD IPS 1920x1080', graphics: "AMD Radeon 610M", battery: "Up to 12 hours", weight: "1.57 kg", os: "Windows 11 Pro" } },
    { name: "HP 240 G9 14\" Laptop", slug: "hp-240-g9-14-laptop", description: "Compact entry-level laptop with Intel Core i3, 8GB RAM and 256GB SSD. HP's most affordable Windows 11 laptop for UAE students.", price: 1299, comparePrice: 1699, brandId: brandMap["HP"], categoryId: catMap["laptops"], sku: "HP-240G9-I3-8-256", stock: 60, isFeatured: false, images: [IMG.laptop_thin], specs: { processor: "Intel Core i3-1215U", ram: "8GB DDR4", storage: "256GB SSD", display: '14" FHD SVA 1920x1080', graphics: "Intel UHD", battery: "Up to 9 hours", weight: "1.47 kg", os: "Windows 11 Home" } },
    { name: "Apple MacBook Air 15\" M3", slug: "apple-macbook-air-15-m3", description: "Larger MacBook Air with M3 chip, 15.3-inch Liquid Retina display and 18-hour battery. The ultimate big-screen ultrabook for UAE professionals.", price: 6299, comparePrice: 6999, brandId: brandMap["Apple"], categoryId: catMap["laptops"], sku: "APPLE-MBA15-M3-8-256", stock: 22, isFeatured: true, images: [IMG.macbook_air], specs: { processor: "Apple M3 (8-core CPU)", ram: "8GB Unified Memory", storage: "256GB SSD", display: '15.3" Liquid Retina 2880x1864', graphics: "10-core GPU", battery: "Up to 18 hours", weight: "1.51 kg", os: "macOS Sequoia" } },

    // ── EXTRA GAMING ─────────────────────────────────────────────────
    { name: "Gigabyte AORUS 15 BKF RTX 4070", slug: "gigabyte-aorus-15-bkf-rtx4070", description: "15-inch QHD 165Hz gaming laptop with Intel Core i7 and RTX 4070. Gigabyte's competitive price gaming laptop for UAE mid-range buyers.", price: 5199, comparePrice: 5999, brandId: brandMap["Gigabyte"], categoryId: catMap["gaming"], sku: "GIGABYTE-AORUS15-I7-16-4070", stock: 16, isFeatured: false, images: [IMG.laptop_gaming2], specs: { processor: "Intel Core i7-13700H", ram: "16GB DDR5", storage: "1TB SSD", display: '15.6" QHD IPS 2560x1440 165Hz', graphics: "NVIDIA GeForce RTX 4070 8GB", battery: "Up to 5 hours", weight: "2.1 kg", os: "Windows 11 Home" } },
    { name: "Acer Aspire Vero 15 Eco Laptop", slug: "acer-aspire-vero-15-eco", description: "Sustainable laptop built from recycled materials with Intel Core i7 and 1TB SSD. Eco-conscious computing for UAE sustainability-minded professionals.", price: 3199, comparePrice: 3799, brandId: brandMap["Acer"], categoryId: catMap["laptops"], sku: "ACER-AV15-ECO-I7-16-1TB", stock: 20, isFeatured: false, images: [IMG.laptop_business2], specs: { processor: "Intel Core i7-1255U", ram: "16GB DDR4", storage: "1TB SSD", display: '15.6" FHD IPS 1920x1080', graphics: "Intel Iris Xe", battery: "Up to 10 hours", weight: "1.8 kg", os: "Windows 11 Home" } },

    // ── EXTRA DESKTOPS ───────────────────────────────────────────────
    { name: "Lenovo ThinkStation P360 Tower Workstation", slug: "lenovo-thinkstation-p360-tower", description: "Intel Core i9 workstation with ECC memory support and ISV certifications. Professional CAD/BIM workstation for UAE engineering firms.", price: 8999, comparePrice: 10499, brandId: brandMap["Lenovo"], categoryId: catMap["desktops"], sku: "LNV-P360-I9-32-1TB-RTX", stock: 8, isFeatured: false, images: [IMG.desktop_pc], specs: { processor: "Intel Core i9-12900K", ram: "32GB ECC DDR5", storage: "1TB SSD", graphics: "NVIDIA RTX A2000 12GB", formFactor: "Tower", certification: "ISV (AutoCAD, SolidWorks)", os: "Windows 11 Pro" } },
    { name: "HP Z2 Tower G9 Workstation", slug: "hp-z2-tower-g9-workstation", description: "Intel Core i7 entry workstation with ECC support and HP Remote Management. UAE engineering desktop for AutoCAD and Revit professionals.", price: 6999, comparePrice: 8199, brandId: brandMap["HP"], categoryId: catMap["desktops"], sku: "HP-Z2G9-I7-16-512-ECC", stock: 10, isFeatured: false, images: [IMG.desktop_pc], specs: { processor: "Intel Core i7-12700", ram: "16GB ECC DDR5", storage: "512GB SSD", graphics: "NVIDIA T600 4GB", formFactor: "Tower", certification: "ISV certified", os: "Windows 11 Pro" } },

    // ── EXTRA PC COMPONENTS ──────────────────────────────────────────
    { name: "Gigabyte B660M DS3H DDR4 mATX Motherboard", slug: "gigabyte-b660m-ds3h-ddr4", description: "Budget Intel LGA1700 mATX motherboard with DDR4 and PCIe 4.0. The most affordable upgrade board for UAE 12th/13th gen Intel builds.", price: 399, comparePrice: 549, brandId: brandMap["Gigabyte"], categoryId: catMap["pc-components"], sku: "GIGABYTE-B660M-DS3H-DDR4", stock: 50, isFeatured: false, images: [IMG.motherboard], specs: { socket: "LGA1700", chipset: "Intel B660", formFactor: "mATX", memorySlots: "2x DDR4 (max 64GB)", pcie: "PCIe 4.0 x16, PCIe 3.0 M.2", ports: "4x USB-A 3.0, HDMI, DP" } },
    { name: "Corsair RM850x Gold Fully Modular PSU", slug: "corsair-rm850x-gold-850w", description: "850W fully modular 80+ Gold PSU with zero RPM fan mode. Corsair's premium quiet power supply for UAE high-end gaming builds.", price: 599, comparePrice: 749, brandId: brandMap["Corsair"], categoryId: catMap["pc-components"], sku: "CORSAIR-RM850X-GOLD-FULL", stock: 35, isFeatured: false, images: [IMG.psu], specs: { wattage: "850W", efficiency: "80+ Gold", modular: "Fully Modular", fanMode: "Zero RPM Fan Mode below 40% load", protections: "OVP, OCP, OTP, SCP", warranty: "10 years" } },
    { name: "be quiet! Pure Rock 2 FX CPU Cooler", slug: "be-quiet-pure-rock-2-fx-cooler", description: "160W rated tower CPU cooler with ARGB fan and 4 heat pipes. Quiet, effective cooling for UAE mid-range builds without water cooling.", price: 199, comparePrice: 279, brandId: brandMap["Cooler Master"], categoryId: catMap["pc-components"], sku: "BEQUIET-PUREROCK2FX-ARGB", stock: 55, isFeatured: false, images: [IMG.cpu], specs: { tdp: "160W rated", heatPipes: "4 copper heat pipes", fans: "1x 120mm ARGB", compatibility: "Intel LGA1700/1200/115x, AMD AM5/AM4", height: "155mm", noise: "Up to 26.8 dBA" } },
    { name: "Kingston A400 480GB SATA SSD", slug: "kingston-a400-480gb-sata", description: "Budget SATA SSD with 500 MB/s reads for massive laptop and desktop upgrades. The most cost-effective SSD for UAE users replacing mechanical drives.", price: 149, comparePrice: 219, brandId: brandMap["Kingston"], categoryId: catMap["pc-components"], sku: "KINGSTON-A400-480GB-SATA", stock: 120, isFeatured: false, images: [IMG.ssd], specs: { type: "2.5\" SATA III SSD", capacity: "480GB", readSpeed: "500 MB/s", writeSpeed: "450 MB/s", formFactor: '2.5"', warranty: "3 years" } },
    { name: "Crucial Ballistix 16GB DDR4 3200MHz RAM", slug: "crucial-ballistix-16gb-ddr4-3200", description: "16GB DDR4 gaming memory with XMP 2.0 and aluminium heat spreader. Reliable, affordable RAM for UAE AMD and Intel budget gaming builds.", price: 159, comparePrice: 219, brandId: brandMap["Crucial"], categoryId: catMap["pc-components"], sku: "CRUCIAL-BLLT-16GB-DDR4-3200", stock: 90, isFeatured: false, images: [IMG.ram], specs: { type: "DDR4 DIMM", capacity: "16GB (1x16GB)", speed: "3200MHz", latency: "CL16", voltage: "1.35V", profile: "Intel XMP 2.0" } },

    // ── EXTRA NETWORKING ─────────────────────────────────────────────
    { name: "TP-Link EAP670 AX3600 WiFi 6 Access Point", slug: "tp-link-eap670-ax3600-wifi6", description: "Ceiling-mount WiFi 6 access point with 4x4 MU-MIMO and PoE+. Scalable enterprise WiFi for UAE hotels, offices and hospitality venues.", price: 599, comparePrice: 799, brandId: brandMap["TP-Link"], categoryId: catMap["networking"], sku: "TP-EAP670-AX3600-POE", stock: 30, isFeatured: false, images: [IMG.ap], specs: { standard: "WiFi 6 (802.11ax)", speed: "AX3600 (574+2402 Mbps)", spatial: "4x4 MU-MIMO", poe: "PoE+ (802.3at)", coverage: "Up to 200m²", management: "Omada Controller", clients: "Up to 150" } },
    { name: "Netgear Orbi RBK863S AX6000 Mesh 2-Pack", slug: "netgear-orbi-rbk863s-ax6000-2pack", description: "Tri-band AX6000 mesh WiFi 6 system with dedicated backhaul for 6Gbps speeds. The premium mesh solution for large UAE villas.", price: 2199, comparePrice: 2699, brandId: brandMap["Netgear"], categoryId: catMap["networking"], sku: "NETGEAR-RBK863S-AX6000", stock: 12, isFeatured: false, images: [IMG.router], specs: { standard: "WiFi 6 (802.11ax)", speed: "AX6000 (1200+1200+4800 Mbps)", bands: "Tri-Band", coverage: "Up to 700m² (2 nodes)", backhaul: "4.8 Gbps dedicated 5GHz", ports: "2.5G + 1G WAN per node" } },
    { name: "TP-Link Tapo C320WS Outdoor Security Camera", slug: "tp-link-tapo-c320ws-outdoor", description: "Outdoor IP67 security camera with 4MP 2K+ resolution and colour night vision. Easy-install connected camera for UAE homes and businesses.", price: 149, comparePrice: 199, brandId: brandMap["TP-Link"], categoryId: catMap["networking"], sku: "TP-TAPO-C320WS-4MP", stock: 80, isFeatured: false, images: [IMG.ap], specs: { resolution: "4MP 2K+ (2560x1440)", nightVision: "Full-colour Starlight", protection: "IP67 weatherproof", storage: "MicroSD (up to 512GB) / Cloud", connectivity: "WiFi 5 (2.4/5GHz)", detection: "Person, vehicle, pet AI detection" } },

    // ── EXTRA PERIPHERALS ────────────────────────────────────────────
    { name: "Logitech MX Mechanical Mini Wireless Keyboard", slug: "logitech-mx-mechanical-mini-wireless", description: "Compact wireless mechanical keyboard with smart backlighting and multi-device pairing. Logitech's premium quiet mechanical for UAE office use.", price: 549, comparePrice: 699, brandId: brandMap["Logitech"], categoryId: catMap["peripherals"], sku: "LOGI-MXMECH-MINI-WL", stock: 35, isFeatured: false, images: [IMG.keyboard], specs: { connectivity: "Bluetooth + USB Receiver", switches: "Kailh Choc V2 (Low Profile Tactile)", backlighting: "Smart backlight proximity sensing", battery: "Up to 10 days", multiDevice: "Up to 3 devices", layout: "75% compact" } },
    { name: "Logitech G502 X Plus Wireless Gaming Mouse", slug: "logitech-g502x-plus-wireless", description: "Precision wireless gaming mouse with LIGHTFORCE hybrid optical-mechanical switches and LIGHTSYNC RGB. Logitech's top ergonomic gaming mouse.", price: 649, comparePrice: 799, brandId: brandMap["Logitech"], categoryId: catMap["peripherals"], sku: "LOGI-G502X-PLUS-WL-RGB", stock: 30, isFeatured: false, images: [IMG.mouse_gaming], specs: { connectivity: "LIGHTSPEED Wireless + USB-C", sensor: "HERO 25K (100-25600 DPI)", weight: "106g", battery: "Up to 130 hours (no RGB)", buttons: "13 programmable", switches: "LIGHTFORCE hybrid" } },
    { name: "Jabra Evolve2 40 USB-C Headset", slug: "jabra-evolve2-40-usbc", description: "Professional wired headset with 3-microphone call technology and passive noise isolation. Microsoft Teams certified for UAE remote workers.", price: 499, comparePrice: 649, brandId: brandMap["Logitech"], categoryId: catMap["peripherals"], sku: "JABRA-EV2-40-USBC-MS", stock: 40, isFeatured: false, images: [IMG.headset], specs: { connectivity: "USB-C", microphones: "3-mic call technology", isolation: "Passive noise isolation", certification: "Microsoft Teams, Zoom", weight: "162g (mono), 175g (stereo)", frequency: "20Hz–20kHz" } },
    { name: "Sony WH-1000XM5 Wireless Headphones", slug: "sony-wh1000xm5-wireless", description: "Industry-leading noise cancellation with 30-hour battery and multipoint connection. The premium work-from-home headphones for UAE professionals.", price: 1399, comparePrice: 1699, brandId: brandMap["Samsung"], categoryId: catMap["peripherals"], sku: "SONY-WH1000XM5-WL-ANC", stock: 28, isFeatured: true, images: [IMG.headset], specs: { connectivity: "Bluetooth 5.2, USB-C", anc: "Industry-leading ANC (8 mics)", battery: "Up to 30 hours with ANC", multipoint: "2 devices simultaneously", codecs: "LDAC, AAC, SBC", weight: "250g" } },
    { name: "Belkin 6-Port USB-C GaN Charger 140W", slug: "belkin-6port-usbc-gan-140w", description: "Multi-port USB-C/USB-A GaN wall charger with 140W total output. Charge multiple UAE devices simultaneously with one compact adapter.", price: 299, comparePrice: 399, brandId: brandMap["Belkin"], categoryId: catMap["peripherals"], sku: "BELKIN-GAN-6PORT-140W", stock: 60, isFeatured: false, images: [IMG.usb_drive], specs: { ports: "3x USB-C (140W/100W/30W), 3x USB-A (12W each)", totalPower: "140W", technology: "GaN III", compatibility: "MacBook Pro, iPad, iPhone, Android, laptops", formFactor: "Desktop charging station" } },
    { name: "Anker 737 GaNPrime 120W USB-C Charger", slug: "anker-737-ganprime-120w", description: "Compact 3-port 120W GaN charger with Active Shield thermal protection. Charge a laptop, tablet and phone simultaneously in the UAE.", price: 249, comparePrice: 329, brandId: brandMap["Anker"], categoryId: catMap["peripherals"], sku: "ANKER-737-GAN120W-3PORT", stock: 75, isFeatured: false, images: [IMG.usb_drive], specs: { ports: "2x USB-C (100W+20W), 1x USB-A (20W)", totalPower: "120W", technology: "GaNPrime", display: "Power display screen", protection: "ActiveShield 2.0 temperature control" } },
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

  // ── Banners ──────────────────────────────────────────────────────────
  const bannerData = [
    {
      title: "Summer Tech Sale — Up to 30% Off",
      subtitle: "Laptops, monitors, gaming rigs, components & more — authentic products with UAE warranty. Free delivery on every order.",
      ctaText: "Shop the Sale",
      ctaLink: "/products?featured=true",
      image: null,
      bgFrom: "#072654",
      bgTo: "#0a3d7a",
      isActive: true,
      sortOrder: 0,
    },
    {
      title: "Level Up Your Setup",
      subtitle: "Discover the latest gaming laptops, PCs, monitors, and peripherals from ASUS ROG, MSI, Corsair and more.",
      ctaText: "Explore Gaming",
      ctaLink: "/products?category=gaming",
      image: null,
      bgFrom: "#0a1a3a",
      bgTo: "#1a0a3a",
      isActive: true,
      sortOrder: 1,
    },
    {
      title: "Free UAE-Wide Delivery",
      subtitle: "Same-day delivery in Dubai. Next-day across the UAE. On all orders over AED 199 — no minimum for gaming & laptops.",
      ctaText: "Browse Products",
      ctaLink: "/products",
      image: null,
      bgFrom: "#004e8c",
      bgTo: "#072654",
      isActive: true,
      sortOrder: 2,
    },
  ]

  for (const banner of bannerData) {
    await db.banner.upsert({
      where: { id: `seed-banner-${banner.sortOrder}` },
      update: {},
      create: { id: `seed-banner-${banner.sortOrder}`, ...banner },
    })
  }
  console.log("✅ 3 hero banners seeded")

  console.log("\n🎉 Database seeded successfully!")
  console.log("\nAdmin login: admin@quickcart.ae / Admin@123")
  console.log("Customer login: customer@example.com / Customer@123")
}

main()
  .catch(console.error)
  .finally(async () => { await db.$disconnect() })
