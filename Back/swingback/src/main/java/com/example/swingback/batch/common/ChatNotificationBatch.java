package com.example.swingback.batch.common;

import com.example.swingback.chat.commons.MessageType;
import com.example.swingback.chat.dto.ChatMessage;
import com.example.swingback.chat.entity.ChatMessageEntity;
import com.example.swingback.chat.entity.ChatRoomEntity;
import com.example.swingback.chat.repository.ChatMessageRepository;
import com.example.swingback.chat.repository.ChatRoomRepository;
import com.example.swingback.error.CustomException;
import com.example.swingback.medicine.medicationmanagement.entity.MedicationManagementEntity;
import com.example.swingback.medicine.medicationmanagement.repository.MedicationManegementRepository;
import com.example.swingback.notification.fcmtest.service.FCMService;
import com.example.swingback.notification.token.entity.FCMTokenEntity;
import com.example.swingback.notification.token.repository.FCMTokenRepository;
import com.example.swingback.notification.total.entity.TotalNotificationEntity;
import com.example.swingback.notification.total.repository.NotificationRepository;
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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ChatNotificationBatch {

    private final SimpMessagingTemplate messagingTemplate;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;

    private final FCMService fcmService;
    private final FCMTokenRepository fcmTokenRepository;
    private final MedicationManegementRepository medicationManegementRepository;

    @Bean
    public Job chatNotificationJob() {
        log.info("chatNotificationJob");
        return new JobBuilder("chatNotificationJob", jobRepository)
                .start(chatNotificationStep())
                .preventRestart() // Job 중복 실행 방지
                .build();
    }

    @Bean
    public Step chatNotificationStep() {
        log.info("first chatNotificationStep");

        return new StepBuilder("chatNotificationStep", jobRepository)
                .<MedicationManagementEntity, MedicationManagementEntity>chunk(10, platformTransactionManager)
                .reader(chatNotificationReader())
                .processor(chatNotificationProcessor())
                .writer(chatNotificationWriter())
                .build();
    }

    @Bean
    public RepositoryItemReader<MedicationManagementEntity> chatNotificationReader() {
        return new RepositoryItemReaderBuilder<MedicationManagementEntity>()
//                .name("chatNotificationReader")
//                .pageSize(10)
//                .repository(medicationManegementRepository)
//                .methodName("findPastUnconfirmedMedications")
//                .sorts(Map.of("medicationManagementId", Sort.Direction.ASC))
//                .build();
                .name("chatNotificationReader")
                .pageSize(10)
                .repository(medicationManegementRepository)
                .methodName("findPastUnconfirmedMedications")
                .arguments(LocalDate.now(), LocalTime.now())
                .sorts(Map.of("medicationManagementId", Sort.Direction.ASC))
                .build();
    }

    @Bean
    public ItemProcessor<MedicationManagementEntity, MedicationManagementEntity> chatNotificationProcessor() {
        return item -> {

            // 이미 처리된 항목이면 건너뜁니다.
            if (item.getBatchCheckTime() != null) {
                log.info("알림이 이미 전송되었습니다 , medicationManagementId: {}", item.getMedicationManagementId());
                return null; // null을 반환하면 Spring Batch에서 해당 항목을 무시합니다.
            }

            //쿼리 오류 한 번 더 검증
            if (LocalDateTime.now().isBefore(item.getNotificationDate().atTime(item.getNotificationTime()))) {
                log.info("아직 알림 시간이 도래하지 않았습니다: {}", item.getNotificationDate().atTime(item.getNotificationTime()));
                return null;
            }


            //예약시간
            LocalDateTime scheduleTime = item.getNotificationDate().atTime(item.getNotificationTime());
            //채팅방 id
            String roomId = item.getMedicineBag().getUserId().getFamily().getFamilyId();

            //안먹은 약봉투 이름
            String medicationBagTitle = item.getMedicineBag().getMedicineBagTitle();

            //어떤 회원이 안먹었는지
            Long userId = item.getMedicineBag().getUserId().getUserId();

            //약 안먹은 회원의 가족 역할
            String familyRole = item.getMedicineBag().getUserId().getFamilyRole();

            //가족에게 숨김여부
            boolean hidden = item.getMedicineBag().isHidden();
            if (!hidden) {
                // 채팅방이 존재하는지 확인 (채팅을 한 번도 하지 않았으면 없을 수 있음)
                ChatRoomEntity chatRoom = chatRoomRepository.findById(roomId).orElse(null);
                if (chatRoom == null) {
                    log.info("가족방이 존재하지 않습니다: {}", item.getMedicationManagementId());
                    return null; // null을 반환하면 Spring Batch에서 해당 항목을 무시합니다.
                }
                //채팅방에 보낼 메시지
                String adminMessageContent =
                        familyRole + "회원님이 \n" +
                                scheduleTime.toString() + " 시간의 " + medicationBagTitle + "을 드시지 않았습니다";

                //메시지 내역 DB저장하기
                ChatMessageEntity entity = ChatMessageEntity.builder()
                        .chatRoomId(chatRoom)
                        .sender("WIN;C")
                        .message(adminMessageContent)
                        .type(MessageType.ADMIN)
                        .dateTime(LocalDateTime.now())
                        .build();
                chatMessageRepository.save(entity);


                // 채팅방으로 메시지 보내는 로직
                ChatMessage adminMessage = new ChatMessage();
                adminMessage.setType(MessageType.ADMIN);
                adminMessage.setRoomId(roomId);
                adminMessage.setSender("WIN;C");
                adminMessage.setMessage(adminMessageContent);
                adminMessage.setTime(LocalDateTime.now());

                try {
                    // 메시지 전송 로직
                    messagingTemplate.convertAndSend("/sub/chat/room/" + roomId, adminMessage);
                    log.info("관리자 메시지가 전송되었습니다: {}", adminMessageContent);
                } catch (Exception e) {
                    log.error("메시지 전송 실패: {}", e.getMessage(), e);
                    // 필요한 경우, 실패 항목을 별도 저장 또는 기록
                }


                item.setBatchCheckTime(LocalDateTime.now());

            } else {
                log.info("공개 거부 메시지 입니다 , medicationManagementId: {}", item.getMedicationManagementId());
                return null;
            }

            return item;
        };
    }


    @Bean
    public RepositoryItemWriter<MedicationManagementEntity> chatNotificationWriter() {
        return new RepositoryItemWriterBuilder<MedicationManagementEntity>()
                .repository(medicationManegementRepository)
                .methodName("save")
                .build();
    }
}
