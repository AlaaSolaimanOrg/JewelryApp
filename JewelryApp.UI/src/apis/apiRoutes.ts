export const apiRoutes = {
  auth: {
    login: "Auth/Login",
    refreshToken: "Auth/RefreshTokens",
  },
  cart: { addProductToCart: "Cart/AddProductToCart" },
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
  users: {
    getAllUsers: "Users/GetAllUsers",
    getAllRoles: "Users/GetAllRoles/roles",
    softDeleteUser: "Users/SoftDeleteUser",
    createUser: "Users/CreateUser",
    updateUser: "Users/UpdateUser",
    getUserById: "Users/GetUserById",
  },
};
