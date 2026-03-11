export const mockSchedules = [
    {
        id: 1,
        bus: { name: "DL01-EX1001", operatorName: "Express Travels", busType: "AC_SEATER", rating: 4.2 },
        route: { source: "Delhi", destination: "Jaipur" },
        departureTime: "08:00",
        arrivalTime: "13:30",
        fare: 750,
        availableSeats: 40
    },
    {
        id: 2,
        bus: { name: "MH03-NR3003", operatorName: "Night Rider Services", busType: "AC_SLEEPER", rating: 4.5 },
        route: { source: "Mumbai", destination: "Pune" },
        departureTime: "21:00",
        arrivalTime: "00:00",
        fare: 950,
        availableSeats: 30
    },
    {
        id: 3,
        bus: { name: "RJ04-SD4004", operatorName: "Deluxe Omni", busType: "VOLVO_MULTI_AXLE", rating: 4.9 },
        route: { source: "Delhi", destination: "Agra" },
        departureTime: "06:00",
        arrivalTime: "10:00",
        fare: 1200,
        availableSeats: 45
    },
    {
        id: 4,
        bus: { name: "KA01-AB1234", operatorName: "Royal Travels", busType: "VOLVO_MULTI_AXLE", rating: 4.0 },
        route: { source: "Hyderabad", destination: "Bangalore" },
        departureTime: "22:00",
        arrivalTime: "06:30",
        fare: 1100,
        availableSeats: 38
    }
];

export const mockCities = ["Delhi", "Jaipur", "Mumbai", "Pune", "Agra", "Hyderabad", "Bangalore", "Chennai"];
