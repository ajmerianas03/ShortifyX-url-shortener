package com.url.shortener.service;

import com.url.shortener.dtos.*;
import com.url.shortener.models.UrlMapping;
import com.url.shortener.models.User;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface UrlMappingService {

    UrlMapping getOriginalUrl(String shortUrl, HttpServletRequest request);

    UrlMapping getOriginalUrl(String shortUrl);

    UrlMappingDTO createShortUrl(UrlMappingCreateRequestDTO request, User user);

    UrlMappingDTO getUrlDetailsForOwner(String shortUrl, User user);

    List<UrlMappingDTO> getUrlsByUser(User user);

    UrlMappingDTO updateUrl(String shortUrl, UrlMappingUpdateRequestDTO request, User user);

    void deleteUrl(String shortUrl, User user);

    List<ClickEventDTO> getClickEventsByDateForUser(
            String shortUrl,
            User user,
            LocalDateTime start,
            LocalDateTime end
    );

    Map<LocalDate, Long> getTotalClicksByUserAndDate(
            User user,
            LocalDate start,
            LocalDate end
    );
}
