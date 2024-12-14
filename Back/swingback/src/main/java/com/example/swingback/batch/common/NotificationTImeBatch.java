package com.example.swingback.batch.common;

import com.example.swingback.commons.NotificationType;
import com.example.swingback.healthcare.notificationtime.entity.NotificationTimeEntity;
import com.example.swingback.healthcare.notificationtime.repository.NotificationTimeRepository;
import com.example.swingback.notification.fcmtest.service.FCMService;
import com.example.swingback.notification.message.dto.MessageTemplateDTO;
import com.example.swingback.notification.message.service.MessageTemplateService;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class NotificationTImeBatch {


    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;
    private final NotificationTimeRepository notificationTimeRepository;
    private final NotificationRepository notificationRepository;
    private final MessageTemplateService messageTemplateService;
    private final TotalNotificationService totalNotificationService;

    @Bean
    public Job notificationTimeInputJob() {
        log.info("notificationTimeInputJob");
        return new JobBuilder("notificationTimeInputJob", jobRepository)
                .start(notificationTimeInputStep())
                .preventRestart() // Job 중복 실행 방지
                .build();
    }

    @Bean
    public Step notificationTimeInputStep() {
        log.info("notificationTimeInputJob first step");

        return new StepBuilder("notificationTimeInputStep", jobRepository)
                .<NotificationTimeEntity, NotificationTimeEntity>chunk(10, platformTransactionManager)
                .reader(notificationTimeInputReader())
                .processor(notificationTimeInputProcessor())
                .writer(notificationTimeInputWriter())
                .build();
    }

    @Bean
    public RepositoryItemReader<NotificationTimeEntity> notificationTimeInputReader() {
        return new RepositoryItemReaderBuilder<NotificationTimeEntity>()
                .name("notificationTimeInputReader")
                .pageSize(10)
                .repository(notificationTimeRepository)
                .methodName("findAll")
                .sorts(Map.of("notificationTimeId", Sort.Direction.ASC))
                .build();
    }

    @Bean
    public ItemProcessor<NotificationTimeEntity, NotificationTimeEntity> notificationTimeInputProcessor() {
        return item -> {

            // 오늘 날짜를 생성함
            LocalDate today = LocalDate.now();

            // 아직 한번도 등록되지 않았을떄 .NullPointerException
            if (item.getNotificationRegisterTime() != null) {
                // 오늘 날짜로 된 것들이 존재하면 null반환해서 batch 건너뛰기
                if (item.getNotificationRegisterTime().isEqual(today)) {
                    log.info("이미 등록된 알림시간: {}", item.getNotificationRegisterTime());
                    return null; // null을 반환하면 Spring Batch에서 해당 항목을 무시
                }
            } else {

                // 현재 날짜와 결합하여 알림시간으로 LocalDateTime 생성
                LocalDateTime dateTime = LocalDateTime.of(today, item.getScheduleTime());

                //메시지 템플릿
                Long messageTemplate = 5L;
                Map<String, String> name = Map.of("blood", item.getType());
            /*
            알림보낼 메시지 템플릿을 불러옴
            messageTemplate : 템플릿 번호
            variables : 템플릿에 변수를 추가해서 변수를 어떻게 바꿔서 보여줄지 설정하는 부분
             */
                MessageTemplateDTO messageTemplateDTO = messageTemplateService.generateMessage(messageTemplate, name);


                if (item.getType().equals("혈압")) {
                    totalNotificationService
                            .saveNotification(NotificationType.BLOOD_PRESSURE_REMINDER.getDescription(),
                                    item.getUserId().getUserId(),
                                    item.getUserId(),
                                    false,
                                    false,
                                    dateTime,
                                    null,
                                    messageTemplateDTO
                            );
                } else if (item.getType().equals("혈당")) {
                    totalNotificationService
                            .saveNotification(NotificationType.BLOOD_SUGAR_REMINDER.getDescription(),
                                    item.getUserId().getUserId(),
                                    item.getUserId(),
                                    false,
                                    false,
                                    dateTime,
                                    null,
                                    messageTemplateDTO
                            );
                }
                item.setNotificationRegisterTime(LocalDate.now());
            }
            return item;
        };
    }


    @Bean
    public RepositoryItemWriter<NotificationTimeEntity> notificationTimeInputWriter() {
        return new RepositoryItemWriterBuilder<NotificationTimeEntity>()
                .repository(notificationTimeRepository)
                .methodName("save")
                .build();
    }
}
