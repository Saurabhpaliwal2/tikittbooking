package com.tikitt.service;

import com.tikitt.dto.BookingRequest;
import com.tikitt.entity.*;
import com.tikitt.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
            ScheduleRepository scheduleRepository,
            UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.scheduleRepository = scheduleRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Booking createBooking(BookingRequest request, String userEmail) {
        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate seat availability
        List<Integer> requestedSeats = request.getSeatNumbers();
        String currentBookedSeats = schedule.getBookedSeats() == null ? "" : schedule.getBookedSeats();
        for (Integer seat : requestedSeats) {
            if (!currentBookedSeats.isBlank() &&
                    List.of(currentBookedSeats.split(",")).contains(String.valueOf(seat))) {
                throw new RuntimeException("Seat " + seat + " is already booked");
            }
        }

        // Update booked seats
        String newSeats = requestedSeats.stream().map(String::valueOf).collect(Collectors.joining(","));
        String updatedBookedSeats = currentBookedSeats.isBlank() ? newSeats : currentBookedSeats + "," + newSeats;
        schedule.setBookedSeats(updatedBookedSeats);
        schedule.setAvailableSeats(schedule.getAvailableSeats() - requestedSeats.size());
        scheduleRepository.save(schedule);

        // Calculate total amount
        BigDecimal totalAmount = schedule.getFare().multiply(BigDecimal.valueOf(requestedSeats.size()));

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setSchedule(schedule);
        booking.setSeatNumbers(newSeats);
        booking.setPassengerCount(requestedSeats.size());
        booking.setTotalAmount(totalAmount);
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setPnr("TKT" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setPassengerName(request.getPassengerName());
        booking.setPassengerEmail(request.getPassengerEmail());
        booking.setPassengerPhone(request.getPassengerPhone());

        return bookingRepository.save(booking);
    }

    public List<Booking> getMyBookings(String userEmail) {
        return bookingRepository.findByUserEmailOrderByBookingDateDesc(userEmail);
    }

    @Transactional
    public Booking cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);

        // Free up seats
        Schedule schedule = booking.getSchedule();
        String bookedSeats = schedule.getBookedSeats();
        String[] seatsToCancel = booking.getSeatNumbers().split(",");
        for (String seat : seatsToCancel) {
            bookedSeats = bookedSeats.replace("," + seat, "").replace(seat + ",", "").replace(seat, "");
        }
        schedule.setBookedSeats(bookedSeats.startsWith(",") ? bookedSeats.substring(1) : bookedSeats);
        schedule.setAvailableSeats(schedule.getAvailableSeats() + seatsToCancel.length);
        scheduleRepository.save(schedule);

        return bookingRepository.save(booking);
    }
}
