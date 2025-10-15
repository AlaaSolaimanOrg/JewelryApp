using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Infrastructure.HealthChecks
{
    public class InternalResourcesHealthCheck : IHealthCheck
    {
        public async Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context,
            CancellationToken cancellationToken = default)
        {
            var healthData = new Dictionary<string, object>();

            // Check disk space
            var drive = new DriveInfo(Path.GetPathRoot(Environment.CurrentDirectory!));
            healthData["DiskSpace_GB"] = drive.AvailableFreeSpace / 1024 / 1024 / 1024;

            // Check memory usage
            healthData["Memory_MB"] = Environment.WorkingSet / 1024 / 1024;

            // Check if application can write to disk
            try
            {
                var tempFile = Path.GetTempFileName();
                await File.WriteAllTextAsync(tempFile, "healthcheck");
                File.Delete(tempFile);
                healthData["FileSystem"] = "Healthy";
            }
            catch
            {
                return HealthCheckResult.Degraded("File system issues", data: healthData);
            }

            return HealthCheckResult.Healthy("Internal resources OK", healthData);
        }
    }
}
