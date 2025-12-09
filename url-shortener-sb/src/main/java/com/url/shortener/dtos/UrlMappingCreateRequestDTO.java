package com.url.shortener.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UrlMappingCreateRequestDTO {

    private String originalUrl;

    // optional Custom slug url
    private String customAlias;

    // optional expiration
    private LocalDateTime expiresAt;

    // optional access protection
    private Boolean isProtected = false;
    private String password; // there will be hashed in Service layer

    // optional category (user assigned or AI-generated)
    private String category;
}
