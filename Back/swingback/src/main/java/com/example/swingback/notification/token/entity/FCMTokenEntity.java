package com.example.swingback.notification.token.entity;

import com.example.swingback.User.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "fcm_token")
public class FCMTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Long tokenId;

    @ManyToOne
    @JoinColumn(name ="user_id")
    private UserEntity userId;

    @Column(name = "token")
    private String token;

    @Column(name = "recent_use_date")
    private Date recentUseDate;
}
