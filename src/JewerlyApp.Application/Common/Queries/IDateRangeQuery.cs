using JewerlyApp.Domain.Enums;
using System;

namespace JewerlyApp.Application.Common.Queries
{
    public interface IDateRangeQuery
    {
        DateOnly? DateFrom { get; }
        DateOnly? DateTo { get; }
        ReportType? ReportType { get; }
    }
}
