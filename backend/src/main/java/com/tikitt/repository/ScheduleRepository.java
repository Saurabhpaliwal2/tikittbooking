package com.tikitt.repository;

import com.tikitt.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

        @Query("SELECT s FROM Schedule s WHERE " +
                        "LOWER(s.route.source) LIKE LOWER(CONCAT('%', :source, '%')) AND " +
                        "LOWER(s.route.destination) LIKE LOWER(CONCAT('%', :destination, '%')) AND " +
                        "s.travelDate = :travelDate AND " +
                        "s.availableSeats > 0")
        List<Schedule> findAvailableSchedules(
                        @Param("source") String source,
                        @Param("destination") String destination,
                        @Param("travelDate") LocalDate travelDate);
}
