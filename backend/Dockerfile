# Use OpenJDK 21 as base image
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml first for dependency caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy the rest of the source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Copy the built JAR to a predictable location
RUN cp target/*-SNAPSHOT.jar app.jar

# Expose Spring Boot's default port
EXPOSE 8080

# Set environment profile (optional)
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application
ENTRYPOINT ["java","-jar","app.jar"]
