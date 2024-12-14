package com.example.swingback.family.familyinfo.service;

import com.example.swingback.User.entity.UserEntity;
import com.example.swingback.User.repository.UserRepository;
import com.example.swingback.error.CustomException;
import com.example.swingback.family.familyinfo.dto.FamilyInfoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FamilyInfoService {

    private final UserRepository userRepository;
    public List<FamilyInfoDTO> findFamilyInfo(Long userId) {
        UserEntity byUserId = userRepository.findByUserId(userId);
        if (byUserId == null) {
            throw new CustomException("유저가 존재하지 않습니다");
        }
        List<UserEntity> byFamily = userRepository.findByFamily(byUserId.getFamily());
        List<FamilyInfoDTO> familyInfoDTOList= new ArrayList<>();
        for (UserEntity userEntity : byFamily) {
            if (byUserId.getUserId() != userEntity.getUserId()) {
                FamilyInfoDTO familyInfoDTO = FamilyInfoDTO.builder()
                        .userId(userEntity.getUserId())
                        .familyRole(userEntity.getFamilyRole())
                        .name(userEntity.getName())
                        .build();
                familyInfoDTOList.add(familyInfoDTO);
            }
        }
        return familyInfoDTOList;

    }

}
