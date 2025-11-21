namespace JewerlyApp.Application.Common.Messages
{
    public static class Messages
    {
        // --------------------------------------------------
        // SUCCESS MESSAGES
        // --------------------------------------------------
        public const string SuccessLogin = "Login successful. Welcome!";
        public const string SuccessLogout = "You have been successfully logged out.";
        public const string Success_Token_Generated = "Access token generated successfully.";
        public const string Success_Refresh_Token_Generated = "Refresh token generated successfully.";
        public const string Success_Tokens_Refreshed = "Tokens refreshed successfully.";
        public const string Success_Token_Revoked = "Refresh token revoked successfully.";
        public const string Success_Token_Valid = "Refresh token is valid.";
        public const string Success_Token_Invalid = "Refresh token is invalid.";
        public const string Success_Tokens_Cleaned = "Expired refresh tokens cleaned successfully.";
        public const string SuccessItemAdded = "Item added to inventory.";
        public const string SuccessItemUpdated = "Item details updated.";
        public const string SuccessItemDeleted = "Item removed from inventory.";
        public const string SuccessSaleProcessed = "Sale processed successfully. Invoice generated.";
        public const string SuccessRepairStatusUpdated = "Repair status updated.";
        public const string SuccessPasswordChanged = "Password has been changed.";
        public const string SuccessGoldPriceUpdated = "Gold prices have been updated.";
        public const string Success = "Successfully retrieved";
        public const string SuccessCartCreated = "Cart Successfully Created.";
        public const string Success_Action = "Action done successfully";
        public const string Success_User_Created = "User created successfully.";
        public const string Success_User_Updated = "User updated successfully.";
        public const string Success_User_Deleted = "User deleted successfully.";
        public const string Success_User_Restored = "User restored successfully.";
        public const string Success_Role_Created = "Role created successfully.";
        public const string Success_Role_Updated = "Role updated successfully.";
        public const string Success_Role_Deleted = "Role deleted successfully.";
        public const string Success_Password_Reset = "Password reset successfully.";
        public const string Success_Customer_Created = "Customer Successfully Created";
        public const string Success_Customer_Updated = "Customer Updated Successfully";
        public const string Success_Customer_Deleted = "Customer Deleted.";
        public const string Success_Purchase_Retrieved = "Successfully Retrieved Purchase History.";

        // NEW FOR RETURNS
        public const string Success_Return_Created = "Return created successfully.";
        public const string SuccessReturnProcessed = "Return processed successfully.";


        // --------------------------------------------------
        // ERROR MESSAGES
        // --------------------------------------------------
        public const string ErrorGeneral = "An unexpected error occurred. Please try again.";
        public const string ErrorInvalidCredentials = "Invalid username or password. Please try again.";
        public const string ErrorForbidden = "You do not have permission to perform this action.";
        public const string ErrorNotFound = "The requested resource could not be found.";
        public const string ErrorDatabaseConnection = "Failed to connect to the database. Please check the server status.";
        public const string ErrorInvalidInput = "Invalid input. Please check the data provided.";
        public const string ErrorInsufficientStock = "Insufficient stock for the requested item.";
        public const string ErrorPaymentFailed = "Payment failed. Please check the payment details or try another method.";
        public const string Error_Invalid_Token = "Invalid token.";
        public const string Error_Token_Generation = "Failed to generate token.";
        public const string Error_Refresh_Token_Generation = "Failed to generate refresh token.";
        public const string Error_Refresh_Token_Save = "Failed to save refresh token.";
        public const string Error_Refresh_Token_Required = "Refresh token is required.";
        public const string Error_Refresh_Token_Expired = "Invalid or expired refresh token.";
        public const string Error_User_Not_Found = "User not found.";
        public const string Error_Cart_Already_Exists = "Cart Already Exists.";
        public const string Error_User_Inactive = "User account is not active.";
        public const string Error_Token_Revoke = "Failed to revoke token.";
        public const string Error_Token_Validation = "Failed to validate refresh token.";
        public const string Error_Token_Cleanup = "Failed to clean expired refresh tokens.";
        public const string Error_User_Already_Exists = "User already exists.";
        public const string Error_User_Creation_Failed = "Failed to create user.";
        public const string Error_User_Update_Failed = "Failed to update user.";
        public const string Error_User_Deletion_Failed = "Failed to delete user.";
        public const string Error_User_Restore_Failed = "Failed to restore user.";
        public const string Error_User_Role_Assignment_Failed = "Failed to assign roles to user.";
        public const string Error_User_Role_Update_Failed = "Failed to update user roles.";
        public const string Error_Role_Already_Exists = "Role already exists.";
        public const string Error_Role_Not_Found = "Role not found.";
        public const string Error_Role_Creation_Failed = "Failed to create role.";
        public const string Error_Role_Update_Failed = "Failed to update role.";
        public const string Error_Role_Deletion_Failed = "Failed to delete role.";
        public const string Error_Role_Has_Users = "Cannot delete role with assigned users.";
        public const string Error_User_Role_Removal_Failed = "Failed to remove roles from user.";
        public const string Error_Password_Reset_Failed = "Failed to reset password.";
        public const string Error_Discount_Result = "Fixed discount results in a negative result.";
        public const string Error_Discount = "Fixed Discount can't be a negative number.";
        public const string Error_Percentage_Discount = "Percentage discount must be between 0 and 100.";
        public const string Error_Pricing_Settings = "Pricing settings for this type with this karat type is missing.";
        public const string Error_Invalid_Price = "Invalid Price";
        public const string Error_Customer_Data_Exists = "A Customer with the following data already exists.";
        public const string Error_Customer_Not_Found = "Customer Not Found.";
        public const string Error_Purchase_Not_Found = "No Purchase Found For This Customer.";
        public const string ErrorInvalidNfcId = "Invalid Nfc Id";
        public const string Error_Sale_MustContain_Items = "Sale must contain at least one item";
        public const string Error_Payments_Dont_Match = "Payment amounts do not match the total amount.";
        public const string Error_Sale_Not_Found = "Sale not found.";

        // Dynamic Product Message
        public static string Errror_Product_Not_Found(string productName)
            => $"Product with ID {productName} was not found. The sale cannot be completed.";

        // --------------------------------------------------
        // RETURN ERROR MESSAGES (NEW)
        // --------------------------------------------------
        public const string Error_Return_No_Items = "Return must include at least one item.";
        public const string Error_Invalid_SaleItem = "Invalid SaleItemId.";
        public const string Error_Invalid_Return_Quantity = "Quantity to return must be greater than 0.";
        public const string Error_Exceeds_Purchased_Quantity = "Cannot return more quantity than purchased.";
        public const string Error_Invalid_Return_Amount = "Return amount must be greater than 0.";
        public const string Error_Invalid_Weight = "Weight must be provided for returned items.";

        public static string Error_Invalid_SaleItemId(Guid id)
            => $"Invalid SaleItemId: {id}";

        public static string Error_Return_Quantity_Exceeds(int requested, int purchased)
            => $"Cannot return {requested} pcs — only {purchased} were purchased.";
                
    }


}
