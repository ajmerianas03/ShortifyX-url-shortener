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
public class ClickEventDTO {

    private Long id;

    private LocalDateTime clickDate;

    private String ipAddress;
    private String userAgent;
    private String referer;

    private String country;
    private String region;
    private String city;

    private String deviceType;
    private String os;
    private String browser;

    private Boolean isBot;

    private Integer responseStatus;
    private Integer latencyMs;
}
