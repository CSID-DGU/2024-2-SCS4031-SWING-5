package com.example.swingback.batch.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.configuration.JobRegistry;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;

import java.text.SimpleDateFormat;
import java.util.Date;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ScheduleConfig {
    private final JobLauncher jobLauncher;
    private final JobRegistry jobRegistry;

//    @Scheduled(cron = "10 * * * * *", zone = "Asia/Seoul") //10초마다

    @Scheduled(cron = "13 */1 * * * *", zone = "Asia/Seoul") // 1분마다
    public void runFirstJob() throws Exception {

        log.info("notificationJob schedule start");

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-hh-mm-ss");
        String date = dateFormat.format(new Date());

        JobParameters jobParameters = new JobParametersBuilder()
                .addString("date", date)
                .toJobParameters();

        jobLauncher.run(jobRegistry.getJob("notificationJob"), jobParameters);
    }
}
