package com.tikitt.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
public class BookingRequest {
    @NotNull
    private Long scheduleId;
    @NotNull
    private List<Integer> seatNumbers;
    @NotBlank
    private String passengerName;
    @NotBlank
    private String passengerEmail;
    @NotBlank
    private String passengerPhone;
}
