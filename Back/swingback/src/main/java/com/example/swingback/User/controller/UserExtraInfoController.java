package com.example.swingback.User.controller;

import com.example.swingback.User.Service.UserService;
import com.example.swingback.User.dto.UserExtraInfoDTO;
import com.example.swingback.User.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class UserExtraInfoController {

    private final UserService userService;



    @PostMapping("/api/extrainfo") // 유저의 추가 정보를 받아오는 컨트롤러
    public ResponseEntity<?> saveUserExtraInfo(@RequestBody UserExtraInfoDTO userExtraInfoDTO) {
        String extraInfo = userService.getExtraInfo(userExtraInfoDTO);

        return (extraInfo!=null) ?
                    ResponseEntity.status(HttpStatus.OK).body(extraInfo) :  // 성공 상태만 반환
                    ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();  // 실패 시 상태 코드만 반환
        }
}
