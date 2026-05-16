import { seedMovements } from '../seed';
import type { Movement, MovementType } from './types';

const movements = new Map<string, Movement>(seedMovements.map((m) => [m.id, m]));
let nextSeq = seedMovements.length + 1;

function formatToday(): string {
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(new Date())
    .replace(/\./g, '')
    .replace(/^(\d+) (\w+) (\d+)$/, (_, d, m, y) => `${d} ${m[0].toUpperCase() + m.slice(1)} ${y}`);
}

export function listMovements(): Movement[] {
  return Array.from(movements.values()).sort((a, b) => b.id.localeCompare(a.id));
}

export function createMovement(input: { type: MovementType; product: string; quantity: number; user: string }): Movement {
  const id = `M${String(nextSeq++).padStart(3, '0')}`;
  const sign = input.type === 'Salida' ? -1 : input.type === 'Ajuste' ? -1 : 1;
  const quantity = sign * Math.abs(input.quantity);
  const movement: Movement = { id, date: formatToday(), type: input.type, product: input.product, quantity, user: input.user };
  movements.set(id, movement);
  return movement;
}

export function deleteMovement(id: string): boolean {
  return movements.delete(id);
}

export function ordersToday(): number {
  return Array.from(movements.values()).filter((m) => m.type !== 'Ajuste').length;
}
