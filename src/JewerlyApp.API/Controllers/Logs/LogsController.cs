using JewerlyApp.Application.Logs.Commands.DeleteLogs;
using JewerlyApp.Application.Logs.Queries.GetLogs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.API.Controllers.Logs
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : MainController
    {
        /// <summary>
        /// Get logs with pagination, sorting and filtering
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetLogs([FromQuery] GetLogsQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// Delete multiple logs by IDs
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpDelete]
        public async Task<IActionResult> DeleteLogs([FromBody] DeleteLogsCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
    }
}
