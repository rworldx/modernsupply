// Shape passed from server pages to client catalog/cards.
export interface CatalogProduct {
  id: string;
  brandId: string;
  categoryId: string;
  nameEn: string;
  nameAr: string;
  unitEn: string;
  unitAr: string;
  categoryNameEn: string;
  categoryNameAr: string;
  stock: number;
  lowStockThreshold: number;
  active: boolean;
  /** Product photo URL; null falls back to the category glyph. */
  imageUrl: string | null;
  /** Original price in OMR; null when no price has been set. */
  priceOmr: number | null;
  /** Price after the best applicable discount; equals priceOmr when none. */
  finalOmr: number | null;
  /** Whole-percent reduction applied, 0 when none. */
  percentOff: number;
}
