using JewerlyApp.Application.Returns.Commands.CreateReturn;

namespace JewerlyApp.Application.Sales.Commands.CreateSale
{
    public class ExchangeReturnDto
    {
        public Guid SaleId { get; set; }
        public List<ReturnItemDto> Items { get; set; } = new();
    }
}
