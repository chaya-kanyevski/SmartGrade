FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY SmartGrade.Api/*.csproj ./SmartGrade.Api/
COPY SmartGrade.Core/*.csproj ./SmartGrade.Core/
COPY SmartGrade.Data/*.csproj ./SmartGrade.Data/
COPY SmartGrade.Service/*.csproj ./SmartGrade.Service/

WORKDIR /app/SmartGrade.Api
RUN dotnet restore

WORKDIR /app
COPY . .

WORKDIR /app/SmartGrade.Api
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/SmartGrade.Api/out ./
ENTRYPOINT ["dotnet", "SmartGrade.Api.dll"]