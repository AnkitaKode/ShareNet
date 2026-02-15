# Use OpenJDK 21 as base image
FROM openjdk:21-jdk-slim

WORKDIR /app

# Copy Maven wrapper & dependencies for caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source and build
COPY src src
RUN ./mvnw clean package -DskipTests

# Copy built jar to root
RUN cp target/*-SNAPSHOT.jar app.jar

EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java","-jar","app.jar"]
