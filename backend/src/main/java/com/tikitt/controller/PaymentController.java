package com.tikitt.controller;

import com.tikitt.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/order/{bookingId}")
    public ResponseEntity<?> createPaymentOrder(@PathVariable Long bookingId) {
        try {
            return ResponseEntity.ok(paymentService.createPaymentOrder(bookingId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        try {
            String orderId = request.get("orderId");
            String status = request.get("status");
            return ResponseEntity.ok(paymentService.verifyPayment(orderId, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
