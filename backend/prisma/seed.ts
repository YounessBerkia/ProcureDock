import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Vendors
  const alternate = await prisma.vendor.upsert({
    where: { id: 'vendor-alternate' },
    update: {},
    create: {
      id: 'vendor-alternate',
      name: 'Alternate',
      website: 'https://www.alternate.de',
      rating: 4.5,
      reliability: 92,
      avgDeliveryDays: 2,
    },
  });

  const cyberport = await prisma.vendor.upsert({
    where: { id: 'vendor-cyberport' },
    update: {},
    create: {
      id: 'vendor-cyberport',
      name: 'Cyberport',
      website: 'https://www.cyberport.de',
      rating: 4.2,
      reliability: 88,
      avgDeliveryDays: 3,
    },
  });

  const notebooksbilliger = await prisma.vendor.upsert({
    where: { id: 'vendor-nbilliger' },
    update: {},
    create: {
      id: 'vendor-nbilliger',
      name: 'Notebooksbilliger',
      website: 'https://www.notebooksbilliger.de',
      rating: 4.0,
      reliability: 85,
      avgDeliveryDays: 3,
    },
  });

  // Products
  const dell = await prisma.product.upsert({
    where: { id: 'product-dell-5540' },
    update: {},
    create: {
      id: 'product-dell-5540',
      name: 'Dell Latitude 5540',
      category: 'laptop',
      brand: 'Dell',
      model: 'Latitude 5540',
      description: '15.6" Business-Laptop, Intel Core i5-1335U, 16GB RAM, 512GB SSD',
    },
  });

  const hp = await prisma.product.upsert({
    where: { id: 'product-hp-prodesk' },
    update: {},
    create: {
      id: 'product-hp-prodesk',
      name: 'HP ProDesk 400 G9',
      category: 'desktop',
      brand: 'HP',
      model: 'ProDesk 400 G9',
      description: 'Mini-PC, Intel Core i5-12500T, 8GB RAM, 256GB SSD',
    },
  });

  const philips = await prisma.product.upsert({
    where: { id: 'product-philips-monitor' },
    update: {},
    create: {
      id: 'product-philips-monitor',
      name: 'Philips 27" Monitor 272B1G',
      category: 'monitor',
      brand: 'Philips',
      model: '272B1G',
      description: '27" IPS Monitor, Full HD, 75Hz, USB-C',
    },
  });

  // Prices (8 entries as mentioned in Anweisungen.md)
  const now = new Date();
  const prices = [
    { id: 'price-1', productId: dell.id, vendorId: alternate.id, price: 1299.0, url: 'https://www.alternate.de/dell-latitude-5540', inStock: true, scrapedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
    { id: 'price-2', productId: dell.id, vendorId: cyberport.id, price: 1319.0, url: 'https://www.cyberport.de/dell-latitude-5540', inStock: true, scrapedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
    { id: 'price-3', productId: dell.id, vendorId: notebooksbilliger.id, price: 1289.0, url: 'https://www.notebooksbilliger.de/dell-latitude-5540', inStock: false, scrapedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'price-4', productId: dell.id, vendorId: alternate.id, price: 1349.0, url: 'https://www.alternate.de/dell-latitude-5540', inStock: true, scrapedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
    { id: 'price-5', productId: hp.id, vendorId: cyberport.id, price: 849.5, url: 'https://www.cyberport.de/hp-prodesk-400', inStock: true, scrapedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
    { id: 'price-6', productId: hp.id, vendorId: alternate.id, price: 869.0, url: 'https://www.alternate.de/hp-prodesk-400', inStock: true, scrapedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
    { id: 'price-7', productId: philips.id, vendorId: alternate.id, price: 249.0, url: 'https://www.alternate.de/philips-272b1g', inStock: true, scrapedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
    { id: 'price-8', productId: philips.id, vendorId: notebooksbilliger.id, price: 239.0, url: 'https://www.notebooksbilliger.de/philips-272b1g', inStock: true, scrapedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) },
  ];

  for (const priceData of prices) {
    await prisma.price.upsert({
      where: { id: priceData.id },
      update: {},
      create: priceData,
    });
  }

  // BudgetEntries
  const budgetEntries = [
    {
      id: 'budget-1',
      productId: dell.id,
      vendorId: alternate.id,
      category: 'hardware',
      amount: 1299.0,
      quantity: 5,
      description: '5x Dell Latitude 5540 für IT-Abteilung',
      purchaseDate: new Date('2026-01-15'),
      quarter: 'Q1-2026',
      year: 2026,
      status: 'delivered',
    },
    {
      id: 'budget-2',
      productId: hp.id,
      vendorId: cyberport.id,
      category: 'hardware',
      amount: 849.5,
      quantity: 3,
      description: '3x HP ProDesk 400 für Buchhaltung',
      purchaseDate: new Date('2026-02-10'),
      quarter: 'Q1-2026',
      year: 2026,
      status: 'ordered',
    },
    {
      id: 'budget-3',
      productId: null,
      vendorId: null,
      category: 'software',
      amount: 5000.0,
      quantity: 1,
      description: 'Microsoft 365 Business Premium Lizenzen (20 User)',
      purchaseDate: new Date('2026-03-01'),
      quarter: 'Q1-2026',
      year: 2026,
      status: 'approved',
    },
  ];

  for (const entry of budgetEntries) {
    await prisma.budgetEntry.upsert({
      where: { id: entry.id },
      update: {},
      create: entry,
    });
  }

  console.log('✅ Seed data inserted successfully');
  console.log(`   Vendors: ${[alternate, cyberport, notebooksbilliger].length}`);
  console.log(`   Products: ${[dell, hp, philips].length}`);
  console.log(`   Prices: ${prices.length}`);
  console.log(`   BudgetEntries: ${budgetEntries.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
