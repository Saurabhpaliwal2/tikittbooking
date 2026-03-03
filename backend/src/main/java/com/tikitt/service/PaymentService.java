package com.tikitt.service;

import com.tikitt.entity.Booking;
import com.tikitt.entity.Payment;
import com.tikitt.entity.PaymentStatus;
import com.tikitt.repository.BookingRepository;
import com.tikitt.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public Map<String, Object> createPaymentOrder(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Booking is already processed or cancelled");
        }

        // Simulating Razorpay/External Order Creation
        String orderId = "ORDER_" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();

        Payment payment = new Payment();
        payment.setBookingId(bookingId);
        payment.setAmount(booking.getTotalAmount());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionId(orderId); // Using orderId as dummy transactionId initially
        paymentRepository.save(payment);

        return Map.of(
                "orderId", orderId,
                "amount", booking.getTotalAmount(),
                "currency", "INR",
                "bookingId", bookingId);
    }

    @Transactional
    public Payment verifyPayment(String orderId, String status) {
        Payment payment = paymentRepository.findByTransactionId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment record not found"));

        if ("SUCCESS".equalsIgnoreCase(status)) {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId("TXN_" + UUID.randomUUID().toString().substring(0, 10).toUpperCase());

            Booking booking = bookingRepository.findById(payment.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            // Optional: Logic to release seats could be added here or in a separate cleanup
            // task
        }

        return paymentRepository.save(payment);
    }
}
