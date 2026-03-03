package com.tikitt.repository;

import com.tikitt.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserEmailOrderByBookingDateDesc(String email);

    Optional<Booking> findByPnr(String pnr);
}
