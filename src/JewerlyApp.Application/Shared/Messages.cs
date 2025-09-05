using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Shared
{
    public class Messages
    {
        //Success Messages
        public const string successLogin = "Login successful. Welcome!";
        public const string successLogout = "You have been successfully logged out.";
        public const string successItemAdded = "Item added to inventory.";
        public const string successItemUpdated = "Item details updated.";
        public const string successItemDeleted = "Item removed from inventory.";
        public const string successSaleProcessed = "Sale processed successfully. Invoice generated.";
        public const string successRepairStatusUpdated = "Repair status updated.";
        public const string successPasswordChanged = "Password has been changed.";
        public const string successGoldPriceUpdated = "Gold prices have been updated.";

        //Error Messages
        public const string errorGeneral = "An unexpected error occurred. Please try again.";
        public const string errorInvalidCredentials = "Invalid username or password. Please try again.";
        public const string errorForbidden = "You do not have permission to perform this action.";
        public const string errorNotFound = "The requested resource could not be found.";
        public const string errorDatabaseConnection = "Failed to connect to the database. Please check the server status.";
        public const string errorInvalidInput = "Invalid input. Please check the data provided.";
        public const string errorInsufficientStock = "Insufficient stock for the requested item.";
        public const string errorPaymentFailed = "Payment failed. Please check the payment details or try another method.";

        //POS Messages
        public const string posCartEmpty = "Cannot checkout. The shopping cart is empty.";
        public const string posItemNotFound = "Product not found. Please check the SKU or barcode.";
        public const string posSplitPaymentFailed = "Split payment failed. Please ensure all parts of the payment are valid.";
        public const string posSmsSent = "Invoice sent to the customer via SMS.";
        public const string posSmsSendFailed = "Failed to send SMS. Please check the phone number.";

        //Admin Messages
        public const string adminPriceUpdateFailed = "Failed to update gold prices. Please check the new values.";
        public const string adminReportGenerationFailed = "Failed to generate the report. Please try again later.";
        public const string adminUserRoleUpdateFailed = "Failed to update user roles.";

        //Repair Messages
        public const string repairNotFound = "Repair record not found.";
        public const string repairStatusInvalid = "The provided repair status is not valid.";
        public const string repairCustomerNotified = "Customer has been notified of the repair status via SMS.";
    }
}
