package com.tikitt.service;

import com.tikitt.entity.Schedule;
import com.tikitt.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BusService {

    private final ScheduleRepository scheduleRepository;
    private final com.tikitt.repository.RouteRepository routeRepository;

    public BusService(ScheduleRepository scheduleRepository, com.tikitt.repository.RouteRepository routeRepository) {
        this.scheduleRepository = scheduleRepository;
        this.routeRepository = routeRepository;
    }

    public List<String> getAllCities() {
        return routeRepository.findAllUniqueCities();
    }

    public List<Schedule> searchSchedules(String source, String destination, LocalDate date) {
        return scheduleRepository.findAvailableSchedules(source, destination, date);
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public Optional<Schedule> getScheduleById(Long id) {
        return scheduleRepository.findById(id);
    }

    public List<String> getBookedSeats(Long scheduleId) {
        return scheduleRepository.findById(scheduleId)
                .map(s -> {
                    String bookedSeats = s.getBookedSeats();
                    if (bookedSeats == null || bookedSeats.isBlank())
                        return List.<String>of();
                    return List.of(bookedSeats.split(","));
                })
                .orElse(List.of());
    }
}
