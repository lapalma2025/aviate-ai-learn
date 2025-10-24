import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plane, MapPin, Gauge, Clock, Fuel, Navigation, FileText } from "lucide-react";
import { 
  calculateFlightPlan, 
  POLISH_AIRPORTS, 
  formatTime,
  type FlightPlanData,
  type FlightPlanResult 
} from "@/utils/flightCalculations";
import { useToast } from "@/hooks/use-toast";

const FlightPlanning = () => {
  const { toast } = useToast();
  const [departureICAO, setDepartureICAO] = useState("");
  const [destinationICAO, setDestinationICAO] = useState("");
  const [aircraftType, setAircraftType] = useState("C172");
  const [cruiseAltitude, setCruiseAltitude] = useState("3000");
  const [cruiseSpeed, setCruiseSpeed] = useState("110");
  const [fuelConsumption, setFuelConsumption] = useState("28");
  const [result, setResult] = useState<FlightPlanResult | null>(null);

  const handleCalculate = () => {
    const departure = POLISH_AIRPORTS.find(a => a.icao === departureICAO);
    const destination = POLISH_AIRPORTS.find(a => a.icao === destinationICAO);

    if (!departure || !destination) {
      toast({
        title: "Błąd",
        description: "Wybierz lotniska startowe i docelowe",
        variant: "destructive",
      });
      return;
    }

    if (departure.icao === destination.icao) {
      toast({
        title: "Błąd",
        description: "Lotnisko startowe i docelowe nie mogą być takie same",
        variant: "destructive",
      });
      return;
    }

    const planData: FlightPlanData = {
      departure,
      destination,
      cruiseAltitude: parseInt(cruiseAltitude),
      cruiseSpeed: parseInt(cruiseSpeed),
      fuelConsumption: parseFloat(fuelConsumption),
      aircraftType,
    };

    const calculated = calculateFlightPlan(planData);
    setResult(calculated);

    toast({
      title: "Plan lotu obliczony",
      description: `Dystans: ${calculated.distance} NM, Czas: ${formatTime(calculated.estimatedTime)}`,
    });
  };

  const handleReset = () => {
    setDepartureICAO("");
    setDestinationICAO("");
    setCruiseAltitude("3000");
    setCruiseSpeed("110");
    setFuelConsumption("28");
    setResult(null);
  };

  const generateICAOFlightPlan = () => {
    if (!result) return;

    const departure = POLISH_AIRPORTS.find(a => a.icao === departureICAO);
    const destination = POLISH_AIRPORTS.find(a => a.icao === destinationICAO);

    const flightPlanText = `
=== ICAO FLIGHT PLAN (VFR) ===

FIELD 7: AIRCRAFT IDENTIFICATION
  ${aircraftType}-001

FIELD 8: FLIGHT RULES AND TYPE OF FLIGHT
  V (VFR)

FIELD 9: NUMBER, TYPE OF AIRCRAFT AND WAKE TURBULENCE
  1/${aircraftType}/L

FIELD 10: EQUIPMENT
  S (Standard)

FIELD 13: DEPARTURE AERODROME AND TIME
  ${departure?.icao} (${departure?.name})
  ETD: ${new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}

FIELD 15: ROUTE
  Direct
  Cruise Speed: ${cruiseSpeed} KT
  Cruise Altitude: ${cruiseAltitude} FT
  True Course: ${result.trueCourse}°
  Magnetic Course: ${result.magneticCourse}°

FIELD 16: DESTINATION AERODROME AND EET
  ${destination?.icao} (${destination?.name})
  EET: ${formatTime(result.estimatedTime)}
  Distance: ${result.distance} NM

FIELD 18: OTHER INFORMATION
  Fuel Endurance: ${formatTime(result.estimatedTime + 45)}
  Total Fuel: ${result.totalFuel} L
    - Required: ${result.fuelRequired} L
    - Reserve (45 min): ${result.fuelReserve} L

FIELD 19: SUPPLEMENTARY INFORMATION
  E/ ${formatTime(result.estimatedTime + 45)}
  P/ (Persons on board)
  R/ (Emergency radio)
  S/ (Survival equipment)

=== NAVIGATION LOG ===

Leg: ${departure?.icao} → ${destination?.icao}
Distance: ${result.distance} NM
True Course: ${result.trueCourse}°
Magnetic Course: ${result.magneticCourse}°
Cruise Speed: ${cruiseSpeed} KT TAS
Estimated Time: ${formatTime(result.estimatedTime)}
Fuel Required: ${result.fuelRequired} L

=== FUEL PLANNING ===

Trip Fuel: ${result.fuelRequired} L
Reserve (45 min): ${result.fuelReserve} L
Total Required: ${result.totalFuel} L
Recommended Fuel: ${Math.ceil(result.totalFuel * 1.1)} L (with 10% margin)

Generated: ${new Date().toLocaleString('pl-PL')}
    `.trim();

    // Copy to clipboard
    navigator.clipboard.writeText(flightPlanText);
    
    toast({
      title: "Plan lotu skopiowany",
      description: "Format ICAO został skopiowany do schowka",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Plane className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Planowanie lotu</h1>
          <p className="text-muted-foreground">Oblicz parametry i wygeneruj plan lotu VFR</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Dane lotu
            </CardTitle>
            <CardDescription>
              Wprowadź parametry planowanego lotu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="departure">Lotnisko startu</Label>
              <Select value={departureICAO} onValueChange={setDepartureICAO}>
                <SelectTrigger id="departure">
                  <SelectValue placeholder="Wybierz lotnisko" />
                </SelectTrigger>
                <SelectContent>
                  {POLISH_AIRPORTS.map((airport) => (
                    <SelectItem key={airport.icao} value={airport.icao}>
                      {airport.icao} - {airport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="destination">Lotnisko docelowe</Label>
              <Select value={destinationICAO} onValueChange={setDestinationICAO}>
                <SelectTrigger id="destination">
                  <SelectValue placeholder="Wybierz lotnisko" />
                </SelectTrigger>
                <SelectContent>
                  {POLISH_AIRPORTS.map((airport) => (
                    <SelectItem key={airport.icao} value={airport.icao}>
                      {airport.icao} - {airport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="aircraft">Typ statku powietrznego</Label>
              <Select value={aircraftType} onValueChange={setAircraftType}>
                <SelectTrigger id="aircraft">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C172">Cessna 172</SelectItem>
                  <SelectItem value="C152">Cessna 152</SelectItem>
                  <SelectItem value="PA28">Piper PA-28</SelectItem>
                  <SelectItem value="DA40">Diamond DA-40</SelectItem>
                  <SelectItem value="PA34">Piper PA-34 Seneca</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="altitude">Wysokość (FT)</Label>
                <Input
                  id="altitude"
                  type="number"
                  value={cruiseAltitude}
                  onChange={(e) => setCruiseAltitude(e.target.value)}
                  placeholder="3000"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="speed">Prędkość (KT)</Label>
                <Input
                  id="speed"
                  type="number"
                  value={cruiseSpeed}
                  onChange={(e) => setCruiseSpeed(e.target.value)}
                  placeholder="110"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fuel">Zużycie (L/h)</Label>
                <Input
                  id="fuel"
                  type="number"
                  value={fuelConsumption}
                  onChange={(e) => setFuelConsumption(e.target.value)}
                  placeholder="28"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCalculate} className="flex-1">
                <Navigation className="mr-2 h-4 w-4" />
                Oblicz plan lotu
              </Button>
              <Button onClick={handleReset} variant="outline">
                Wyczyść
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Wyniki obliczeń
              </CardTitle>
              <CardDescription>
                Parametry nawigacyjne i paliwowe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Dystans
                  </div>
                  <div className="text-2xl font-bold">{result.distance} NM</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Czas lotu
                  </div>
                  <div className="text-2xl font-bold">{formatTime(result.estimatedTime)}</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Navigation className="h-4 w-4" />
                    Kurs prawdziwy
                  </div>
                  <div className="text-2xl font-bold">{result.trueCourse}°</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gauge className="h-4 w-4" />
                    Kurs magnetyczny
                  </div>
                  <div className="text-2xl font-bold">{result.magneticCourse}°</div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Fuel className="h-4 w-4" />
                    Paliwo na lot
                  </span>
                  <span className="font-semibold">{result.fuelRequired} L</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rezerwa (45 min)</span>
                  <span className="font-semibold">{result.fuelReserve} L</span>
                </div>

                <div className="flex items-center justify-between border-t pt-2">
                  <span className="font-semibold">Paliwo całkowite</span>
                  <span className="text-xl font-bold text-primary">{result.totalFuel} L</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Zalecane (z 10% marginesem)</span>
                  <span className="font-semibold">{Math.ceil(result.totalFuel * 1.1)} L</span>
                </div>
              </div>

              <Button onClick={generateICAOFlightPlan} className="w-full" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Kopiuj plan ICAO do schowka
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        {!result && (
          <Card>
            <CardHeader>
              <CardTitle>Informacje</CardTitle>
              <CardDescription>Jak korzystać z kalkulatora</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>1. Wybierz lotniska:</strong> Wybierz lotnisko startowe i docelowe z listy polskich lotnisk.
              </p>
              <p>
                <strong>2. Wprowadź parametry:</strong> Podaj typ statku powietrznego, wysokość przelotową, prędkość rzeczywistą (TAS) oraz zużycie paliwa.
              </p>
              <p>
                <strong>3. Oblicz:</strong> System obliczy dystans (metodą ortodromiczną), kurs prawdziwy i magnetyczny, czas lotu oraz wymagane paliwo.
              </p>
              <p>
                <strong>4. Eksport:</strong> Wygeneruj plan lotu w formacie ICAO i skopiuj do schowka.
              </p>
              <div className="border-t pt-3 mt-4">
                <p className="text-xs">
                  <strong>Uwaga:</strong> Obliczenia są uproszczone i służą celom edukacyjnym. Rzeczywisty plan lotu powinien uwzględniać dodatkowe czynniki: NOTAM, pogodę, przestrzeń powietrzną, itp.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FlightPlanning;
