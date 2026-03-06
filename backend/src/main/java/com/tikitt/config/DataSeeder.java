package com.tikitt.config;

import com.tikitt.entity.*;
import com.tikitt.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataSeeder implements CommandLineRunner {

        private final BusRepository busRepository;
        private final RouteRepository routeRepository;
        private final ScheduleRepository scheduleRepository;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        public DataSeeder(BusRepository busRepository, RouteRepository routeRepository,
                        ScheduleRepository scheduleRepository, UserRepository userRepository,
                        PasswordEncoder passwordEncoder) {
                this.busRepository = busRepository;
                this.routeRepository = routeRepository;
                this.scheduleRepository = scheduleRepository;
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @Override
        public void run(String... args) {
                seedUsers();
                seedBuses();
                seedRoutes();
                seedSchedules();
        }

        private void seedUsers() {
                if (userRepository.count() == 0) {
                        User admin = new User(null, "Admin User", "admin@tikitt.com",
                                        passwordEncoder.encode("admin123"), User.Role.ADMIN, "9876543210");
                        User user1 = new User(null, "Rahul Sharma", "rahul@example.com",
                                        passwordEncoder.encode("password123"), User.Role.USER, "9876500001");
                        userRepository.save(admin);
                        userRepository.save(user1);
                }
        }

        private void seedBuses() {
                if (busRepository.count() == 0) {
                        busRepository.save(new Bus(null, "DL01-EX1001", "Express Bus", 40,
                                        Bus.BusType.AC_SEATER, "Charging Points, AC", 4.2, "Express Travels"));
                        busRepository.save(new Bus(null, "DL02-CT2002", "City Travels", 35,
                                        Bus.BusType.NON_AC_SEATER, "Water Bottle, Charging Points", 4.8,
                                        "City Travels Ltd"));
                        busRepository.save(new Bus(null, "MH03-NR3003", "Night Rider", 30,
                                        Bus.BusType.AC_SLEEPER, "Blanket, WiFi, Water Bottle", 4.5,
                                        "Night Rider Services"));
                        busRepository.save(new Bus(null, "RJ04-SD4004", "Super Deluxe", 45,
                                        Bus.BusType.VOLVO_MULTI_AXLE, "WiFi, Snacks, Movies, AC", 4.9, "Deluxe Omni"));

                        // Keeping previous for more variety
                        busRepository.save(new Bus(null, "KA01-AB1234", "Royal Cruiser", 40,
                                        Bus.BusType.VOLVO_MULTI_AXLE, "WiFi, USB Charging, Movies, AC", 4.0,
                                        "Royal Travels"));
                } else {
                        // Ensure existing buses have unique ratings
                        var buses = busRepository.findAll();
                        double[] ratings = { 4.2, 4.8, 4.5, 4.9, 4.0, 3.8, 4.4 };
                        for (int i = 0; i < buses.size(); i++) {
                                Bus b = buses.get(i);
                                b.setRating(ratings[i % ratings.length]);
                                busRepository.save(b);
                        }
                }
        }

        private void seedRoutes() {
                if (routeRepository.count() == 0) {
                        routeRepository.save(new Route(null, "Delhi", "Jaipur", 281, "5h 30m"));
                        routeRepository.save(new Route(null, "Delhi", "Agra", 233, "4h 00m"));
                        routeRepository.save(new Route(null, "Mumbai", "Pune", 148, "3h 00m"));
                        routeRepository.save(new Route(null, "Jaipur", "Udaipur", 394, "7h 00m"));

                        routeRepository.save(new Route(null, "Hyderabad", "Bangalore", 570, "8h 30m"));
                        routeRepository.save(new Route(null, "Bangalore", "Hyderabad", 570, "8h 30m"));
                        routeRepository.save(new Route(null, "Chennai", "Bangalore", 346, "5h 30m"));
                        routeRepository.save(new Route(null, "Bangalore", "Chennai", 346, "5h 30m"));
                        routeRepository.save(new Route(null, "Hyderabad", "Chennai", 627, "10h 00m"));
                        routeRepository.save(new Route(null, "Chennai", "Hyderabad", 627, "10h 01m"));
                        routeRepository.save(new Route(null, "Mumbai", "Bangalore", 984, "15h 00m"));
                        routeRepository.save(new Route(null, "Bangalore", "Mumbai", 984, "15h 00m"));
                }
        }

        private void seedSchedules() {
                if (scheduleRepository.count() == 0) {
                        var buses = busRepository.findAll();
                        var routes = routeRepository.findAll();
                        LocalDate today = LocalDate.now();

                        if (buses.isEmpty() || routes.isEmpty())
                                return;

                        for (Route route : routes) {
                                // Seed 30 days for each route to ensure results are always available
                                for (int day = 0; day <= 30; day++) {
                                        LocalDate date = today.plusDays(day);

                                        // Morning Bus
                                        scheduleRepository.save(new Schedule(null,
                                                        buses.get(route.getId().intValue() % buses.size()),
                                                        route, date, LocalTime.of(8, 0), LocalTime.of(16, 30),
                                                        new BigDecimal("750"), 40, ""));

                                        // Night Bus
                                        int nextBusIdx = (route.getId().intValue() + 1) % buses.size();
                                        scheduleRepository.save(new Schedule(null, buses.get(nextBusIdx),
                                                        route, date, LocalTime.of(21, 0), LocalTime.of(5, 30),
                                                        new BigDecimal("950"), 45, "1,2"));
                                }
                        }
                }
        }
}
