package kr.gametra.gametrakr

import org.springframework.boot.fromApplication
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.testcontainers.service.connection.ServiceConnection
import org.springframework.boot.with
import org.springframework.context.annotation.Bean
import org.testcontainers.containers.GenericContainer
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.utility.DockerImageName

@TestConfiguration(proxyBeanMethods = false)
class TestGametrakrApplication {

	@Bean
	@ServiceConnection
	fun postgresContainer(): PostgreSQLContainer<*> {
		return PostgreSQLContainer(DockerImageName.parse("postgres:latest"))
	}

	@Bean
	@ServiceConnection(name = "redis")
	fun redisContainer(): GenericContainer<*> {
		return GenericContainer(DockerImageName.parse("redis:latest")).withExposedPorts(6379)
	}

}

fun main(args: Array<String>) {
	fromApplication<GametrakrApplication>().with(TestGametrakrApplication::class).run(*args)
}
