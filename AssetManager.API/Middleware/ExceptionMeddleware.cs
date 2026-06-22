using System.Net;
using System.Text.Json  ;
using AssetManager.API.DTOs;  


namespace AssetManager.API.Middleware
{
    public class ExceptionMeddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMeddleware> _logger;
        private readonly IHostEnvironment _env;
        public ExceptionMeddleware(RequestDelegate next, ILogger<ExceptionMeddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {

            try
            {
                await _next(context);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "An Unhanddled exception Occured{Message}", ex.Message);

                context.Response.ContentType="application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;


                var Response = new ErrorResponseDTO
                {
                    
                    StatusCode = context.Response.StatusCode,
                    Message = "An Error Occured while processing your request",
                    Details = _env.IsDevelopment() ? ex.StackTrace ?? string.Empty : "None"
                };

                var jsonOptions =  new JsonSerializerOptions
                {
                    PropertyNamingPolicy= JsonNamingPolicy.CamelCase
                };
                var json = JsonSerializer.Serialize(Response, jsonOptions);

                await context.Response.WriteAsync(json);



            }
        }






    }

}