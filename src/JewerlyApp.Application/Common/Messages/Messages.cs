using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Common.Messages
{
    public class Messages
    {
        //Success Messages
        public const string SuccessLogin = "Login successful. Welcome!";
        public const string SuccessLogout = "You have been successfully logged out.";
        public const string SuccessItemAdded = "Item added to inventory.";
        public const string SuccessItemUpdated = "Item details updated.";
        public const string SuccessItemDeleted = "Item removed from inventory.";
        public const string SuccessSaleProcessed = "Sale processed successfully. Invoice generated.";
        public const string SuccessRepairStatusUpdated = "Repair status updated.";
        public const string SuccessPasswordChanged = "Password has been changed.";
        public const string SuccessGoldPriceUpdated = "Gold prices have been updated.";
        public const string Success = "Successfully retrieved";
        public const string Success_Action = "Action done successfully";
        public const string Success_User_Created = "User created successfully.";
        public const string Success_User_Updated = "User updated successfully.";
        public const string Success_User_Deleted = "User deleted successfully.";
        public const string Success_User_Restored = "User restored successfully.";
        public const string Success_Role_Created = "Role created successfully.";
        public const string Success_Role_Updated = "Role updated successfully.";
        public const string Success_Role_Deleted = "Role deleted successfully.";
        public const string Success_Password_Reset = "Password reset successfully.";

        //Error Messages
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

        //POS Messages
        public const string PosCartEmpty = "Cannot checkout. The shopping cart is empty.";
        public const string PosItemNotFound = "Product not found. Please check the SKU or barcode.";
        public const string PosSplitPaymentFailed = "Split payment failed. Please ensure all parts of the payment are valid.";
        public const string PosSmsSent = "Invoice sent to the customer via SMS.";
        public const string PosSmsSendFailed = "Failed to send SMS. Please check the phone number.";

        //Admin Messages
        public const string AdminPriceUpdateFailed = "Failed to update gold prices. Please check the new values.";
        public const string AdminReportGenerationFailed = "Failed to generate the report. Please try again later.";
        public const string AdminUserRoleUpdateFailed = "Failed to update user roles.";

        //Repair Messages
        public const string RepairNotFound = "Repair record not found.";
        public const string RepairStatusInvalid = "The provided repair status is not valid.";
        public const string RepairCustomerNotified = "Customer has been notified of the repair status via SMS.";

        //Token Success Messages
        public const string Success_Token_Generated = "Access token generated successfully.";
        public const string Success_Refresh_Token_Generated = "Refresh token generated successfully.";
        public const string Success_Tokens_Refreshed = "Tokens refreshed successfully.";
        public const string Success_Token_Revoked = "Refresh token revoked successfully.";
        public const string Success_Token_Valid = "Refresh token is valid.";
        public const string Success_Token_Invalid = "Refresh token is invalid.";
        public const string Success_Tokens_Cleaned = "Expired refresh tokens cleaned successfully.";
    }
}
