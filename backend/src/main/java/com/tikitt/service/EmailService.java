package com.tikitt.service;

import com.tikitt.entity.Booking;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendBookingConfirmation(Booking booking) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(booking.getPassengerEmail());
        message.setSubject("Booking Confirmed - Tikitt (PNR: " + booking.getPnr() + ")");

        String content = "Dear " + booking.getPassengerName() + ",\n\n" +
                "Your booking is confirmed! Here are your journey details:\n\n" +
                "PNR: " + booking.getPnr() + "\n" +
                "From: " + booking.getSchedule().getRoute().getSource() + "\n" +
                "To: " + booking.getSchedule().getRoute().getDestination() + "\n" +
                "Departure: " + booking.getSchedule().getDepartureTime() + "\n" +
                "Seat(s): " + booking.getSeatNumbers() + "\n" +
                "Total Amount: ₹" + booking.getTotalAmount() + "\n\n" +
                "Thank you for choosing Tikitt!";

        message.setText(content);

        try {
            mailSender.send(message);
            System.out.println("Confirmation email sent to: " + booking.getPassengerEmail());
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
