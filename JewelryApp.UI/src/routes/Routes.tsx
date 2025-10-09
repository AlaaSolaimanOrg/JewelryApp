import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import AddEditProduct from "../pages/admin/addEditProduct/AddEditProduct";
import AddEditStaff from "../pages/admin/addStaff/AddEditStaff";
import AdminHeader from "../pages/admin/adminHeader/AdminHeader";
import Customers from "../pages/admin/customers/Customers";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import ExportData from "../pages/admin/exportData/ExportData";
import Inventory from "../pages/admin/inventory/Inventory";
import Pricing from "../pages/admin/pricing/Pricing";
import TagPrinting from "../pages/admin/printTags/TagPrinting";
import SalesReports from "../pages/admin/salesReport/SalesReports";
import Settings from "../pages/admin/settings/Settings";
import SideNav from "../pages/admin/sidenav/Sidenav";
import Staff from "../pages/admin/staff/Staff";
import Login from "../pages/general/login/Login";
import Unauthorized from "../pages/general/unauthorized/Unauthorized";
import Header from "../pages/newPos/header/Header";
import Home from "../pages/newPos/home/Home";
import MainPosPage from "../pages/newPos/posSale/PosSale";
import ReceiptDelivery from "../pages/oldPosPages/ReceiptDelivery/ReceiptDelivery";
import Receipt from "../pages/newPos/receipt/Receipt";

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
  <div className="adminLayoutContainer">
    <SideNav />
    <AdminHeader />
    <main className="adminLayout-main">
      <Outlet />
    </main>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ProtectedRoute allowedRoles={["PosRole"]}>
              <POSLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/sale" element={<MainPosPage />} />
          {/* <Route path="/productLookup" element={<ProductLookup />} />
          <Route path="/transactionHistory" element={<TransactionHistory />} />
          <Route path="/cartSummary" element={<CartSummary />} />
          <Route path="/manualItemEntry" element={<ManualItemEntry />} />
          <Route path="/applyDiscount" element={<ApplyDiscount />} />
          <Route path="/payment" element={<Payment />} /> */}
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/ReceiptDelivery" element={<ReceiptDelivery />} />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={["Admin", "Admin2"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/inventory" element={<Inventory />} />
          <Route path="admin/pricing" element={<Pricing />} />
          <Route path="admin/sales-reports" element={<SalesReports />} />
          <Route path="admin/customers" element={<Customers />} />
          <Route path="admin/staff" element={<Staff />} />
          <Route path="admin/settings" element={<Settings />} />
          <Route path="admin/print-tags" element={<TagPrinting />} />
          <Route path="admin/export-data" element={<ExportData />} />
          <Route
            path="admin/addProduct"
            element={<AddEditProduct isEdit={false} />}
          />
          <Route
            path="admin/editProduct/:productId"
            element={<AddEditProduct isEdit={true} />}
          />
          <Route
            path="admin/addStaff"
            element={<AddEditStaff isEdit={false} />}
          />
          <Route
            path="admin/editStaff/:userId"
            element={<AddEditStaff isEdit={true} />}
          />
        </Route>

        <Route path="admin/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
