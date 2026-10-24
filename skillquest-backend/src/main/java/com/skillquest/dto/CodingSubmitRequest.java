package com.skillquest.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class CodingSubmitRequest {
    private String sessionKey;
    private int questionNumber;
    private String code;
}
