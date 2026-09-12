using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Application.CashManagement
{
    public static class CashTransactionTypeHelper
    {
        // Whether this transaction type adds money to the box (true) or removes it (false).
        public static bool IsCredit(CashTransactionType type) => type switch
        {
            CashTransactionType.Expense => false,
            CashTransactionType.ManualCashIn => true,
            CashTransactionType.TransferIncome => true,
            CashTransactionType.MoveMoneyOut => false,
            CashTransactionType.MoveMoneyIn => true,
            CashTransactionType.SaleCashIn => true,
            _ => true
        };

        public static decimal SignedAmount(CashTransactionType type, decimal amount) =>
            IsCredit(type) ? amount : -amount;
    }
}
