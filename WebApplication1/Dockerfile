FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5000
EXPOSE 5001

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY WebApplication1/API.csproj WebApplication1/
RUN dotnet restore WebApplication1/API.csproj
COPY . .
WORKDIR /src/WebApplication1
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT [\"dotnet\", \"WebApplication1.dll\"]
