package com.example.swingback.reward.entity;

import com.example.swingback.User.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Table(name = "reward")
public class RewardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reward_id")
    private Long rewardId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userId;

    @Column(name = "reward_point")
    private Long rewardPoint;

    @Column(name = "reward_date")
    private LocalDateTime rewardDate;

//    @Column(name = "spent_date")
//    private LocalDateTime spentDate;

    @Column(name = "acquisition_type")
    private String acquisition_type;
}
