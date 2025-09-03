using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Common.Extensions
{
    public static class IQueryableExtensions
    {
        public static IQueryable<T> ApplySorting<T>(
          this IQueryable<T> source,
          string? sortBy,
          SortDirection sortDirection = SortDirection.Ascending)
        {
            if (string.IsNullOrWhiteSpace(sortBy))
            {
                return source;
            }

            // Split the sortBy to handle nested properties
            var sortFields = sortBy.Split('.');
            var parameter = Expression.Parameter(typeof(T), "x");
            Expression property = parameter;

            // Traverse through properties for nested properties
            foreach (var field in sortFields)
            {
                property = Expression.PropertyOrField(property, field);
            }


            var lambda = Expression.Lambda(property, parameter);

            string methodName = sortDirection == SortDirection.Ascending ? "OrderBy" : "OrderByDescending";

            var resultExpression = Expression.Call(
                typeof(Queryable),
                methodName,
                new Type[] { source.ElementType, property.Type },
                source.Expression,
                Expression.Quote(lambda));

            return source.Provider.CreateQuery<T>(resultExpression);
        }

        public static IQueryable<T> ApplyPagination<T>(
        this IQueryable<T> source,
        int pageNumber,
        int pageSize)
        {
            if (pageNumber < 1) pageNumber = 1;  // Default to page 1 if invalid
            if (pageSize < 1) pageSize = 10;     // Default to 10 items per page if invalid

            return source.Skip((pageNumber - 1) * pageSize).Take(pageSize);
        }

        public static async Task<T?> GetValueOrDefault<T>(this DbDataReader reader, int columnIndex)
        {
            if (await reader.IsDBNullAsync(columnIndex))
            {
                if (typeof(T) == typeof(int))
                    return (T)(object)0;
                else if (typeof(T) == typeof(Guid?))
                    return (T?)(object?)null;
                return default;
            }


            return await reader.GetFieldValueAsync<T>(columnIndex, new CancellationToken());
        }
    }
}
