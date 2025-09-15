export const apiRoutes = {
  auth: {
    login: "Auth/Login",
    refreshToken: "Auth/RefreshTokens",
  },
  pricingSettings: {
    getGlobalPricingSettings: "PricingSettings/GetGlobalPricingSettings",
    getPricingSettings: "PricingSettings/GetPricingSettings",
    editPricingSettings: "PricingSettings/EditPricingSettings",
  },
  product: {
    generateSku: "Product/GenerateSku",
    validateProductImages: "Product/ValidateProductImages",
    createProduct: "Product/CreateProduct",
    editProduct: "Product/EditProduct",
    getProducts: "Product/GetProducts",
    deleteProduct: "Product/DeleteProduct",
    getProductById: "Product/GetProductById",
  },
};
