import "server-only";
import { db } from "@/lib/db";
import { getCategoriesForBrand, getCategory } from "@/data/products";
import type { CatalogProduct } from "@/lib/types";

/** Merge DB stock rows with the static catalog for a brand's products. */
export async function getBrandCatalog(brandId: string): Promise<{
  products: CatalogProduct[];
  categories: { id: string; nameEn: string; nameAr: string; count: number }[];
}> {
  // Customer-facing: only listed (active) products appear in the storefront.
  const rows = await db.product.findMany({ where: { brandId, active: true } });

  const products: CatalogProduct[] = rows.map((r) => {
    const cat = getCategory(r.categoryId as never);
    return {
      id: r.id,
      brandId: r.brandId,
      categoryId: r.categoryId,
      nameEn: r.nameEn,
      nameAr: r.nameAr,
      unitEn: r.unitEn,
      unitAr: r.unitAr,
      categoryNameEn: cat.nameEn,
      categoryNameAr: cat.nameAr,
      stock: r.stock,
      lowStockThreshold: r.lowStockThreshold,
      active: r.active,
    };
  });

  // Keep the static category order; count only active products.
  const categories = getCategoriesForBrand(brandId).map((c) => ({
    id: c.id,
    nameEn: c.nameEn,
    nameAr: c.nameAr,
    count: products.filter((p) => p.categoryId === c.id).length,
  }));

  // Sort products by category order, then name.
  const order = new Map<string, number>(categories.map((c, i) => [c.id as string, i]));
  products.sort(
    (a, b) =>
      (order.get(a.categoryId) ?? 0) - (order.get(b.categoryId) ?? 0) ||
      a.nameEn.localeCompare(b.nameEn),
  );

  return { products, categories };
}
