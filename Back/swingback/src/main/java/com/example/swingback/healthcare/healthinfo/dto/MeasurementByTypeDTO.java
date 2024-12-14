package com.example.swingback.healthcare.healthinfo.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeasurementByTypeDTO {
    private String type; // 데이터 종류 (예: bloodpressure)
    private List<MeasurementDetailDTO> measurements; // 해당 타입의 상세 데이터 리스트
}
