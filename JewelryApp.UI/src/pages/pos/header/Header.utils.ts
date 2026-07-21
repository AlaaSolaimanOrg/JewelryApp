interface RouteTitle {
  path: string;
  title: string;
}

const ROUTE_TITLES: RouteTitle[] = [
  { path: "/", title: "POS Dashboard" },
  { path: "/transactionHistory", title: "Transaction History" },
  { path: "/receipt", title: "Receipt Preview" },
  { path: "/sale", title: "Sale" },
];

export const getPageTitle = (pathname: string) => {
  const matchedRoute = ROUTE_TITLES.find(
    (route) =>
      pathname === route.path || pathname.startsWith(route.path + "/"),
  );

  return matchedRoute?.title || "POS Dashboard";
};
