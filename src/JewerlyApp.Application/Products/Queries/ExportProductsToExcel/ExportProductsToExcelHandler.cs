using ClosedXML.Excel;
using JewerlyApp.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Products.Queries.ExportProductsToExcel
{
    public class ExportProductsToExcelHandler
        : IRequestHandler<ExportProductsToExcelQuery, FileResponse>
    {
        private readonly IApplicationDbContext _context;

        public ExportProductsToExcelHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FileResponse> Handle(
            ExportProductsToExcelQuery request,
            CancellationToken cancellationToken)
        {
            /* ============================================================
               🔍 BUILD QUERY WITH FILTERS
            ============================================================ */
            var query = _context.Products
                .AsNoTracking()
                .Include(p => p.Tags)
                .AsQueryable();

            if (request.ProductCategoryFilter.HasValue)
                query = query.Where(x => x.Category == request.ProductCategoryFilter);

            if (request.SKUs?.Any() == true)
                query = query.Where(x => request.SKUs.Contains(x.Sku!));

            if (request.KaratTypeFilter.Any())
                query = query.Where(x => request.KaratTypeFilter.Contains(x.KaratType));

            if (request.WeightFromFilter.HasValue && request.WeightToFilter.HasValue)
                query = query.Where(x =>
                    x.Weight >= request.WeightFromFilter &&
                    x.Weight <= request.WeightToFilter);

            if (!string.IsNullOrWhiteSpace(request.SearchBy))
            {
                var keyword = request.SearchBy.Trim();
                query = query.Where(x =>
                    x.Sku.Contains(keyword) ||
                    (x.Name != null && x.Name.Contains(keyword)) ||
                    x.Tags.Any(t => t.Tag.Contains(keyword)));
            }

            var products = await query.ToListAsync(cancellationToken);

            /* ============================================================
               💰 PRICING (Karat + ProductType)
            ============================================================ */
            var pricing = await _context.PricingSettings
                .AsNoTracking()
                .ToDictionaryAsync(
                    p => (p.KaratType, p.ProductType),
                    p => p.Price,
                    cancellationToken
                );

            /* ============================================================
               📊 EXCEL SETUP
            ============================================================ */
            using var workbook = new XLWorkbook();
            var sheet = workbook.Worksheets.Add("Inventory");

            /* ---------------- TITLE ---------------- */
            sheet.Cell("A1").Value = "Inventory Report";
            sheet.Range("A1:J1").Merge();
            sheet.Cell("A1").Style
                .Font.SetBold()
                .Font.SetFontSize(16)
                .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);

            sheet.Row(1).Height = 32;

            /* ---------------- HEADER ---------------- */
            var headerRow = 3;

            var headers = new[]
            {
                "SKU",
                "Name",
                "Category",
                "Product Type",
                "Karat",
                "Weight (g)",
                "Price / g",
                "Quantity",       // 👈 moved BEFORE total
                "Total Price",
                "Manual"
            };

            for (int i = 0; i < headers.Length; i++)
                sheet.Cell(headerRow, i + 1).Value = headers[i];

            var headerRange = sheet.Range(headerRow, 1, headerRow, headers.Length);
            headerRange.Style
                .Font.SetBold()
                .Font.SetFontColor(XLColor.White)
                .Fill.SetBackgroundColor(XLColor.FromHtml("#d4af37")) // gold
                .Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center)
                .Border.SetOutsideBorder(XLBorderStyleValues.Thin)
                .Border.SetInsideBorder(XLBorderStyleValues.Thin);

            sheet.SheetView.FreezeRows(headerRow);

            /* ---------------- DATA ---------------- */
            var row = headerRow + 1;

            foreach (var product in products)
            {
                var pricePerGram = pricing.GetValueOrDefault(
                    (product.KaratType, product.Type), 0m);

                var unitPrice = product.Weight * pricePerGram;
                var totalPrice = unitPrice * product.Quantity;

                sheet.Cell(row, 1).Value = product.Sku;
                sheet.Cell(row, 2).Value = product.Name;
                sheet.Cell(row, 3).Value = product.Category?.ToString();
                sheet.Cell(row, 4).Value = product.Type.ToString();
                sheet.Cell(row, 5).Value = $"{product.KaratType}K";
                sheet.Cell(row, 6).Value = product.Weight;
                sheet.Cell(row, 7).Value = pricePerGram;
                sheet.Cell(row, 8).Value = product.Quantity;   // 👈 moved
                sheet.Cell(row, 9).Value = totalPrice;          // 👈 now after quantity
                sheet.Cell(row, 10).Value = product.IsManualEntry ? "Yes" : "No";

                // Zebra rows
                if (row % 2 == 0)
                {
                    sheet.Range(row, 1, row, 10)
                        .Style.Fill.SetBackgroundColor(XLColor.FromHtml("#FAF7F2"));
                }

                row++;
            }

            var lastDataRow = row - 1;

            /* ---------------- FORMATTING ---------------- */
            sheet.Column(6).Style.NumberFormat.Format = "#,##0.000"; // Weight
            sheet.Column(7).Style.NumberFormat.Format = "#,##0.00";  // Price / g
            sheet.Column(8).Style.NumberFormat.Format = "#,##0";     // Quantity
            sheet.Column(9).Style.NumberFormat.Format = "#,##0.00";  // Total Price

            sheet.Range(headerRow + 1, 1, lastDataRow, 10)
                .Style.Border.SetInsideBorder(XLBorderStyleValues.Hair)
                .Border.SetOutsideBorder(XLBorderStyleValues.Thin);

            /* ---------------- TOTALS ---------------- */
            var totalRow = lastDataRow + 2;

            sheet.Cell(totalRow, 5).Value = "TOTAL";
            sheet.Cell(totalRow, 6).FormulaA1 = $"SUM(F{headerRow + 1}:F{lastDataRow})";
            sheet.Cell(totalRow, 9).FormulaA1 = $"SUM(I{headerRow + 1}:I{lastDataRow})";

            sheet.Range(totalRow, 5, totalRow, 10)
                .Style.Font.SetBold()
                .Border.SetTopBorder(XLBorderStyleValues.Double);

            /* ---------------- WIDTHS ---------------- */
            sheet.Column(1).Width = 18;
            sheet.Column(2).Width = 28;
            sheet.Column(3).Width = 16;
            sheet.Column(4).Width = 16;
            sheet.Column(5).Width = 10;
            sheet.Column(6).Width = 14;
            sheet.Column(7).Width = 14;
            sheet.Column(8).Width = 12;
            sheet.Column(9).Width = 16;
            sheet.Column(10).Width = 12;

            /* ============================================================
               📤 RETURN FILE
            ============================================================ */
            using var stream = new MemoryStream();
            workbook.SaveAs(stream);

            return new FileResponse
            {
                Content = stream.ToArray(),
                FileName = $"Inventory_{DateTime.UtcNow:yyyyMMdd_HHmm}.xlsx",
                ContentType =
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            };
        }
    }
}
