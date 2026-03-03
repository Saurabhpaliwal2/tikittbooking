package com.tikitt.controller;

import com.tikitt.entity.Schedule;
import com.tikitt.service.BusService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @GetMapping("/cities")
    public ResponseEntity<List<String>> getCities() {
        return ResponseEntity.ok(busService.getAllCities());
    }

    @GetMapping("/buses/search")
    public ResponseEntity<List<Schedule>> searchBuses(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Schedule> schedules = busService.searchSchedules(from, to, date);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/schedules")
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        return ResponseEntity.ok(busService.getAllSchedules());
    }

    @GetMapping("/schedules/{id}")
    public ResponseEntity<?> getSchedule(@PathVariable Long id) {
        return busService.getScheduleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/schedules/{id}/seats")
    public ResponseEntity<Map<String, Object>> getSeatAvailability(@PathVariable Long id) {
        return busService.getScheduleById(id)
                .map(schedule -> ResponseEntity.ok(Map.of(
                        "totalSeats", schedule.getBus().getTotalSeats(),
                        "bookedSeats", busService.getBookedSeats(id),
                        "availableSeats", schedule.getAvailableSeats())))
                .orElse(ResponseEntity.notFound().build());
    }
}
