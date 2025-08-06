import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";
import Home from "../pages/home/Home";
import ProductLookup from "../pages/productLookup/ProductLookup";
import Header from "../pages/header/Header";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" element={<Home />} />
        <Route path="/productLookup" element={<ProductLookup />} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRoutes;
