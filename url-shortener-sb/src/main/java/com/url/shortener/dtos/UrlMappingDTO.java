package com.url.shortener.dtos;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrlMappingDTO {

    private Long id;
    private String originalUrl;
    private String shortUrl;
    private String customAlias;
    private boolean isCustom;

    private Boolean protectedUrl;
    private Boolean active;
    private LocalDateTime expiresAt;

    private String title;
    private String metaDescription;
    private String summary;
    private String category;

    private Boolean isSafe;
    private Double safetyScore;

    private int clickCount;

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    private Integer lastStatusCode;
    private LocalDateTime lastChecked;

    private String username;
}
