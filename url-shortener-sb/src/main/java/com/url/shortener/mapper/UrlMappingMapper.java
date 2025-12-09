package com.url.shortener.mapper;

import com.url.shortener.dtos.UrlMappingDTO;
import com.url.shortener.models.UrlMapping;

public class UrlMappingMapper {

    public static UrlMappingDTO toDTO(UrlMapping mapping) {
        UrlMappingDTO dto = new UrlMappingDTO();

        dto.setId(mapping.getId());
        dto.setOriginalUrl(mapping.getOriginalUrl());
        dto.setShortUrl(mapping.getShortUrl());
        dto.setCustomAlias(mapping.getCustomAlias());
        dto.setCustom(mapping.isCustom());
        dto.setProtectedUrl(mapping.getProtectedUrl());
        dto.setActive(mapping.getIsActive());
        dto.setExpiresAt(mapping.getExpiresAt());

        dto.setTitle(mapping.getTitle());
        dto.setMetaDescription(mapping.getMetaDescription());
        dto.setSummary(mapping.getSummary());
        dto.setCategory(mapping.getCategory());
        dto.setIsSafe(mapping.getIsSafe());
        dto.setSafetyScore(mapping.getSafetyScore());

        dto.setClickCount(mapping.getClickCount());
        dto.setCreatedDate(mapping.getCreatedDate());
        dto.setUpdatedDate(mapping.getUpdatedDate());
        dto.setLastStatusCode(mapping.getLastStatusCode());
        dto.setLastChecked(mapping.getLastChecked());

        dto.setUsername(mapping.getUser().getUsername());

        return dto;
    }
}

