// Seeds the Product inventory table from the static catalog (src/data/products.ts).
// Idempotent: upserts by product id, so re-running never duplicates and never
// clobbers an admin's existing stock counts.
import { PrismaClient } from "@prisma/client";
import { products, getCategory } from "../src/data/products";

const db = new PrismaClient();

async function main() {
  let count = 0;
  for (const p of products) {
    const cat = getCategory(p.category);
    await db.product.upsert({
      where: { id: p.id },
      // Only refresh catalog-derived fields; never overwrite stock/active on re-seed.
      update: {
        brandId: cat.brandId,
        categoryId: cat.id,
        nameEn: p.nameEn,
        nameAr: p.nameAr,
        unitEn: cat.unitEn,
        unitAr: cat.unitAr,
      },
      create: {
        id: p.id,
        brandId: cat.brandId,
        categoryId: cat.id,
        nameEn: p.nameEn,
        nameAr: p.nameAr,
        unitEn: cat.unitEn,
        unitAr: cat.unitAr,
        stock: 0,
        lowStockThreshold: 10,
        active: true,
      },
    });
    count++;
  }
  console.log(`Seeded/updated ${count} products.`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
