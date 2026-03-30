export interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  imageUrl: string | null;
  brand: string | null;
  model: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  website: string;
  rating: number;
  reliability: number;
  avgDeliveryDays: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Price {
  id: string;
  productId: string;
  vendorId: string;
  price: number;
  url: string;
  inStock: boolean;
  scrapedAt: string;
  product: Product;
  vendor: Vendor;
}

export interface VendorWithDetails extends Vendor {
  budgetEntries: (BudgetEntry & { product: Product | null })[];
  _count: { prices: number };
}

export interface VendorWithCount extends Vendor {
  _count: { prices: number; budgetEntries: number };
}

export interface BudgetStats {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  byCategory: Record<string, number>;
  byQuarter: Record<string, number>;
}

export interface BudgetEntry {
  id: string;
  productId: string | null;
  vendorId: string | null;
  category: string;
  amount: number;
  quantity: number;
  description: string;
  purchaseDate: string;
  quarter: string;
  year: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  product?: Product | null;
  vendor?: Vendor | null;
}
