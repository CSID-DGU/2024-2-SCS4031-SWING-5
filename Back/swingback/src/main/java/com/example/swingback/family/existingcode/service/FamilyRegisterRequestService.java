package com.example.swingback.family.existingcode.service;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.commons.NotificationType;
import com.example.swingback.error.CustomException;
import com.example.swingback.family.existingcode.dto.FamilyRegisterRequestDTO;
import com.example.swingback.family.existingcode.dto.FamilyRegisterResponseDTO;
import com.example.swingback.family.newcode.entity.FamilyEntity;
import com.example.swingback.family.newcode.repository.FamilyRepository;
import com.example.swingback.notification.fcmtest.service.FCMService;
import com.example.swingback.notification.message.dto.MessageTemplateDTO;
import com.example.swingback.notification.message.service.MessageTemplateService;
import com.example.swingback.notification.token.entity.FCMTokenEntity;
import com.example.swingback.notification.token.repository.FCMTokenRepository;
import com.example.swingback.notification.total.service.TotalNotificationService;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;


@Service
@RequiredArgsConstructor
@Slf4j
public class FamilyRegisterRequestService {

    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    private final FCMTokenRepository fcmTokenRepository;
    private final TotalNotificationService totalNotificationService;
    private final MessageTemplateService messageTemplateService;
    private final FCMService fcmService;

    public void findFamilyIdAndRequest(FamilyRegisterRequestDTO familyRegisterRequestDTO) {
        //요청을 보내는 회원의 회원정보 가져오기
        UserEntity requestUserEntity =
                userRepository.findByUserId(familyRegisterRequestDTO.getRequestUserId());
        // 요청한 사용자 ID가 유효한지 확인
        if (requestUserEntity == null) {
            throw new CustomException("유효하지 않은 사용자입니다. 요청한 사용자를 확인해주세요.");
        }
        // 요청한 사용자 ID가 유효한지 확인
        if (requestUserEntity.getFamily() != null) {
            throw new CustomException("이미 가족에 가입되어있습니다.");
        }
        //가족 코드가 db에 존재하는지 확인
        Optional<FamilyEntity> byFamilyId =
                familyRepository.findByFamilyId(familyRegisterRequestDTO.getFamilyCode());
        //가족코드 db에 존재하지 않으면 오류메시지 보내기
        if (byFamilyId.isEmpty()) {
            throw new CustomException("코드를 다시 확인해주세요 !");
        }

        // 가족 코드가 db에 존재하므로 가족 대표 id 가져옴
//        Long familyRepresentativeId = byFamilyId.get().getFamilyRepresentative();
        UserEntity responseUser =
                userRepository.findByUserId(byFamilyId.get().getFamilyRepresentative());
        List<FCMTokenEntity> allByUserId =
                fcmTokenRepository.findAllByUserId(userRepository.findByUserId(responseUser.getUserId()));

        // 가장 최근의 recentUseDate가 있는 FCMTokenEntity 가져오기
        FCMTokenEntity latestTokenEntity = allByUserId.stream()
                .max(Comparator.comparing(FCMTokenEntity::getRecentUseDate))
                .orElse(null); // 리스트가 비어있을 경우 null 반환

        if (latestTokenEntity==null) {
            throw new CustomException("해당 회원은 알림을 받을 수 없는 상태입니다.");
        }
        //메시지 템플릿
        Long messageTemplate = 1L;
        Map<String, String> name = Map.of("name", requestUserEntity.getName());

//        totalNotificationService
//                .saveNotification(NotificationType.FAMILY_REQUEST.getDescription(),
//                        requestUserEntity.getUserId(),
//                        responseUser,
//                        false,
//                        true,
//                        new Date(),
//                        new Date(),
//                        messageTemplate,
//                        name,
//                        latestTokenEntity.getToken());

                /*
        알림보낼 메시지 템플릿을 불러옴
        messageTemplate : 템플릿 번호
        variables : 템플릿에 변수를 추가해서 변수를 어떻게 바꿔서 보여줄지 설정하는 부분
         */
        LocalDateTime now = LocalDateTime.now();
        MessageTemplateDTO messageTemplateDTO = messageTemplateService.generateMessage(messageTemplate, name);
        totalNotificationService
                .saveNotification(NotificationType.FAMILY_REQUEST.getDescription(),
                        requestUserEntity.getUserId(),
                        responseUser,
                        false,
                        true,
                        now,
                        null,
                        messageTemplateDTO
                        );
        // FCM알림 전송
//        fcmService.sendNotification(latestTokenEntity.getToken(),messageTemplateDTO.getTitle(),messageTemplateDTO.getBody());
    }

