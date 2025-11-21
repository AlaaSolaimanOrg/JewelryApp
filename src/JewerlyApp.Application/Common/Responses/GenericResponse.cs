using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Common.Responses
{
    public class GenericResponse<T>
    {
        public ResponseStatusCode StatusCode { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }

        public static GenericResponse<T> Success(T data, string message = "Success")
        {
            return new GenericResponse<T>
            {
                StatusCode = ResponseStatusCode.Success,
                Message = message,
                Data = data,
                Errors = null
            };
        }

        public static GenericResponse<T> Created(T data, string message = "Created")
        {
            return new GenericResponse<T>
            {
                StatusCode = ResponseStatusCode.Created,
                Message = message,
                Data = data
            };
        }

        // -------------------------------------
        // ERROR METHODS
        // -------------------------------------
        public static GenericResponse<T> Error(
            ResponseStatusCode statusCode,
            string message,
            List<string>? errors = null)
        {
            return new GenericResponse<T>
            {
                StatusCode = statusCode,
                Message = message,
                Errors = errors,
                Data = default
            };
        }

        public static GenericResponse<T> ValidationError(List<string> errors)
        {
            return new GenericResponse<T>
            {
                StatusCode = ResponseStatusCode.BadRequest,
                Message = "Validation Failed",
                Errors = errors,
                Data = default
            };
        }

        public static GenericResponse<T> NotFound(string message = "Not Found")
        {
            return new GenericResponse<T>
            {
                StatusCode = ResponseStatusCode.NotFound,
                Message = message,
                Data = default
            };
        }

        public static GenericResponse<T> Unauthorized(string message = "Unauthorized")
        {
            return new GenericResponse<T>
            {
                StatusCode = ResponseStatusCode.Unauthorized,
                Message = message
            };
        }

        public static GenericResponse<T> InternalError(string message)
        {
            return new GenericResponse<T>
            {
                StatusCode = ResponseStatusCode.InternalServerError,
                Message = message
            };
        }
    }
}
