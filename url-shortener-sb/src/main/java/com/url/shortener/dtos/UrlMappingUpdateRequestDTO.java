package com.url.shortener.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UrlMappingUpdateRequestDTO {

    private String customAlias;       // optional
    private Boolean isActive;         // optional
    private LocalDateTime expiresAt;  // optional

    private Boolean isProtected;      // optional
    private String password;          // optional

    // IMPORTANT: remove password flag
    private Boolean removePassword;   // optional

    // OPTIONAL: for AI fields
    private String title;
    private String metaDescription;
    private String summary;
    private String category;
}
