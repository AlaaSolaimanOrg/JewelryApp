using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.API.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public abstract class MainController : ControllerBase
    {
        /// <summary>
        /// The mediator
        /// </summary>
        private IMediator _mediator;

        /// <summary>
        /// Gets the mediator.
        /// </summary>
        /// <value>The mediator.</value>
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected IActionResult CreateResponse<T>(GenericResponse<T> response)
        {
            switch (response.StatusCode)
            {
                case ResponseStatusCode.Success:
                    return Ok(response);
                case ResponseStatusCode.Created:
                    return Created(string.Empty, response);
                case ResponseStatusCode.NoContent:
                    return NoContent();
                case ResponseStatusCode.BadRequest:
                    return BadRequest(response);
                case ResponseStatusCode.NotFound:
                    return NotFound(response);
                case ResponseStatusCode.Unauthorized:
                    return Unauthorized(response);
                case ResponseStatusCode.InternalServerError:
                    return StatusCode(500, response);
                default:
                    return StatusCode(500, response);
            }
        }
    }
}
