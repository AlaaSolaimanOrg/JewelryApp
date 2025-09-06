import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import AddProduct from "../pages/admin/addProduct/AddProduct";
import AdminHeader from "../pages/admin/adminHeader/AdminHeader";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import Inventory from "../pages/admin/inventory/Inventory";
import Pricing from "../pages/admin/pricing/Pricing";
import SalesReports from "../pages/admin/salesReport/SalesReports";
import SideNav from "../pages/admin/sidenav/Sidenav";
import ApplyDiscount from "../pages/pos/applyDiscount/ApplyDiscount";
import CartSummary from "../pages/pos/cartSummary/CartSummary";
import Header from "../pages/pos/header/Header";
import Home from "../pages/pos/home/Home";
import ManualItemEntry from "../pages/pos/manualItemEntry/ManualItemEntry";
import Payment from "../pages/pos/payment/Payment";
import ProductLookup from "../pages/pos/productLookup/ProductLookup";
import Receipt from "../pages/pos/receipt/Receipt";
import ReceiptDelivery from "../pages/pos/ReceiptDelivery/ReceiptDelivery";
import TransactionHistory from "../pages/pos/transactionHistory/TransactionHistory";
import Customers from "../pages/admin/customers/Customers";

// POS Layout (includes POS Header)
const POSLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
);

// Admin Layout (can add AdminHeader/Sidebar if needed)
const AdminLayout = () => (
  <>
    <SideNav />
    <AdminHeader />
    <main className="adminLayout-main">
      <Outlet />
    </main>
  </>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<POSLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productLookup" element={<ProductLookup />} />
          <Route path="/transactionHistory" element={<TransactionHistory />} />
          <Route path="/cartSummary" element={<CartSummary />} />
          <Route path="/manualItemEntry" element={<ManualItemEntry />} />
          <Route path="/applyDiscount" element={<ApplyDiscount />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/ReceiptDelivery" element={<ReceiptDelivery />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/inventory" element={<Inventory />} />
          <Route path="admin/pricing" element={<Pricing />} />
          <Route path="admin/sales-reports" element={<SalesReports />} />
          <Route path="admin/customers" element={<Customers />} />
          <Route path="admin/addProduct" element={<AddProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
