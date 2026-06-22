using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using AssetManager.API.Data;
using Microsoft.AspNetCore.Builder;
using AssetManager.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSwaggerGen(); 

// builder.Services.AddControllers();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = null; // Keep PascalCase
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors(options=>
{
    options.AddPolicy("FrontendCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Update with your frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
})    ;
var app = builder.Build();
app.UseMiddleware<ExceptionMeddleware>();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    
}
// 2. Move these completely OUTSIDE the "if" statement block so they load globally:
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    // This tells Swagger exactly where to find the generated OpenAPI json data structure
    options.SwaggerEndpoint("/openapi/v1.json", "Asset Manager API v1");
    options.RoutePrefix = "swagger"; // Exposes the UI page at /swagger
});

app.UseCors("FrontendCorsPolicy");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