    public void requestAccept(FamilyRegisterResponseDTO familyRegisterResponseDTO) {
        // request : 요청승인한 회원 , repose : 요청 승인 알람 받는사람

        // dto에서 받아온 요청승인한 회원(requestUserId)의 가족 entity를 찾아와서 반환
        FamilyEntity byFamilyRepresentative =
                familyRepository.findByFamilyRepresentative(familyRegisterResponseDTO.getRequestUserId());
        // dto에서 받아온 승인 알람받을 회원(responseUserId)의 유저테이블 entity를 찾아와 반환
        UserEntity responseId =
                userRepository.findByUserId(familyRegisterResponseDTO.getResponseUserId());
        //해당 유저를 요청승인한 회원(requestUserId)의 가족으로 업데이트 후 회원을 db에저장
        responseId.updateFamily(byFamilyRepresentative);
        userRepository.save(responseId);

        // 알람받을 회원(responseUserId)에게 메시지를 보내기위해(누가 보낸건지 확인용) 요청승인회원 정보 유저테이블에서 찾아오기
        UserEntity requestUserEntity =
                userRepository.findByUserId(familyRegisterResponseDTO.getRequestUserId());

        List<FCMTokenEntity> allByUserId =
                fcmTokenRepository.findAllByUserId(userRepository.findByUserId(familyRegisterResponseDTO.getResponseUserId()));

        // 가장 최근의 recentUseDate가 있는 FCMTokenEntity 가져오기
        FCMTokenEntity latestTokenEntity = allByUserId.stream()
                .max(Comparator.comparing(FCMTokenEntity::getRecentUseDate))
                .orElse(null); // 리스트가 비어있을 경우 null 반환

        if (latestTokenEntity==null) {
            throw new CustomException("해당 회원은 알림을 받을 수 없는 상태입니다.");
        }

        //메시지 템플릿
        Long messageTemplate = 2L;
        Map<String, String> name = Map.of("name", requestUserEntity.getName());

        LocalDateTime now = LocalDateTime.now();
        MessageTemplateDTO messageTemplateDTO = messageTemplateService.generateMessage(messageTemplate, name);
        totalNotificationService
                .saveNotification(NotificationType.FAMILY_APPROVED.getDescription(),
                        requestUserEntity.getUserId(),
                        responseId,
                        false,
                        true,
                        now,
                        null,
                        messageTemplateDTO
                        );
        // FCM알림 전송
//        fcmService.sendNotification(latestTokenEntity.getToken(),messageTemplateDTO.getTitle(),messageTemplateDTO.getBody());

    }


    public void requestReject(FamilyRegisterResponseDTO familyRegisterResponseDTO) {
        // request : 요청승인한 회원 , repose : 요청 승인 알람 받는사람

        // 알림받는 회원 id의 entity
        UserEntity responseIdEntity
                = userRepository.findByUserId(familyRegisterResponseDTO.getResponseUserId());

        // 거절한 회원 id의 entity
        UserEntity requestIdEntity
                = userRepository.findByUserId(familyRegisterResponseDTO.getRequestUserId());


        //------- 나중에 여기부터
        List<FCMTokenEntity> allByUserId =
                fcmTokenRepository.findAllByUserId(responseIdEntity);

        // 가장 최근의 recentUseDate가 있는 FCMTokenEntity 가져오기
        FCMTokenEntity latestTokenEntity = allByUserId.stream()
                .max(Comparator.comparing(FCMTokenEntity::getRecentUseDate))
                .orElse(null); // 리스트가 비어있을 경우 null 반환

        if (latestTokenEntity==null) {
            throw new CustomException("해당 회원은 알림을 받을 수 없는 상태입니다.");
        }
        //--------여기까지 함수로 만들어서 사용하는 리팩토링 해야할듯

        LocalDateTime now = LocalDateTime.now();
        //메시지 템플릿
        Long messageTemplate = 3L;
        Map<String, String> name = Map.of("name", requestIdEntity.getName());

        MessageTemplateDTO messageTemplateDTO = messageTemplateService.generateMessage(messageTemplate, name);
        totalNotificationService
                .saveNotification(NotificationType.FAMILY_DENIED.getDescription(),
                        requestIdEntity.getUserId(),
                        responseIdEntity,
                        false,
                        true,
                        now,
                        null,
                        messageTemplateDTO);
        // FCM알림 전송
//        fcmService.sendNotification(latestTokenEntity.getToken(),messageTemplateDTO.getTitle(),messageTemplateDTO.getBody());
    }

    public String deleteFamily(Long userId) {
        // 1. 요청 사용자 정보 가져오기
        UserEntity requestUser = userRepository.findByUserId(userId);
        // 요청한 사용자 ID가 유효한지 확인
        if (requestUser == null) {
            throw new CustomException("유효하지 않은 사용자입니다. 요청한 사용자를 확인해주세요.");
        }

        // 2. 가족 대표 여부 확인
        FamilyEntity familyEntity = familyRepository.findByFamilyRepresentative(userId);

        if (familyEntity != null) {
            return handleFamilyRepresentativeDeletion(requestUser, familyEntity);
        } else {
            // 3. 가족 대표가 아닌 경우 처리
            detachUserFromFamily(requestUser);
            return "삭제 완료";
        }
    }

    private String handleFamilyRepresentativeDeletion(UserEntity requestUser, FamilyEntity familyEntity) {
        List<UserEntity> familyMembers = userRepository.findByFamily(familyEntity);

        if (familyMembers.size() == 1) {
            // 가족에 유일한 사용자일 경우
            detachUserFromFamily(requestUser);
            familyRepository.delete(familyEntity);
            return "탈퇴 완료";
        } else {
            throw new CustomException("다른 가족들이 모두 탈퇴한 후에만 탈퇴가 가능합니다.");
        }
    }

    private void detachUserFromFamily(UserEntity user) {
        user.updateFamily(null);
        userRepository.save(user);
    }
}
