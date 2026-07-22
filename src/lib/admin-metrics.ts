import "server-only";
import { db } from "@/lib/db";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";

export interface DailyPoint {
  date: string; // YYYY-MM-DD
  orders: number;
  items: number;
}

export interface DashboardMetrics {
  totalOrders: number;
  byStatus: Record<OrderStatus, number>;
  activeOrders: number; // not delivered/cancelled
  totalProducts: number;
  activeProducts: number;
  lowStock: number;
  outOfStock: number;
  totalUnits: number;
  daily: DailyPoint[]; // last 90 days
  lowStockItems: { id: string; nameEn: string; brandId: string; stock: number; lowStockThreshold: number }[];
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const since = new Date();
  since.setDate(since.getDate() - 89);
  since.setHours(0, 0, 0, 0);

  const [orders, products, grouped] = await Promise.all([
    db.order.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, status: true, items: { select: { quantity: true } } },
    }),
    db.product.findMany({
      select: { id: true, nameEn: true, brandId: true, stock: true, lowStockThreshold: true, active: true },
    }),
    db.order.groupBy({ by: ["status"], _count: true }),
  ]);

  const byStatus = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>;
  let totalOrders = 0;
  for (const g of grouped) {
    totalOrders += g._count;
    if ((ORDER_STATUSES as readonly string[]).includes(g.status)) {
      byStatus[g.status as OrderStatus] = g._count;
    }
  }

  // Build 90-day daily series (zero-filled).
  const daily: DailyPoint[] = [];
  const map = new Map<string, DailyPoint>();
  for (let i = 0; i < 90; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const point = { date: key, orders: 0, items: 0 };
    map.set(key, point);
    daily.push(point);
  }
  for (const o of orders) {
    const key = new Date(o.createdAt).toISOString().slice(0, 10);
    const p = map.get(key);
    if (p) {
      p.orders += 1;
      p.items += o.items.reduce((n, it) => n + it.quantity, 0);
    }
  }

  const activeProducts = products.filter((p) => p.active).length;
  const lowStock = products.filter((p) => p.active && p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStock = products.filter((p) => p.active && p.stock <= 0).length;
  const totalUnits = products.reduce((n, p) => n + p.stock, 0);
  const lowStockItems = products
    .filter((p) => p.active && p.stock <= p.lowStockThreshold)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 12);

  const activeOrders = totalOrders - byStatus.delivered - byStatus.cancelled;

  return {
    totalOrders,
    byStatus,
    activeOrders,
    totalProducts: products.length,
    activeProducts,
    lowStock,
    outOfStock,
    totalUnits,
    daily,
    lowStockItems,
  };
}
