package com.example.swingback.healthcare.healthinfo.dto;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeasurementDetailDTO {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime registrationDate; // 날짜 (LocalDateTime)

    private String measureTitle;     // 측정 세부 항목 (예: 아침)

    private Map<String, String> keyValues = new HashMap<>(); // 동적 키-값 저장

    @JsonAnyGetter
    public Map<String, String> getKeyValues() {
        return keyValues;
    }

    @JsonAnySetter
    public void setKeyValue(String key, String value) {
        this.keyValues.put(key, value);
    }
}