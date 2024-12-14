package com.example.swingback.family.familyinfo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyInfoDTO {
    private Long userId;
    private String name;
    private String familyRole;

}
