package com.url.shortener.dtos;

import lombok.Data;

@Data
public class UrlSummaryDTO {

    private String title;
    private String metaDescription;
    private String summary;
    private String category;
    private Boolean isSafe;
    private Double safetyScore;
}
