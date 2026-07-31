export const formatPhoneDisplay = (digits: string) => {
  const d = (digits || "").replace(/\D/g, "").slice(0, 10);
  if (d.length > 6) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return d;
};

export const getCustomerModalTitle = (mode: "add" | "edit" | "view") => {
  switch (mode) {
    case "edit":
      return "Edit customer";
    case "view":
      return "View customer";
    default:
      return "Add new customer";
  }
};
