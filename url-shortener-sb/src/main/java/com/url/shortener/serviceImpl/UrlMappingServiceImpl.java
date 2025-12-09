package com.url.shortener.serviceImpl;

import com.url.shortener.dtos.*;
import com.url.shortener.models.ClickEvent;
import com.url.shortener.models.UrlMapping;
import com.url.shortener.models.User;
import com.url.shortener.repository.ClickEventRepository;
import com.url.shortener.repository.UrlMappingRepository;
import com.url.shortener.service.UrlMappingService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UrlMappingServiceImpl implements UrlMappingService {

    private final UrlMappingRepository urlMappingRepository;
    private final ClickEventRepository clickEventRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public UrlMapping getOriginalUrl(String shortUrl, HttpServletRequest request) {

        UrlMapping mapping = urlMappingRepository
                .findByShortUrlOrCustomAlias(shortUrl, shortUrl)
                .orElseThrow(() -> new RuntimeException("Short URL not found"));

        if (mapping.getIsActive() != null && !mapping.getIsActive()) {
            throw new RuntimeException("This short URL is disabled.");
        }

        if (mapping.getExpiresAt() != null &&
                mapping.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("This short URL has expired.");
        }

        // Increment click count
        mapping.setClickCount(mapping.getClickCount() + 1);
        urlMappingRepository.save(mapping);

        // --- Capture click event ---
        ClickEvent clickEvent = ClickEvent.builder()
                .urlMapping(mapping)
                .clickDate(LocalDateTime.now())
                .ipAddress(getClientIp(request))
                .userAgent(request.getHeader("User-Agent"))
                .referer(request.getHeader("Referer"))
                .deviceType(detectDeviceType(request.getHeader("User-Agent")))
                .browser(detectBrowser(request.getHeader("User-Agent")))
                .os(detectOS(request.getHeader("User-Agent")))
                .responseStatus(302)
                .build();

        clickEventRepository.save(clickEvent);

        return mapping;
    }

    @Override
    public UrlMapping getOriginalUrl(String shortUrl) {

        // 1. look up by shortUrl or custom alias
        UrlMapping mapping = urlMappingRepository
                .findByShortUrlOrCustomAlias(shortUrl, shortUrl)
                .orElseThrow(() -> new RuntimeException("Short URL not found"));

        // 2. check if is active
        if (mapping.getIsActive() != null && !mapping.getIsActive()) {
            throw new RuntimeException("This short URL is disabled.");
        }

        // 3. check the expiration
        if (mapping.getExpiresAt() != null &&
                mapping.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("This short URL has expired.");
        }

        // 4. increasing click count
        mapping.setClickCount(mapping.getClickCount() + 1);
        urlMappingRepository.save(mapping);


        return mapping;
    }


    // ============================================
    // CREATE SHORT URL
    // ============================================
    @Override
    @Transactional
    public UrlMappingDTO createShortUrl(UrlMappingCreateRequestDTO request, User user) {
        System.out.println("under service impl");

        // Validating custom alias
        if (request.getCustomAlias() != null && urlMappingRepository.existsByCustomAlias(request.getCustomAlias())) {
            throw new RuntimeException("Custom alias already exists: " + request.getCustomAlias());
        }

        //  create URL Mapping Entity -----
        UrlMapping url = UrlMapping.builder()
                .originalUrl(request.getOriginalUrl())
                .customAlias(request.getCustomAlias())
                .isCustom(request.getCustomAlias() != null)
                .expiresAt(request.getExpiresAt())
                .protectedUrl(request.getPassword() != null)
                .passwordHash(request.getPassword() != null ? passwordEncoder.encode(request.getPassword()) : null)
                .isActive(true)
                .user(user)
                .build();


        url = urlMappingRepository.save(url);

        // ----- Generate short code using Base62 -----
        url.setShortUrl(generateShortUrlFromId(url.getId()));

        // FINAL SAVE
        UrlMapping saved = urlMappingRepository.save(url);

        return mapToDTO(saved);
    }

    private String generateShortUrlFromId(Long id) {
        String base62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder sb = new StringBuilder();

        long n = id;
        while (n > 0) {
            sb.append(base62.charAt((int) (n % 62)));
            n /= 62;
        }

        return sb.reverse().toString();
    }

    // ============================================
    // GET DETAILS FOR OWNER ONLY
    // ============================================
    @Override
    public UrlMappingDTO getUrlDetailsForOwner(String shortUrl, User user) {
        UrlMapping url = getOwnedUrl(shortUrl, user);
        return mapToDTO(url);
    }

    // ============================================
    // LIST URLs FOR USER
    // ============================================
    @Override
    public List<UrlMappingDTO> getUrlsByUser(User user) {
        return urlMappingRepository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ============================================
    // UPDATE URL
    // ============================================
    @Override
    @Transactional
    public UrlMappingDTO updateUrl(String shortUrl, UrlMappingUpdateRequestDTO request, User user) {

        UrlMapping url = getOwnedUrl(shortUrl, user);

        if (request.getExpiresAt() != null)
            url.setExpiresAt(request.getExpiresAt());

        if (request.getIsActive() != null)
            url.setIsActive(request.getIsActive());

        if (request.getPassword() != null) {
            url.setProtectedUrl(true);
            url.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRemovePassword() != null && request.getRemovePassword()) {
            url.setProtectedUrl(false);
            url.setPasswordHash(null);
        }

        if (request.getCategory() != null)
            url.setCategory(request.getCategory());

        UrlMapping saved = urlMappingRepository.save(url);
        return mapToDTO(saved);
    }

    // ============================================
    // DELETE URL
    // ============================================
    @Override
    @Transactional
    public void deleteUrl(String shortUrl, User user) {
        UrlMapping url = getOwnedUrl(shortUrl, user);
        urlMappingRepository.delete(url);
    }

    // ============================================
    // ANALYTICS: EVENTS BY DATE FOR OWNER
    // ============================================
    @Override
    public List<ClickEventDTO> getClickEventsByDateForUser(
            String shortUrl,
            User user,
            LocalDateTime start,
            LocalDateTime end
    ) {
        System.out.println("inside servieimpl");
        UrlMapping url = getOwnedUrl(shortUrl, user);

        System.out.println("start date "+ start +" end date  "+ end);
        List<ClickEvent> events = clickEventRepository
                .findByUrlMappingAndClickDateBetween(url, start, end);

        return events.stream()
                .map(this::mapClickToDTO)
                .collect(Collectors.toList());
    }

    // ============================================
    // ANALYTICS: AGGREGATED CLICKS
    // ============================================
    @Override
    public Map<LocalDate, Long> getTotalClicksByUserAndDate(
            User user,
            LocalDate start,
            LocalDate end
    ) {
        List<ClickEvent> events =
                clickEventRepository.findByUserAndDateRange(user, start.atStartOfDay(), end.plusDays(1).atStartOfDay());

        return events.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getClickDate().toLocalDate(),
                        Collectors.counting()
                ));
    }

    // ============================================
    // HELPER: VALIDATE USER OWNS URL
    // ============================================
    private UrlMapping getOwnedUrl(String shortUrl, User user) {
        UrlMapping url = urlMappingRepository.findByShortUrl(shortUrl)
                .orElseThrow(() -> new RuntimeException("URL not found"));

        if (!url.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to access this URL");
        }
        return url;
    }

    // ============================================
    // DTO MAPPERS
    // ============================================
    private UrlMappingDTO mapToDTO(UrlMapping url) {
        return UrlMappingDTO.builder()
                .id(url.getId())
                .originalUrl(url.getOriginalUrl())
                .shortUrl(url.getShortUrl())
                .customAlias(url.getCustomAlias())
                .isCustom(url.isCustom())
                .protectedUrl(url.getProtectedUrl())
                .active(url.getIsActive())
                .expiresAt(url.getExpiresAt())
                .title(url.getTitle())
                .metaDescription(url.getMetaDescription())
                .summary(url.getSummary())
                .category(url.getCategory())
                .isSafe(url.getIsSafe())
                .safetyScore(url.getSafetyScore())
                .clickCount(url.getClickCount())
                .createdDate(url.getCreatedDate())
                .updatedDate(url.getUpdatedDate())
                .lastStatusCode(url.getLastStatusCode())
                .lastChecked(url.getLastChecked())
                .username(url.getUser().getUsername())
                .build();
    }

    private ClickEventDTO mapClickToDTO(ClickEvent ce) {
        return ClickEventDTO.builder()
                .id(ce.getId())
                .clickDate(ce.getClickDate())
                .ipAddress(ce.getIpAddress())
                .country(ce.getCountry())
                .browser(ce.getBrowser())
                .deviceType(ce.getDeviceType())
                .referer(ce.getReferer())
                .isBot(ce.getIsBot())
                .build();
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0]; // first IP in the list
    }
    private String detectDeviceType(String userAgent) {
        if (userAgent == null) return "unknown";
        userAgent = userAgent.toLowerCase();
        if (userAgent.contains("mobile")) return "mobile";
        if (userAgent.contains("tablet")) return "tablet";
        return "desktop";
    }
    private String detectBrowser(String userAgent) {
        if (userAgent == null) return "unknown";
        if (userAgent.contains("Chrome")) return "Chrome";
        if (userAgent.contains("Firefox")) return "Firefox";
        if (userAgent.contains("Safari")) return "Safari";
        return "Other";
    }

    private String detectOS(String userAgent) {
        if (userAgent == null) return "unknown";
        if (userAgent.contains("Windows")) return "Windows";
        if (userAgent.contains("Mac")) return "MacOS";
        if (userAgent.contains("Linux")) return "Linux";
        if (userAgent.contains("Android")) return "Android";
        if (userAgent.contains("iPhone") || userAgent.contains("iPad")) return "iOS";
        return "Other";
    }

}
