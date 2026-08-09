import { FaPen, FaReceipt } from "react-icons/fa";
import type { TableHeader } from "../../../components/tables/CustomTable/CustomTable";
import ReceiptHistoryModal from "../../../components/modals/ReceiptHistoryModal/ReceiptHistoryModal";
import { SortDirection } from "../../../types/enums";
import type { SortCriteria } from "../../../types/general";
import { handleSort } from "../../../utils";
import type { Customer } from "./Customers";

export const fmtCurrency = (value: number): string =>
  `$${(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const fmtPhone = (phone: string): string => {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length !== 10) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const fmtDate = (value: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const fmtBirthday = (value: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const isBirthdayMonth = (value: string): boolean => {
  if (!value) return false;
  const date = new Date(value);
  if (isNaN(date.getTime())) return false;
  return date.getUTCMonth() === new Date().getMonth();
};

const TIERS = [
  { min: 100000, name: "VIP", className: "tier-vip" },
  { min: 50000, name: "GOLD", className: "tier-gold" },
  { min: 25000, name: "SILVER", className: "tier-silver" },
  { min: 8000, name: "BRONZE", className: "tier-bronze" },
];

export const tierOf = (spent: number) =>
  TIERS.find((t) => spent >= t.min) ?? null;

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

export const buildCustomerHeaders = (
  sortCriteria: SortCriteria,
  onSortChange: (sortBy: string, value?: SortDirection) => void,
): TableHeader[] => [
  {
    key: "name",
    label: renderSortLabel("Name", "Name", sortCriteria),
    sortable: true,
    onHeaderClick: () => handleSort("Name", sortCriteria, onSortChange),
  },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "birthday", label: "Birthday" },
  {
    key: "items",
    label: renderSortLabel("Items", "TotalProductsPurchased", sortCriteria),
    sortable: true,
    align: "right",
    onHeaderClick: () =>
      handleSort("TotalProductsPurchased", sortCriteria, onSortChange),
  },
  {
    key: "spent",
    label: renderSortLabel(
      "Total purchases",
      "TotalPurchasesValue",
      sortCriteria,
    ),
    sortable: true,
    align: "right",
    onHeaderClick: () =>
      handleSort("TotalPurchasesValue", sortCriteria, onSortChange),
  },
  {
    key: "lastPurchase",
    label: renderSortLabel("Last purchase", "LastPurchaseDate", sortCriteria),
    sortable: true,
    onHeaderClick: () =>
      handleSort("LastPurchaseDate", sortCriteria, onSortChange),
  },
  { key: "actions", label: "Actions", align: "right" },
];

export type CustomerRowActions = {
  onEdit: (customer: Customer) => void;
};

export const buildCustomerTableData = (
  customers: Customer[],
  actions: CustomerRowActions,
) =>
  customers?.map((customer) => {
    const tier = tierOf(customer.totalPurchasesValue);
    return {
      name: (
        <>
          <span className="cust-name">{customer.name}</span>
          {tier && (
            <span className={`tier-pill ${tier.className}`}>{tier.name}</span>
          )}
        </>
      ),
      phone: fmtPhone(customer.phoneNumber),
      email: customer.email || <span className="muted">—</span>,
      birthday: customer.birthday ? (
        <>
          {fmtBirthday(customer.birthday)}
          {isBirthdayMonth(customer.birthday) && (
            <span className="bday-pill">🎂 this month</span>
          )}
        </>
      ) : (
        <span className="muted">—</span>
      ),
      items: <span className="num">{customer.totalProductsPurchased}</span>,
      spent: (
        <span className="num spent">
          {fmtCurrency(customer.totalPurchasesValue)}
        </span>
      ),
      lastPurchase: customer.lastPurchaseDate ? (
        fmtDate(customer.lastPurchaseDate)
      ) : (
        <span className="muted">—</span>
      ),
      actions: (
        <div className="row-actions">
          <ReceiptHistoryModal
            customerId={customer.id}
            customerName={customer.name}
            totalWeight18K={customer.total18K}
            totalWeight21K={customer.total21K}
            totalAmount={customer.totalPurchasesValue}
            totalDiscount={customer.totalDiscount}
          >
            <button className="act-ico act-hist" data-tip="Purchase history">
              <FaReceipt size={13} />
            </button>
          </ReceiptHistoryModal>
          <button
            className="act-ico act-edit"
            data-tip="Edit customer"
            onClick={() => actions.onEdit(customer)}
          >
            <FaPen size={13} />
          </button>
        </div>
      ),
    };
  });
