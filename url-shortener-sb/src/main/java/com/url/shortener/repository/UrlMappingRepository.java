package com.url.shortener.repository;

import com.url.shortener.models.UrlMapping;
import com.url.shortener.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {

    // ---------------------------------------
    // Find URL by short URL slug
    // ---------------------------------------
    Optional<UrlMapping> findByShortUrl(String shortUrl);

    // ---------------------------------------
    // Check custom alias availability
    // ---------------------------------------
    boolean existsByCustomAlias(String customAlias);

    // ---------------------------------------
    // List URLs owned by user
    // ---------------------------------------
    List<UrlMapping> findByUser(User user);


    // ---------------------------------------
    // Analytics: Fetch URLs for a user
    // (Optional, but useful for aggregation)
    // ---------------------------------------
    @Query("""
           SELECT u 
           FROM UrlMapping u 
           WHERE u.user.id = :userId
           """)
    List<UrlMapping> findAllByUserId(Long userId);


    // ---------------------------------------
    // Optional: URLs expiring before specific date
    // (Useful for cleanup jobs)
    // ---------------------------------------
    List<UrlMapping> findByExpiresAtBefore(LocalDateTime date);


    // ---------------------------------------
    // Optional: Find inactive URLs for maintenance
    // ---------------------------------------
    List<UrlMapping> findByIsActiveFalse();

    @Query("""
       SELECT u FROM UrlMapping u 
       WHERE u.user.id = :userId
         AND (LOWER(u.originalUrl) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(u.shortUrl) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(u.customAlias) LIKE LOWER(CONCAT('%', :keyword, '%')))
       """)
    List<UrlMapping> searchUserUrls(Long userId, String keyword);
    Optional<UrlMapping> findByShortUrlOrCustomAlias(String shortUrl, String customAlias);



    Optional<UrlMapping> findByCustomAlias(String customAlias);






}
