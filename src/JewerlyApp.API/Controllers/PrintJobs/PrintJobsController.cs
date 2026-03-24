using JewerlyApp.Application.PrintJobs.Commands.ClaimNextPrintJob;
using JewerlyApp.Application.PrintJobs.Commands.CreateReceiptPrintJob;
using JewerlyApp.Application.PrintJobs.Commands.MarkPrintJobFailed;
using JewerlyApp.Application.PrintJobs.Commands.MarkPrintJobStarted;
using JewerlyApp.Application.PrintJobs.Commands.MarkPrintJobSucceeded;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.API.Controllers.PrintJobs
{
    [Authorize]
    public class PrintJobsController : MainController
    {
        [HttpPost]
        public async Task<IActionResult> CreateReceiptPrintJob([FromBody] CreateReceiptPrintJobCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> ClaimNextPrintJob([FromBody] ClaimNextPrintJobCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> MarkPrintJobStarted([FromBody] MarkPrintJobStartedCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> MarkPrintJobSucceeded([FromBody] MarkPrintJobSucceededCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> MarkPrintJobFailed([FromBody] MarkPrintJobFailedCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
    }
}