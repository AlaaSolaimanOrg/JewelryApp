export const apiRoutes = {
  auth: {
    login: "Auth/Login",
    refreshToken: "Auth/RefreshTokens",
  },
  cart: {
    addProductToCart: "Cart/AddProductToCart",
    getCartProducts: "Cart/GetCartProducts",
    deleteCart: "Cart/DeleteCart",
    removeProductFromCart: "Cart/RemoveProductFromCart",
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
    getProductsBySku: "Product/GetProductsBySku",
  },
  users: {
    getAllUsers: "Users/GetAllUsers",
    getAllRoles: "Users/GetAllRoles/roles",
    softDeleteUser: "Users/SoftDeleteUser",
    createUser: "Users/CreateUser",
    updateUser: "Users/UpdateUser",
    getUserById: "Users/GetUserById",
    getUserInfo: "Users/getUserInfo",
  },
  customers: {
    createCustomer: "Customer/CreateCustomer",
    getCustomer: "Customer/GetCustomer",
  },
  sales: {
    createSale: "Sales/CreateSale",
    getSaleById: "Sales/GetSaleById",
    getSalesList: "Sales/GetSalesList",
  },
};
