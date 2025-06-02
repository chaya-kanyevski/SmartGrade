# שלב הבנייה
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# שלב העתקת קבצי csproj
COPY SmartGradeAPI.sln ./
COPY SmartGradeAPI.API/*.csproj SmartGradeAPI.API/
COPY SmartGradeAPI.Core/*.csproj SmartGradeAPI.Core/
COPY SmartGradeAPI.Data/*.csproj SmartGradeAPI.Data/
COPY SmartGradeAPI.Service/*.csproj SmartGradeAPI.Service/

# שחזור תלויות
RUN dotnet restore SmartGradeAPI.sln

# העתקת שאר הקוד
COPY . .

# מחיקת כל bin/obj כדי למנוע שגיאות כתיבה
RUN find . -type d -name bin -exec rm -rf {} + && \
    find . -type d -name obj -exec rm -rf {} +

# פרסום הפרויקט
WORKDIR /src/SmartGradeAPI.API
RUN dotnet publish SmartGradeAPI.API.csproj -c Release -o /app/publish

# שלב הריצה
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "SmartGradeAPI.API.dll"]
[]