import { seedProducts } from '../seed';
import type { Product } from './types';

const products = new Map<string, Product>(seedProducts.map((p) => [p.id, p]));
let nextId = seedProducts.length + 1;

export function listProducts(): Product[] {
  return Array.from(products.values()).sort((a, b) => Number(a.id) - Number(b.id));
}

export function getProduct(id: string): Product | undefined {
  return products.get(id);
}

export function createProduct(input: Omit<Product, 'id'>): Product {
  const id = String(nextId++);
  const product: Product = { id, ...input };
  products.set(id, product);
  return product;
}

export function updateProduct(id: string, patch: Partial<Omit<Product, 'id'>>): Product | undefined {
  const existing = products.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...patch };
  products.set(id, updated);
  return updated;
}

export function deleteProduct(id: string): boolean {
  return products.delete(id);
}

export function countLowStock(): number {
  return Array.from(products.values()).filter((p) => p.stock <= 10).length;
}

export function totalSkus(): number {
  return products.size;
}
