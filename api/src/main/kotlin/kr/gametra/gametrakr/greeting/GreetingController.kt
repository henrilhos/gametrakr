package kr.gametra.gametrakr.greeting

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.concurrent.atomic.AtomicLong

@RestController
class GreetingController {
    private val counter = AtomicLong()

    @GetMapping("/greeting")
    fun greeting(@RequestParam(value = "name", defaultValue = "World") name: String?) =
        Greeting(counter.incrementAndGet(), String.format(TEMPLATE, name))

    companion object {
        private const val TEMPLATE = "Hello, %s!"
    }
}
