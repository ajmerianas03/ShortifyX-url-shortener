package com.url.shortener.controller;

import com.url.shortener.dtos.*;
import com.url.shortener.models.User;
import com.url.shortener.service.UrlMappingService;
import com.url.shortener.serviceImpl.UserService;
import lombok.AllArgsConstructor;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/urls")
@AllArgsConstructor
public class UrlMappingController {

    private final UrlMappingService urlMappingService;
    private final UserService userService;

    // ----------------------------------------------------
    // CREATE SHORT URL
    // ----------------------------------------------------
    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDTO> createShortUrl(
            @RequestBody UrlMappingCreateRequestDTO request,
            Principal principal
    ) {
        System.out.println("under api call");
        User user = userService.findByUsername(principal.getName());
        UrlMappingDTO urlMappingDTO = urlMappingService.createShortUrl(request, user);
        return ResponseEntity.ok(urlMappingDTO);
    }

    // ----------------------------------------------------
    // GET USER URL LIST
    // ----------------------------------------------------
    @GetMapping("/myurls")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UrlMappingDTO>> getUserUrls(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        List<UrlMappingDTO> urls = urlMappingService.getUrlsByUser(user);
        return ResponseEntity.ok(urls);
    }

    // ----------------------------------------------------
    // GET SINGLE URL DETAILS
    // ----------------------------------------------------
    @GetMapping("/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDTO> getUrlDetails(
            @PathVariable String shortUrl,
            Principal principal
    ) {
        User user = userService.findByUsername(principal.getName());
        UrlMappingDTO dto = urlMappingService.getUrlDetailsForOwner(shortUrl, user);
        return ResponseEntity.ok(dto);
    }

    // ----------------------------------------------------
    // UPDATE URL SETTINGS
    // ----------------------------------------------------
    @PutMapping("/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDTO> updateUrl(
            @PathVariable String shortUrl,
            @RequestBody UrlMappingUpdateRequestDTO request,
            Principal principal
    ) {
        User user = userService.findByUsername(principal.getName());
        UrlMappingDTO dto = urlMappingService.updateUrl(shortUrl, request, user);
        return ResponseEntity.ok(dto);
    }

    // ----------------------------------------------------
    // DELETE URL
    // ----------------------------------------------------
    @DeleteMapping("/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteUrl(
            @PathVariable String shortUrl,
            Principal principal
    ) {
        User user = userService.findByUsername(principal.getName());
        urlMappingService.deleteUrl(shortUrl, user);
        return ResponseEntity.ok("URL deleted successfully");
    }

    // ----------------------------------------------------
    // ANALYTICS FOR A SPECIFIC URL
    // ----------------------------------------------------
    @GetMapping("/analytics/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ClickEventDTO>> getUrlAnalytics(
            @PathVariable String shortUrl,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            Principal principal
    ) {
        User user = userService.findByUsername(principal.getName());
        System.out.println(" here error come");
//        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
//        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
//        LocalDateTime end = LocalDateTime.parse(endDate, formatter);

        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        OffsetDateTime startOffset = OffsetDateTime.parse(startDate, formatter);
        OffsetDateTime endOffset = OffsetDateTime.parse(endDate, formatter);

// converting to LocalDateTime if you want to store without timezone
        LocalDateTime start = startOffset.toLocalDateTime();
        LocalDateTime end = endOffset.toLocalDateTime();


        List<ClickEventDTO> clickEvents =
                urlMappingService.getClickEventsByDateForUser(shortUrl, user, start, end);
        clickEvents.forEach(event -> {
            System.out.println(event);
        });
        System.out.println("helloooo  "+ clickEvents.size());

        return ResponseEntity.ok(clickEvents);
    }

    // ----------------------------------------------------
    // TOTAL CLICKS ACROSS ALL USER URLS (Dashboard)
    // ----------------------------------------------------
    @GetMapping("/totalClicks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<LocalDate, Long>> getTotalClicksByDate(
            Principal principal,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate
    ) {
        User user = userService.findByUsername(principal.getName());

        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);

        Map<LocalDate, Long> totalClicks =
                urlMappingService.getTotalClicksByUserAndDate(user, start, end);

        return ResponseEntity.ok(totalClicks);
    }
}
