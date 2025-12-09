package com.url.shortener.models;

import jakarta.persistence.*;
import lombok.*;


import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;



@Entity
@Data
@Table(name="users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class User {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role = "ROLE_USER";


    // new
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime lastLogin;

    private Boolean enabled = true;

}


