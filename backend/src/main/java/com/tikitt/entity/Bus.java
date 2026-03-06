package com.tikitt.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "buses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String busNumber;

    @Column(nullable = false)
    private String busName;

    @Column(nullable = false)
    private Integer totalSeats;

    @Enumerated(EnumType.STRING)
    private BusType busType;

    @Column
    private String amenities;

    @Column(nullable = false)
    private Double rating;

    @Column(nullable = false)
    private String operatorName;

    public enum BusType {
        AC_SLEEPER, AC_SEATER, NON_AC_SLEEPER, NON_AC_SEATER, VOLVO_MULTI_AXLE
    }
}
