import { AdminShell } from "@/components/admin/admin-shell";
import { InventoryManager, type InventoryRow } from "@/components/admin/inventory-manager";
import { db } from "@/lib/db";
import { getCategory } from "@/data/products";
import { getBrand } from "@/data/brand";
import { getAdminLang } from "@/lib/admin-lang";
import { t as translate } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const lang = await getAdminLang();
  const t = (en: string, ar: string) => translate(lang, en, ar);
  const rows = await db.product.findMany({ orderBy: [{ brandId: "asc" }, { categoryId: "asc" }, { nameEn: "asc" }] });

  const products: InventoryRow[] = rows.map((p) => {
    let categoryName = p.categoryId;
    let categoryNameAr = p.categoryId;
    try {
      const c = getCategory(p.categoryId as never);
      categoryName = c.nameEn;
      categoryNameAr = c.nameAr;
    } catch {
      /* admin-added with a non-catalog id — fall back to id */
    }
    let brandName = p.brandId;
    let brandNameAr = p.brandId;
    try {
      const b = getBrand(p.brandId);
      brandName = b.nameEn;
      brandNameAr = b.nameAr;
    } catch {
      /* ignore */
    }
    return {
      id: p.id,
      nameEn: p.nameEn,
      nameAr: p.nameAr,
      brandId: p.brandId,
      brandName,
      brandNameAr,
      categoryId: p.categoryId,
      categoryName,
      categoryNameAr,
      unitEn: p.unitEn,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      active: p.active,
    };
  });

  return (
    <AdminShell
      title={t("Inventory", "المخزون")}
      subtitle={t(`${products.length} products · manage stock, restock, and availability`, `${products.length} منتج · إدارة المخزون وإعادة التخزين والتوفّر`)}
    >
      <InventoryManager products={products} />
    </AdminShell>
  );
}
