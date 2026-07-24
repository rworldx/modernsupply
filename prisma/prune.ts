// One-off: the catalogue was replaced wholesale (168 old SKUs -> 654 new ones
// with different ids). The seed upserts, so it never removes rows that fell out
// of the catalogue. This deletes DB products whose id is no longer in the static
// catalogue — but only when they carry no order history, since an OrderItem
// references its product. Anything with history is delisted (active = false)
// instead, so past orders still resolve.
import { PrismaClient } from "@prisma/client";
import { products } from "../src/data/products";

const db = new PrismaClient();

async function main() {
  const known = new Set(products.map((p) => p.id));
  const rows = await db.product.findMany({ select: { id: true } });
  const orphans = rows.filter((r) => !known.has(r.id)).map((r) => r.id);

  if (orphans.length === 0) {
    console.log("No orphaned products.");
    return;
  }

  const withHistory = new Set(
    (
      await db.orderItem.findMany({
        where: { productId: { in: orphans } },
        select: { productId: true },
        distinct: ["productId"],
      })
    ).map((o) => o.productId),
  );

  const deletable = orphans.filter((id) => !withHistory.has(id));
  const delistable = orphans.filter((id) => withHistory.has(id));

  if (deletable.length) {
    await db.product.deleteMany({ where: { id: { in: deletable } } });
    await db.stockMovement.deleteMany({ where: { productId: { in: deletable } } });
  }
  if (delistable.length) {
    await db.product.updateMany({ where: { id: { in: delistable } }, data: { active: false } });
  }

  console.log(
    `Orphans: ${orphans.length}. Deleted ${deletable.length}, delisted ${delistable.length} (had order history).`,
  );
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
