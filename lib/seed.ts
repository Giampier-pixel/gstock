import type { Product, Movement, Provider } from './store/types';

export const seedProducts: Product[] = [
  { id: '1', name: 'Camiseta Polo M', stock: 142, category: 'Ropa', value: '2,840' },
  { id: '2', name: 'Pantalón Cargo L', stock: 8, category: 'Ropa', value: '480' },
  { id: '3', name: 'Zapatilla Runner S', stock: 67, category: 'Calzado', value: '5,360' },
  { id: '4', name: 'Mochila Urbana', stock: 31, category: 'Accesorios', value: '1,550' },
  { id: '5', name: 'Buzo Oversize M', stock: 55, category: 'Ropa', value: '3,300' },
  { id: '6', name: 'Cinturón Cuero', stock: 4, category: 'Accesorios', value: '200' },
];

export const seedProviders: Provider[] = [
  { id: 'P001', name: 'Empaques Globales S.A.', contact: 'Carlos Diaz', email: 'ventas@empaques.com', phone: '+51 987 654 321', status: 'Activo' },
  { id: 'P002', name: 'Insumos Industriales',   contact: 'Ana Torres',  email: 'contacto@insumos.com', phone: '+51 912 345 678', status: 'Activo' },
  { id: 'P003', name: 'Logística Total E.I.R.L.', contact: 'Luis Mendez', email: 'pedidos@logistica.pe', phone: '+51 923 456 789', status: 'Inactivo' },
];

export const seedMovements: Movement[] = [
  { id: 'M001', date: '11 May 2026', type: 'Entrada', product: 'Zapatilla Runner S', quantity: 50,  user: 'Juan M.' },
  { id: 'M002', date: '10 May 2026', type: 'Salida',  product: 'Pantalón Cargo L',   quantity: -12, user: 'Ana T.' },
  { id: 'M003', date: '09 May 2026', type: 'Entrada', product: 'Mochila Urbana',     quantity: 20,  user: 'Juan M.' },
  { id: 'M004', date: '09 May 2026', type: 'Ajuste',  product: 'Camiseta Polo M',    quantity: -2,  user: 'Sistema' },
  { id: 'M005', date: '08 May 2026', type: 'Salida',  product: 'Cinturón Cuero',     quantity: -5,  user: 'Ana T.' },
];

export const seedSalesData = [
  { name: 'Ene', ingresos: 4000, egresos: 2400 },
  { name: 'Feb', ingresos: 3000, egresos: 1398 },
  { name: 'Mar', ingresos: 2000, egresos: 3800 },
  { name: 'Abr', ingresos: 2780, egresos: 1908 },
  { name: 'May', ingresos: 4890, egresos: 2800 },
  { name: 'Jun', ingresos: 3390, egresos: 1800 },
];

export const seedCategoryData = [
  { name: 'Ropa',        value: 450 },
  { name: 'Calzado',     value: 280 },
  { name: 'Accesorios',  value: 150 },
  { name: 'Hogar',       value: 120 },
];
