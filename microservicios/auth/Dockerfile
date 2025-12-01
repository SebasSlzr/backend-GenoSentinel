# Etapa 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copiar archivos de configuracion de Maven
COPY pom.xml .
COPY src ./src

# Compilar el proyecto (skip tests para build mas rapido)
RUN mvn clean package -DskipTests

# Etapa 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el JAR compilado desde la etapa de build
COPY --from=build /app/target/*.jar app.jar

# Exponer el puerto
EXPOSE 8081

# Variables de entorno por defecto (se pueden sobrescribir)
ENV SPRING_PROFILES_ACTIVE=prod
ENV MYSQL_HOST=mysql
ENV MYSQL_PORT=3307
ENV MYSQL_DATABASE=genosentinel_auth
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=Sebasleak28
ENV GENOMICA_URL=http://genomica-service:8000
ENV CLINICA_URL=http://clinica-service:3000

# Comando para ejecutar la aplicacion
ENTRYPOINT ["java", "-jar", "app.jar"]