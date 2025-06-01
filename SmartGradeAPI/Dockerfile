FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY SmartGradeAPI.sln ./
COPY SmartGradeAPI.API/*.csproj ./SmartGradeAPI.API/
COPY SmartGradeAPI.Core/*.csproj ./SmartGradeAPI.Core/
COPY SmartGradeAPI.Data/*.csproj ./SmartGradeAPI.Data/
COPY SmartGradeAPI.Service/*.csproj ./SmartGradeAPI.Service/

WORKDIR /app/SmartGradeAPI.API
RUN dotnet restore

COPY . .

WORKDIR /app/SmartGradeAPI.API
RUN dotnet clean SmartGradeAPI.API.csproj
RUN dotnet publish SmartGradeAPI.API.csproj -c Release -o out /p:PublishSingleFile=false /p:AssemblyName=SmartGradeAPIApp

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/SmartGradeAPI.API/out ./
ENTRYPOINT ["dotnet", "SmartGradeAPI.API.dll"]