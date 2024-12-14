package com.example.swingback;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SwingbackApplication {

	public static void main(String[] args) {
		SpringApplication.run(SwingbackApplication.class, args);
	}

}
