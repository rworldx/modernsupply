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
}
