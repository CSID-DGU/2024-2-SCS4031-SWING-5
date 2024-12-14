package com.example.swingback.batch.common;

import com.example.swingback.medicine.medicationmanagement.entity.MedicationManagementEntity;
import com.example.swingback.medicine.medicationmanagement.repository.MedicationManegementRepository;
import com.example.swingback.notification.fcmtest.service.FCMService;
import com.example.swingback.notification.token.entity.FCMTokenEntity;
import com.example.swingback.notification.token.repository.FCMTokenRepository;
import com.example.swingback.notification.total.entity.TotalNotificationEntity;
import com.example.swingback.notification.total.repository.NotificationRepository;
import com.example.swingback.notification.total.service.TotalNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.data.RepositoryItemReader;
import org.springframework.batch.item.data.RepositoryItemWriter;
import org.springframework.batch.item.data.builder.RepositoryItemReaderBuilder;
import org.springframework.batch.item.data.builder.RepositoryItemWriterBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class NotificationBatch {


    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;
    private final NotificationRepository notificationRepository;
    private final FCMService fcmService;
    private final FCMTokenRepository fcmTokenRepository;


    @Bean
    public Job notificationJob() {
        log.info("notificationJob");
        return new JobBuilder("notificationJob", jobRepository)
                .start(notificationStep())
                .preventRestart() // Job 중복 실행 방지
                .build();
    }

    @Bean
    public Step notificationStep() {
        log.info("first step");

        return new StepBuilder("notificationStep", jobRepository)
                .<TotalNotificationEntity, TotalNotificationEntity>chunk(10, platformTransactionManager)
                .reader(medicationReader())
                .processor(medicationProcessor())
                .writer(medicationWriter())
                .build();
    }

    @Bean
    public RepositoryItemReader<TotalNotificationEntity> medicationReader() {
        return new RepositoryItemReaderBuilder<TotalNotificationEntity>()
                .name("notificationReader")
                .pageSize(10)
                .repository(notificationRepository)
                .methodName("findAll")
                .sorts(Map.of("notificationId", Sort.Direction.ASC))
                .build();
    }

    @Bean
    public ItemProcessor<TotalNotificationEntity, TotalNotificationEntity> medicationProcessor() {
        return item -> {

            // 이미 처리된 항목이면 건너뜁니다.
            if (item.getSendTime() != null) {
                log.info("Notification already processed for notificationId: {}", item.getNotificationId());
                return null; // null을 반환하면 Spring Batch에서 해당 항목을 무시합니다.
            }

            // 현재 시간을 LocalDateTime으로 가져오기
            LocalDateTime now = LocalDateTime.now();

            // item의 ScheduledTime이 LocalDateTime이라고 가정
            if (item.getScheduledTime().isBefore(now) || item.getScheduledTime().isEqual(now)) {
                List<FCMTokenEntity> allByUserId =
                        fcmTokenRepository.findAllByUserId(item.getResponseId());
                // 가장 최근의 recentUseDate가 있는 FCMTokenEntity 가져오기
                FCMTokenEntity latestTokenEntity = allByUserId.stream()
                        .max(Comparator.comparing(FCMTokenEntity::getRecentUseDate))
                        .orElse(null); // 리스트가 비어있을 경우 null 반환

                // 복용 확인 상태가 false일 경우에만 알림을 전송
                if (latestTokenEntity != null) {
                    fcmService.sendNotification(
                            latestTokenEntity.getToken(),
                            item.getMessage(),
                            item.getMessage());
                } else {
                    log.warn("No valid FCM token found for userId: {}", item.getResponseId());
                }

                // SendTime을 현재 시간으로 설정
                item.setSendTime(LocalDateTime.now());
            }

            return item; // 엔티티를 그대로 반환
        };
    }


    @Bean
    public RepositoryItemWriter<TotalNotificationEntity> medicationWriter() {
        return new RepositoryItemWriterBuilder<TotalNotificationEntity>()
                .repository(notificationRepository)
                .methodName("save")
                .build();
    }

}
