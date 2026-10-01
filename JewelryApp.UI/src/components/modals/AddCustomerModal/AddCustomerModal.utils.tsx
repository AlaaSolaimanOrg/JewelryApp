export const formatPhoneDisplay = (digits: string) => {
  const d = (digits || "").replace(/\D/g, "").slice(0, 10);
  if (d.length > 6) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return d;
};

export const getCustomerModalTitle = (
  mode: "add" | "edit" | "view",
  label = "customer",
) => {
  switch (mode) {
    case "edit":
      return `Edit ${label}`;
    case "view":
      return `View ${label}`;
    default:
      return `Add new ${label}`;
  }
};

export const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);
