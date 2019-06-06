FROM microsoft/aspnetcore:2.0 AS base
EXPOSE 80
WORKDIR /app

COPY app .
ENTRYPOINT ["dotnet", "Runtime.dll"]