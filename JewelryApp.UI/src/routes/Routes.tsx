import { Suspense, lazy } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Loader from "../components/loaders/Loader/Loader";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { useTheme } from "../context/ThemeContext";

const Analytics = lazy(() => import("../pages/admin/analytics/Analytics"));
const InventoryReports = lazy(
  () => import("../pages/admin/InventoryReports/InventoryReports"),
);
const PickUp = lazy(() => import("../pages/pos/pickup/PickUp"));
const Login = lazy(() => import("../pages/general/login/Login"));
const Unauthorized = lazy(
  () => import("../pages/general/unauthorized/Unauthorized"),
);
const RepairsReports = lazy(
  () => import("../pages/admin/repairsReports/RepairsReports"),
);
const CustomersReports = lazy(
  () => import("../pages/admin/customersReports/CustomersReports"),
);

const Logs = lazy(() => import("../pages/admin/logs/Logs"));
const AddEditProduct = lazy(
  () => import("../pages/admin/addEditProduct/AddEditProduct"),
);
const AddEditStaff = lazy(() => import("../pages/admin/addStaff/AddEditStaff"));
const AdminHeader = lazy(
  () => import("../pages/admin/adminHeader/AdminHeader"),
);
const Customers = lazy(() => import("../pages/admin/customers/Customers"));
const Dashboard = lazy(() => import("../pages/admin/dashboard/Dashboard"));
const ExportData = lazy(() => import("../pages/admin/exportData/ExportData"));
const Inventory = lazy(() => import("../pages/admin/inventory/Inventory"));
const MeltedProducts = lazy(
  () => import("../pages/admin/meltedProducts/MeltedProducts"),
);

const Pricing = lazy(() => import("../pages/admin/pricing/Pricing"));
const TagPrinting = lazy(() => import("../pages/admin/printTags/TagPrinting"));
const SalesReports = lazy(
  () => import("../pages/admin/salesReport/SalesReports"),
);
const Settings = lazy(() => import("../pages/admin/settings/Settings"));
const SideNav = lazy(() => import("../pages/admin/sidenav/Sidenav"));
const Staff = lazy(() => import("../pages/admin/staff/Staff"));
const PosHeader = lazy(() => import("../pages/pos/posHeader/PosHeader"));
const PosDashboard = lazy(
  () => import("../pages/pos/posDashboard/PosDashboard"),
);
const MainPosPage = lazy(() => import("../pages/pos/posSale/PosSale"));
const Receipt = lazy(() => import("../pages/pos/receipt/Receipt"));
const CashManagement = lazy(
  () => import("../pages/pos/cashManagement/CashManagement"),
);

const RepairIntake = lazy(
  () => import("../pages/pos/repairIntake/RepairIntake"),
);
const UsedGold = lazy(() => import("../pages/pos/usedGold/UsedGold"));
const ReturnPage = lazy(() => import("../pages/pos/ReturnPage/ReturnPage"));
const ReturnManagement = lazy(
  () => import("../pages/admin/returnManagement/ReturnManagement"),
);
const UsedGoldAdmin = lazy(() => import("../pages/admin/usedGold/UsedGold"));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader size="large" text="Loading..." className="loader-fullpage" />
  </div>
);

// POS Layout (includes POS Header)
const POSLayout = () => {
  const { theme } = useTheme();

  return (
    <div className="pos-app" data-theme={theme}>
      <Suspense fallback={<LoadingFallback />}>
        <PosHeader />
      </Suspense>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

// Admin Layout (can add AdminHeader/Sidebar if needed)
const AdminLayout = () => {
  const { theme } = useTheme();

  return (
    <div className="adminLayoutContainer" data-theme={theme}>
      <Suspense fallback={<LoadingFallback />}>
        <SideNav />
        <AdminHeader />
      </Suspense>
      <main className="adminLayout-main">
        <Outlet />
      </main>
    </div>
  );
};

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
            <Route path="/" element={<PosDashboard />} />
            <Route path="/sale" element={<MainPosPage />} />
            <Route path="/cashManagement" element={<CashManagement />} />
            <Route path="/receipt/:saleId" element={<Receipt />} />
            <Route path="/repair" element={<RepairIntake />} />
            <Route path="/usedgold" element={<UsedGold />} />
            <Route path="/return" element={<ReturnPage />} />
            <Route path="pickUp" element={<PickUp />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["Admin", "TerminalRole"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/inventory/products" element={<Inventory />} />
            <Route
              path="/admin/inventory/melted"
              element={<MeltedProducts />}
            />
            <Route
              path="/admin/inventory/reports"
              element={<InventoryReports />}
            />
            <Route path="admin/repairs/reports" element={<RepairsReports />} />
            <Route
              path="admin/returnManagement"
              element={<ReturnManagement />}
            />
            <Route path="admin/pricing" element={<Pricing />} />
            <Route path="admin/customers" element={<Customers />} />
            <Route path="admin/usedGold" element={<UsedGoldAdmin />} />
            <Route
              path="admin/addProduct"
              element={<AddEditProduct isEdit={false} />}
            />
            <Route
              path="admin/editProduct/:productId"
              element={<AddEditProduct isEdit={true} />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="admin/dashboard" element={<Dashboard />} />
            <Route path="admin/analytics" element={<Analytics />} />
            <Route path="admin/sales-reports" element={<SalesReports />} />
            <Route
              path="admin/customers-reports"
              element={<CustomersReports />}
            />
            <Route path="admin/staff" element={<Staff />} />
            <Route path="admin/settings" element={<Settings />} />
            <Route path="admin/print-tags" element={<TagPrinting />} />
            <Route path="admin/export-data" element={<ExportData />} />
            <Route
              path="admin/addStaff"
              element={<AddEditStaff isEdit={false} />}
            />
            <Route
              path="admin/editStaff/:userId"
              element={<AddEditStaff isEdit={true} />}
            />
            <Route path="admin/logs" element={<Logs />} />
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
