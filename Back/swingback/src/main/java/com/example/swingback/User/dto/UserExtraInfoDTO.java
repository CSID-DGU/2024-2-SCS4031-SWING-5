package com.example.swingback.User.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserExtraInfoDTO {

    @NotEmpty(message = "구성원 별명은 필수항목입니다.")
    private String familyRole;
    @NotEmpty(message = "전화번호는 필수항목입니다.")
    private String phoneNumber;

    @NotEmpty(message = "성별은 필수항목입니다.")
    private String gender;

    @NotNull(message = "나이는 필수항목입니다.")
    @Min(value = 0, message = "나이는 0 이상이어야 합니다.")
    private Long age;


}
