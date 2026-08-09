import { FaDollarSign, FaEdit, FaFire, FaPrint } from "react-icons/fa";
import type { TableHeader } from "../../../components/tables/CustomTable/CustomTable";
import { ProductCategory, SortDirection } from "../../../types/enums";
import type { SortCriteria } from "../../../types/general";
import { handleSort, renderLongDescription } from "../../../utils";
import type { Product } from "./Inventory";
import TagsPopover from "./TagsPopover/TagsPopover";

export const fmtCurrency = (value: number): string =>
  `$${(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const renderSortLabel = (
  label: string,
  field: string,
  sortCriteria: SortCriteria,
) => (
  <>
    {label}
    {sortCriteria.sortBy === field && (
      <span className="arrow">
        {sortCriteria.sortDirection === SortDirection.Ascending ? "▲" : "▼"}
      </span>
    )}
  </>
);

export const buildInventoryHeaders = (
  sortCriteria: SortCriteria,
  onSortChange: (sortBy: string, value?: SortDirection) => void,
  allSelected: boolean,
  onToggleAll: (checked: boolean) => void,
): TableHeader[] => [
  {
    key: "select",
    label: (
      <input
        type="checkbox"
        className="row-check"
        checked={allSelected}
        onChange={(e) => onToggleAll(e.target.checked)}
      />
    ),
    width: "34px",
  },
  { key: "image", label: "Photo", width: "60px" },
  {
    key: "productName",
    label: renderSortLabel("Product", "Name", sortCriteria),
    sortable: true,
    onHeaderClick: () => handleSort("Name", sortCriteria, onSortChange),
  },
  { key: "price", label: "Price" },
  {
    key: "quantity",
    label: renderSortLabel("Stock", "quantity", sortCriteria),
    sortable: true,
    onHeaderClick: () => handleSort("quantity", sortCriteria, onSortChange),
  },
  {
    key: "sku",
    label: renderSortLabel("SKU", "sku", sortCriteria),
    sortable: true,
    onHeaderClick: () => handleSort("sku", sortCriteria, onSortChange),
  },
  {
    key: "karat",
    label: renderSortLabel("Karat", "KaratType", sortCriteria),
    sortable: true,
    onHeaderClick: () => handleSort("KaratType", sortCriteria, onSortChange),
  },
  {
    key: "weight",
    label: renderSortLabel("Weight", "weight", sortCriteria),
    sortable: true,
    onHeaderClick: () => handleSort("weight", sortCriteria, onSortChange),
  },
  {
    key: "category",
    label: renderSortLabel("Category", "category", sortCriteria),
    sortable: true,
    onHeaderClick: () => handleSort("category", sortCriteria, onSortChange),
  },
  { key: "tags", label: "Tags" },
  {
    key: "added",
    label: renderSortLabel("Added", "createdDate", sortCriteria),
    sortable: true,
    onHeaderClick: () => handleSort("createdDate", sortCriteria, onSortChange),
  },
  { key: "actions", label: "Actions", align: "right" },
];

export type InventoryRowActions = {
  isTerminalRole: boolean;
  selectedSkus: Set<string>;
  onToggleSelect: (sku: string) => void;
  onMelt: (product: Product) => void;
  onSpecialPrice: (product: Product) => void;
  onPrint: (product: Product) => void;
  onEdit: (productId: string) => void;
};

export const buildInventoryTableData = (
  products: Product[],
  actions: InventoryRowActions,
) =>
  products?.map((product) => ({
    rowClassName: product.quantity === 0 ? "sold-out" : "",
    select: (
      <input
        type="checkbox"
        className="row-check"
        checked={actions.selectedSkus.has(product.sku)}
        onChange={() => actions.onToggleSelect(product.sku)}
      />
    ),
    image: product.images?.[0]?.imageUrl ? (
      <div className="photo-cell">
        <img
          src={`${import.meta.env.VITE_API_URL}${product.images[0].imageUrl}`}
          alt={product.name ?? ""}
        />
      </div>
    ) : (
      <div className="no-photo">—</div>
    ),
    productName: (
      <span className="prod-name">
        {renderLongDescription(product.name, 16)}
      </span>
    ),
    price: <span className="num">{fmtCurrency(product.price)}</span>,
    quantity:
      product.quantity > 0 ? (
        <span className="qty-pill qty-in">{product.quantity} in stock</span>
      ) : (
        <span className="qty-pill qty-out">Sold out</span>
      ),
    sku: <span className="sku">{product.sku}</span>,
    karat: `${product.karatType}K`,
    weight: `${product.weight}g`,
    category: ProductCategory[product.category],
    tags: <TagsPopover tags={product.tags} />,
    added: product.createdDate
      ? new Date(product.createdDate).toLocaleDateString()
      : "—",
    actions: (
      <div className="row-actions">
        {product.quantity > 0 && (
          <button
            className="act-ico act-melt"
            data-tip="Melt"
            onClick={() => actions.onMelt(product)}
          >
            <FaFire size={13} />
          </button>
        )}
        <button
          className="act-ico act-price"
          data-tip="Special price"
          onClick={() => actions.onSpecialPrice(product)}
        >
          <FaDollarSign size={13} />
        </button>
        {!product.isManualEntry && (
          <button
            className="act-ico act-print"
            data-tip="Print tag"
            onClick={() => actions.onPrint(product)}
          >
            <FaPrint size={13} />
          </button>
        )}
        {!actions.isTerminalRole && (
          <button
            className="act-ico act-edit"
            data-tip="Edit"
            onClick={() => actions.onEdit(product.id)}
          >
            <FaEdit size={13} />
          </button>
        )}
      </div>
    ),
  }));
