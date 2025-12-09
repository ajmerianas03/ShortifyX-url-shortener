package com.url.shortener.models;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
@Entity
@Table(
        name = "click_event",
        indexes = {
                @Index(name = "idx_click_url_date", columnList = "url_mapping_id, clickDate")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClickEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime clickDate;

    // ANALYTICS FIELDS
    private String ipAddress;

    @Column(columnDefinition = "TEXT")
    private String userAgent;

    private String referer;

    private String country;
    private String countryCode;
    private String region;
    private String city;

    private String deviceType; // mobile / desktop / tablet
    private String os;
    private String browser;

    private Boolean isBot = false;

    private Integer responseStatus; // redirect status (302/301)
    private Integer latencyMs; // response latency

    // RELATIONSHIP
    @ManyToOne
    @JoinColumn(name = "url_mapping_id")
    private UrlMapping urlMapping;
}
