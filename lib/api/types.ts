export type Role = 'ADMIN';
export type MovementType = 'IN' | 'OUT';
export type ProductStatus = 'ACTIVE' | 'LOW_STOCK' | 'INACTIVE';

export interface ApiUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: ApiUser;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category: string;
  price: string;
  cost: string;
  stock: number;
  minStock: number;
  status: ProductStatus;
  imageUrl: string | null;
  providerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  id: string;
  name: string;
  contact: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Movement {
  id: string;
  type: MovementType;
  quantity: number;
  reason: string | null;
  createdAt: string;
  productId: string;
  userId: string | null;
  product?: { id: string; sku: string; name: string };
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}

export interface DashboardKpis {
  totalSkus: number;
  lowStockCount: number;
  ordersToday: number;
  movementsToday: { in: number; out: number };
  inventoryValue: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  unitsOut: number;
}

export interface CategoryBreakdown {
  category: string;
  skuCount: number;
  stockUnits: number;
  inventoryValue: number;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
  code?: string;
}
