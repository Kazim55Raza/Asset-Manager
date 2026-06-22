# Use the official .NET 10 SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy the .csproj file from the subfolder and restore dependencies
COPY AssetManager.API/AssetManager.API.csproj AssetManager.API/
RUN dotnet restore "AssetManager.API/AssetManager.API.csproj"

# Copy the rest of the application files and build it
COPY . .
WORKDIR "/src/AssetManager.API"
RUN dotnet build "AssetManager.API.csproj" -c Release -o /app/build

# Publish the application binaries
FROM build AS publish
RUN dotnet publish "AssetManager.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage: copy the binaries to the .NET 10 ASP.NET runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AssetManager.API.dll"]