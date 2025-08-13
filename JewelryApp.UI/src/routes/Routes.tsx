import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";
import Home from "../pages/home/Home";
import ProductLookup from "../pages/productLookup/ProductLookup";
import Header from "../pages/header/Header";
import TransactionHistory from "../pages/transactionHistory/TransactionHistory";
import CartSummary from "../pages/cartSummary/CartSummary";
import ManualItemEntry from "../pages/manualItemEntry/ManualItemEntry";
import ApplyDiscount from "../pages/applyDiscount/ApplyDiscount";
import Payment from "../pages/payment/Payment";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" element={<Home />} />
        <Route path="/productLookup" element={<ProductLookup />} />
        <Route path="/transactionHistory" element={<TransactionHistory />} />
        <Route path="/cartSummary" element={<CartSummary />} />
        <Route path="/manualItemEntry" element={<ManualItemEntry />} />
        <Route path="/applyDiscount" element={<ApplyDiscount />} />
        <Route path="/payment" element={<Payment />} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRoutes;
