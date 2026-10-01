export interface ItemsSoldToProps {
  dateFrom: string;
  dateTo: string;
}

export interface SoldItem {
  sku?: string;
  productName: string;
  customerName: string;
  saleSerialNumber: string;
  quantity: number;
  unitWeight: number;
  weightSummed: number;
  pricePerGram: number;
  subtotal: number;
  latestSaleDate: string;
}
