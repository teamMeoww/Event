FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
ARG SERVICE_NAME
# Assumes build context is backend-spring
COPY --from=builder /app/services/${SERVICE_NAME}/target/${SERVICE_NAME}-1.0.0-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
