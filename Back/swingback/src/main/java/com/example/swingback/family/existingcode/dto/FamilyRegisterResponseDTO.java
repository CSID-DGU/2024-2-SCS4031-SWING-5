package com.example.swingback.family.existingcode.dto;

import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class FamilyRegisterResponseDTO {
    private Long requestUserId;
    private Long responseUserId;
    private Boolean acceptOrReject;
}
