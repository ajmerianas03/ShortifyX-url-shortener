package com.url.shortener.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(
        name = "url_mapping",
        indexes = {
                @Index(name = "idx_short_url", columnList = "shortUrl"),
                @Index(name = "idx_custom_alias", columnList = "customAlias")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UrlMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String originalUrl;

    @Column( unique = true)
    private String shortUrl;

    //  NEW CUSTOM SLUG SUPPORT
    @Column(unique = true)
    private String customAlias; // e.g., "/my-awesome-link"

    private boolean isCustom = false;

    // ---- SECURITY & ACCESS CONTROL ----
    private Boolean protectedUrl = false;

    private String passwordHash; // store BCrypt hash for protected URLs

    // ---- URL STATUS ----
    private Boolean isActive = true;

    private LocalDateTime expiresAt;

    // ---- AI / META FIELDS ----
    private String title;

    @Column(columnDefinition = "TEXT")
    private String metaDescription;

    @Column(columnDefinition = "TEXT")
    private String summary; // AI-generated summary

    private String category; // AI category or user-assigned tag

    private Boolean isSafe; // phishing/malicious check

    private Double safetyScore;

    // ---- ANALYTICS ----
    private int clickCount = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    private LocalDateTime updatedDate;

    private int lastStatusCode;

    private LocalDateTime lastChecked; // for link health checks

    // ---- RELATIONSHIPS ----
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "urlMapping", cascade = CascadeType.ALL)
    private List<ClickEvent> clickEvents;

}
