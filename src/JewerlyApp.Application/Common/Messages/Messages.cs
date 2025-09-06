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

        //Error Messages
        public const string ErrorGeneral = "An unexpected error occurred. Please try again.";
        public const string ErrorInvalidCredentials = "Invalid username or password. Please try again.";
        public const string ErrorForbidden = "You do not have permission to perform this action.";
        public const string ErrorNotFound = "The requested resource could not be found.";
        public const string ErrorDatabaseConnection = "Failed to connect to the database. Please check the server status.";
        public const string ErrorInvalidInput = "Invalid input. Please check the data provided.";
        public const string ErrorInsufficientStock = "Insufficient stock for the requested item.";
        public const string ErrorPaymentFailed = "Payment failed. Please check the payment details or try another method.";

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
    }
}
