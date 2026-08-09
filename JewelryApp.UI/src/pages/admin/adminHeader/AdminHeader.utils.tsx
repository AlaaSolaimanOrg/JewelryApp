const PAGE_TITLES: { path: string; title: string }[] = [
  { path: "/admin/dashboard", title: "Dashboard" },
  { path: "/admin/analytics", title: "Analytics" },
  { path: "/admin/inventory/melted", title: "Melted Products" },
  { path: "/admin/inventory/reports", title: "Inventory Reports" },
  { path: "/admin/inventory", title: "Inventory" },
  { path: "/admin/pricing", title: "Pricing" },
  { path: "/admin/sales-reports", title: "Sales Reports" },
  { path: "/admin/customers", title: "Customers" },
  { path: "/admin/usedGold", title: "Used Gold" },
  { path: "/admin/staff", title: "Staff" },
  { path: "/admin/repairAnalytics", title: "Repair Analytics" },
  { path: "/admin/returnManagement", title: "Return Management" },
  { path: "/admin/settings", title: "Settings" },
  { path: "/admin/print-tags", title: "Print Tags" },
  { path: "/admin/export-data", title: "Export Data" },
  { path: "/admin/logs", title: "Logs" },
  { path: "/admin/addProduct", title: "Add Product" },
  { path: "/admin/editProduct", title: "Edit Product" },
  { path: "/admin/addStaff", title: "Add Staff" },
  { path: "/admin/editStaff", title: "Edit Staff" },
];

export const getPageTitle = (pathname: string): string => {
  const match = PAGE_TITLES.find((item) => pathname.startsWith(item.path));
  return match ? match.title : "Dashboard";
};
