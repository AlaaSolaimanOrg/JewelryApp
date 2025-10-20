using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Infrastructure.HealthChecks
{
    public class SqlServerHealthCheck : IHealthCheck
    {
        private readonly string _connectionString;

        public SqlServerHealthCheck(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DbConnection")! ;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context,
            CancellationToken cancellationToken = default)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync(cancellationToken);
                return HealthCheckResult.Healthy("SQL Server is available");
            }
            catch (System.Exception ex)
            {
                return HealthCheckResult.Unhealthy("SQL Server is down", ex);
            }
        }
    }
}
