// Flight planning calculations based on aviation formulary
// Reference: https://edwilliams.org/avform147.htm

export interface Airport {
  icao: string;
  name: string;
  lat: number;
  lon: number;
  elevation: number; // feet
}

export interface FlightPlanData {
  departure: Airport;
  destination: Airport;
  cruiseAltitude: number; // feet
  cruiseSpeed: number; // knots TAS
  fuelConsumption: number; // liters per hour
  aircraftType: string;
}

export interface FlightPlanResult {
  distance: number; // nautical miles
  trueCourse: number; // degrees
  magneticCourse: number; // degrees
  estimatedTime: number; // minutes
  fuelRequired: number; // liters
  fuelReserve: number; // liters (45 min reserve)
  totalFuel: number; // liters
}

// Convert degrees to radians
const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

// Convert radians to degrees
const toDegrees = (radians: number): number => radians * (180 / Math.PI);

// Calculate great circle distance between two points (Haversine formula)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3440.065; // Earth radius in nautical miles
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

// Calculate initial true course (bearing) between two points
export const calculateTrueCourse = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const dLon = toRadians(lon2 - lon1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  
  let course = toDegrees(Math.atan2(y, x));
  
  // Normalize to 0-360
  course = (course + 360) % 360;
  
  return Math.round(course);
};

// Calculate magnetic course (simplified - uses average magnetic variation for Poland ~4°E)
export const calculateMagneticCourse = (trueCourse: number, magneticVariation: number = 4): number => {
  let magneticCourse = trueCourse - magneticVariation;
  
  // Normalize to 0-360
  if (magneticCourse < 0) magneticCourse += 360;
  if (magneticCourse >= 360) magneticCourse -= 360;
  
  return Math.round(magneticCourse);
};

// Calculate estimated time enroute
export const calculateETE = (distance: number, speed: number): number => {
  // Time in minutes = (distance in NM / speed in knots) * 60
  return Math.round((distance / speed) * 60);
};

// Calculate fuel required
export const calculateFuelRequired = (timeMinutes: number, fuelConsumptionPerHour: number): number => {
  return Math.round((timeMinutes / 60) * fuelConsumptionPerHour * 10) / 10;
};

// Calculate fuel reserve (45 minutes as per EASA regulations)
export const calculateFuelReserve = (fuelConsumptionPerHour: number): number => {
  return Math.round((45 / 60) * fuelConsumptionPerHour * 10) / 10;
};

// Main flight plan calculation function
export const calculateFlightPlan = (data: FlightPlanData): FlightPlanResult => {
  const distance = calculateDistance(
    data.departure.lat,
    data.departure.lon,
    data.destination.lat,
    data.destination.lon
  );
  
  const trueCourse = calculateTrueCourse(
    data.departure.lat,
    data.departure.lon,
    data.destination.lat,
    data.destination.lon
  );
  
  const magneticCourse = calculateMagneticCourse(trueCourse);
  
  const estimatedTime = calculateETE(distance, data.cruiseSpeed);
  
  const fuelRequired = calculateFuelRequired(estimatedTime, data.fuelConsumption);
  
  const fuelReserve = calculateFuelReserve(data.fuelConsumption);
  
  const totalFuel = Math.round((fuelRequired + fuelReserve) * 10) / 10;
  
  return {
    distance,
    trueCourse,
    magneticCourse,
    estimatedTime,
    fuelRequired,
    fuelReserve,
    totalFuel,
  };
};

// Popular Polish airports database
export const POLISH_AIRPORTS: Airport[] = [
  { icao: "EPWA", name: "Warsaw Chopin", lat: 52.1657, lon: 20.9671, elevation: 361 },
  { icao: "EPKK", name: "Kraków Balice", lat: 50.0777, lon: 19.7848, elevation: 791 },
  { icao: "EPGD", name: "Gdańsk Rębiechowo", lat: 54.3776, lon: 18.4662, elevation: 489 },
  { icao: "EPWR", name: "Wrocław Strachowice", lat: 51.1027, lon: 16.8858, elevation: 404 },
  { icao: "EPPO", name: "Poznań Ławica", lat: 52.4210, lon: 16.8263, elevation: 308 },
  { icao: "EPKT", name: "Katowice Pyrzowice", lat: 50.4743, lon: 19.0800, elevation: 995 },
  { icao: "EPRZ", name: "Rzeszów Jasionka", lat: 50.1100, lon: 22.0190, elevation: 675 },
  { icao: "EPSC", name: "Szczecin Goleniów", lat: 53.5847, lon: 14.9022, elevation: 154 },
  { icao: "EPBY", name: "Bydgoszcz", lat: 53.0968, lon: 17.9777, elevation: 235 },
  { icao: "EPLB", name: "Lublin", lat: 51.2403, lon: 22.7136, elevation: 633 },
  { icao: "EPLL", name: "Łódź Lublinek", lat: 51.7219, lon: 19.3981, elevation: 604 },
  { icao: "EPMO", name: "Modlin", lat: 52.4511, lon: 20.6518, elevation: 341 },
];

// Format time in HH:MM format
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};
