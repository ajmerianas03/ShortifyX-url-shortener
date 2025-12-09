package com.url.shortener.repository;

import com.url.shortener.models.ClickEvent;
import com.url.shortener.models.UrlMapping;
import com.url.shortener.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {

    List<ClickEvent> findByUrlMappingAndClickDateBetween(
            UrlMapping mapping,
            LocalDateTime start,
            LocalDateTime end
    );

    List<ClickEvent> findByUrlMappingInAndClickDateBetween(
            List<UrlMapping> mappings,
            LocalDateTime start,
            LocalDateTime end
    );

    // ---------- Needed for /totalClicks dashboard ----------
    @Query("""
        SELECT DATE(c.clickDate) AS date, COUNT(c) AS totalClicks
        FROM ClickEvent c
        JOIN c.urlMapping u
        WHERE u.user = :user
          AND c.clickDate BETWEEN :start AND :end
        GROUP BY DATE(c.clickDate)
        ORDER BY DATE(c.clickDate)
        """)
    List<Object[]> getTotalClicksByUserAndDate(
            User user,
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("""
    SELECT c
    FROM ClickEvent c
    JOIN c.urlMapping u
    WHERE u.user = :user
      AND c.clickDate BETWEEN :start AND :end
    ORDER BY c.clickDate DESC
    """)
    List<ClickEvent> findByUserAndDateRange(
            User user,
            LocalDateTime start,
            LocalDateTime end
    );
}
