package com.tikitt.repository;

import com.tikitt.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    @Query("SELECT DISTINCT r.source FROM Route r UNION SELECT DISTINCT r.destination FROM Route r")
    List<String> findAllUniqueCities();
}
