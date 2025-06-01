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

RUN dotnet clean SmartGradeAPI.API.csproj
RUN rm -rf bin/ obj/
RUN dotnet publish SmartGradeAPI.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "SmartGradeAPI.API.dll"]
