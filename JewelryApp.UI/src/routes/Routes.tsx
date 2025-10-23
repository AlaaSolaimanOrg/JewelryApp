import { Suspense, lazy } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Login from "../pages/general/login/Login";
import Unauthorized from "../pages/general/unauthorized/Unauthorized";

// Lazy load all components
const AddEditProduct = lazy(() => import("../pages/admin/addEditProduct/AddEditProduct"));
const AddEditStaff = lazy(() => import("../pages/admin/addStaff/AddEditStaff"));
const AdminHeader = lazy(() => import("../pages/admin/adminHeader/AdminHeader"));
const Customers = lazy(() => import("../pages/admin/customers/Customers"));
const Dashboard = lazy(() => import("../pages/admin/dashboard/Dashboard"));
const ExportData = lazy(() => import("../pages/admin/exportData/ExportData"));
const Inventory = lazy(() => import("../pages/admin/inventory/Inventory"));
const Pricing = lazy(() => import("../pages/admin/pricing/Pricing"));
const TagPrinting = lazy(() => import("../pages/admin/printTags/TagPrinting"));
const SalesReports = lazy(() => import("../pages/admin/salesReport/SalesReports"));
const Settings = lazy(() => import("../pages/admin/settings/Settings"));
const SideNav = lazy(() => import("../pages/admin/sidenav/Sidenav"));
const Staff = lazy(() => import("../pages/admin/staff/Staff"));
const Header = lazy(() => import("../pages/newPos/header/Header"));
const Home = lazy(() => import("../pages/newPos/home/Home"));
const MainPosPage = lazy(() => import("../pages/newPos/posSale/PosSale"));
const Receipt = lazy(() => import("../pages/newPos/receipt/Receipt"));
const TransactionHistory = lazy(() => import("../pages/newPos/transactionHistory/TransactionHistory"));
const ReceiptDelivery = lazy(() => import("../pages/oldPosPages/ReceiptDelivery/ReceiptDelivery"));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-lg">Loading...</div>
  </div>
);

// POS Layout (includes POS Header)
const POSLayout = () => (
  <>
    <Suspense fallback={<LoadingFallback />}>
      <Header />
    </Suspense>
    <main>
      <Outlet />
    </main>
  </>
);

// Admin Layout (can add AdminHeader/Sidebar if needed)
const AdminLayout = () => (
  <div className="adminLayoutContainer">
    <Suspense fallback={<LoadingFallback />}>
      <SideNav />
      <AdminHeader />
    </Suspense>
    <main className="adminLayout-main">
      <Outlet />
    </main>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter basename={import.meta.env.VITE_ROUTE_PREFIX}>
      <Suspense fallback={<LoadingFallback />}>
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
            <Route path="/transactionHistory" element={<TransactionHistory />} />
            <Route path="/receipt/:saleId" element={<Receipt />} />
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
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;