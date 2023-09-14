FROM openjdk:17-jdk
WORKDIR /app
COPY build/libs/*-SNAPSHOT.jar gametrakr.jar
EXPOSE 80
CMD ["java", "-jar", "gametrakr.jar"]
