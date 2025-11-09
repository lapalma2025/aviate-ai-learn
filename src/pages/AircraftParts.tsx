import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Plane, Gauge } from "lucide-react";

// External parts images
import fuselageImg from "@/assets/parts/fuselage.png";
import engineImg from "@/assets/parts/engine.png";
import propellerImg from "@/assets/parts/propeller.png";
import spinnerImg from "@/assets/parts/spinner.png";
import cowlingImg from "@/assets/parts/cowling.png";
import airIntakeImg from "@/assets/parts/air-intake.png";
import exhaustImg from "@/assets/parts/exhaust.png";
import oilCoolerImg from "@/assets/parts/oil-cooler.png";
import wingImg from "@/assets/parts/wing.png";
import aileronImg from "@/assets/parts/aileron.png";
import flapImg from "@/assets/parts/flap.png";
import wingStrutImg from "@/assets/parts/wing-strut.png";
import wingtipImg from "@/assets/parts/wingtip.png";
import navLightsImg from "@/assets/parts/nav-lights.png";
import strobeLightsImg from "@/assets/parts/strobe-lights.png";
import fuelCapImg from "@/assets/parts/fuel-cap.png";
import pitotTubeImg from "@/assets/parts/pitot-tube.png";
import staticPortImg from "@/assets/parts/static-port.png";
import verticalStabilizerImg from "@/assets/parts/vertical-stabilizer.png";
import rudderImg from "@/assets/parts/rudder.png";
import horizontalStabilizerImg from "@/assets/parts/horizontal-stabilizer.png";
import elevatorImg from "@/assets/parts/elevator.png";
import trimTabImg from "@/assets/parts/trim-tab.png";
import noseWheelImg from "@/assets/parts/nose-wheel.png";
import mainWheelsImg from "@/assets/parts/main-wheels.png";
import landingGearStrutImg from "@/assets/parts/landing-gear-strut.png";
import wheelFairingImg from "@/assets/parts/wheel-fairing.png";
import brakeSystemImg from "@/assets/parts/brake-system.png";
import windshieldImg from "@/assets/parts/windshield.png";
import doorImg from "@/assets/parts/door.png";
import stepHandleImg from "@/assets/parts/step-handle.png";
import antennaImg from "@/assets/parts/antenna.png";
import eltAntennaImg from "@/assets/parts/elt-antenna.png";
import staticWickImg from "@/assets/parts/static-wick.png";

// Internal parts images
import controlYokeImg from "@/assets/parts/control-yoke.png";
import rudderPedalsImg from "@/assets/parts/rudder-pedals.png";
import throttleImg from "@/assets/parts/throttle.png";
import mixtureControlImg from "@/assets/parts/mixture-control.png";
import carbHeatImg from "@/assets/parts/carb-heat.png";
import flapLeverImg from "@/assets/parts/flap-lever.png";
import trimWheelImg from "@/assets/parts/trim-wheel.png";
import parkingBrakeImg from "@/assets/parts/parking-brake.png";
import fuelSelectorImg from "@/assets/parts/fuel-selector.png";
import primerImg from "@/assets/parts/primer.png";
import airspeedIndicatorImg from "@/assets/parts/airspeed-indicator.png";
import attitudeIndicatorImg from "@/assets/parts/attitude-indicator.png";
import altimeterImg from "@/assets/parts/altimeter.png";
import turnCoordinatorImg from "@/assets/parts/turn-coordinator.png";
import headingIndicatorImg from "@/assets/parts/heading-indicator.png";
import verticalSpeedIndicatorImg from "@/assets/parts/vertical-speed-indicator.png";
import magneticCompassImg from "@/assets/parts/magnetic-compass.png";
import tachometerImg from "@/assets/parts/tachometer.png";
import oilPressureGaugeImg from "@/assets/parts/oil-pressure-gauge.png";
import oilTempGaugeImg from "@/assets/parts/oil-temp-gauge.png";
import fuelGaugesImg from "@/assets/parts/fuel-gauges.png";
import ammeterImg from "@/assets/parts/ammeter.png";
import voltmeterImg from "@/assets/parts/voltmeter.png";
import clockImg from "@/assets/parts/clock.png";
import batteryImg from "@/assets/parts/battery.png";
import alternatorImg from "@/assets/parts/alternator.png";
import circuitBreakersImg from "@/assets/parts/circuit-breakers.png";
import masterSwitchImg from "@/assets/parts/master-switch.png";
import avionicsMasterImg from "@/assets/parts/avionics-master.png";
import fuelTanksImg from "@/assets/parts/fuel-tanks.png";
import fuelLinesImg from "@/assets/parts/fuel-lines.png";
import fuelStrainerImg from "@/assets/parts/fuel-strainer.png";
import fuelPumpImg from "@/assets/parts/fuel-pump.png";
import fuelVentImg from "@/assets/parts/fuel-vent.png";
import lubricationSystemImg from "@/assets/parts/lubrication-system.png";
import coolingSystemImg from "@/assets/parts/cooling-system.png";
import magnetosImg from "@/assets/parts/magnetos.png";
import sparkPlugsImg from "@/assets/parts/spark-plugs.png";
import ignitionSwitchImg from "@/assets/parts/ignition-switch.png";
import seatbeltsImg from "@/assets/parts/seatbelts.png";
import fireExtinguisherImg from "@/assets/parts/fire-extinguisher.png";
import eltImg from "@/assets/parts/elt.png";

interface AircraftPart {
	id: number;
	name: string;
	nameEn: string;
	description: string;
	category: "external" | "internal";
	image?: string;
}

const aircraftParts: AircraftPart[] = [
	// CZĘŚCI ZEWNĘTRZNE
	{
		id: 1,
		name: "Kadłub",
		nameEn: "Fuselage",
		description:
			"Główny korpus samolotu, łączy wszystkie sekcje i mieści kabinę pilotów, pasażerów oraz bagaż. Zapewnia strukturę nośną dla wszystkich pozostałych elementów.",
		category: "external",
		image: fuselageImg,
	},
	{
		id: 2,
		name: "Silnik",
		nameEn: "Engine",
		description:
			"Silnik tłokowy (najczęściej Lycoming lub Continental w Cessnach), generuje moc do napędu śmigła i wytworzenia ciągu.",
		category: "external",
		image: engineImg,
	},
	{
		id: 3,
		name: "Śmigło",
		nameEn: "Propeller",
		description:
			"Przetwarza energię silnika w ciąg, działając jak obracające się skrzydło. Każda łopata ma profil aerodynamiczny, który podczas obrotu wytwarza siłę ciągu (thrust), popychając samolot do przodu. W Cessnach stosowane są śmigła o stałym skoku (fixed pitch), zapewniające kompromis między przyspieszeniem a prędkością przelotową.",
		category: "external",
		image: propellerImg,
	},
	{
		id: 4,
		name: "Kołpak śmigła",
		nameEn: "Spinner",
		description:
			"Aerodynamiczna osłona centralnej części śmigła, poprawia aerodynamikę i zmniejsza opór powietrza.",
		category: "external",
		image: spinnerImg,
	},
	{
		id: 5,
		name: "Osłona silnika",
		nameEn: "Cowling",
		description:
			"Chroni silnik i poprawia aerodynamikę. Kieruje przepływ powietrza chłodzącego wokół cylindrów, utrzymując właściwą temperaturę pracy i dostęp serwisowy do silnika.",
		category: "external",
		image: cowlingImg,
	},
	{
		id: 6,
		name: "Wlot powietrza",
		nameEn: "Air Intake",
		description:
			"Dostarcza powietrze do silnika, niezbędne do spalania mieszanki paliwowo-powietrznej. W niektórych samolotach posiada filtr i system podgrzewania powietrza (Carb Heat).",
		category: "external",
		image: airIntakeImg,
	},
	{
		id: 7,
		name: "Układ wylotowy",
		nameEn: "Exhaust",
		description:
			"Odprowadza spaliny z silnika, minimalizując hałas i zapewniając bezpieczeństwo.",
		category: "external",
		image: exhaustImg,
	},
	{
		id: 8,
		name: "Chłodnica oleju",
		nameEn: "Oil Cooler",
		description:
			"Odprowadza nadmiar ciepła z oleju silnikowego, utrzymując optymalną temperaturę układu smarowania i zapobiegając przegrzaniu silnika.",
		category: "external",
		image: oilCoolerImg,
	},
	{
		id: 9,
		name: "Skrzydło",
		nameEn: "Wing",
		description:
			"Główna powierzchnia nośna, generuje siłę potrzebną do lotu. Profil skrzydła powoduje różnicę ciśnień nad i pod skrzydłem.",
		category: "external",
		image: wingImg,
	},
	{
		id: 10,
		name: "Lotka",
		nameEn: "Aileron",
		description:
			"Kontroluje przechylenie samolotu (roll). Znajduje się na tylnej krawędzi skrzydła i porusza się przeciwnie na obu skrzydłach.",
		category: "external",
		image: aileronImg,
	},
	{
		id: 11,
		name: "Klapa",
		nameEn: "Flap",
		description:
			"Wysuwane powierzchnie na tylnej krawędzi skrzydła, które zwiększają siłę nośną i opór. Pozwalają startować i lądować przy mniejszych prędkościach.",
		category: "external",
		image: flapImg,
	},
	{
		id: 12,
		name: "Wspornik skrzydła",
		nameEn: "Wing Strut",
		description:
			"Wzmacnia strukturę skrzydła w samolotach z wysokim płatem (jak Cessna 172). Przenosi obciążenia ze skrzydła na kadłub.",
		category: "external",
		image: wingStrutImg,
	},
	{
		id: 13,
		name: "Końcówka skrzydła",
		nameEn: "Wingtip",
		description:
			"Zakończenie skrzydła, często wyposażone w lampy pozycyjne. Może mieć modyfikacje aerodynamiczne.",
		category: "external",
		image: wingtipImg,
	},
	{
		id: 14,
		name: "Światła pozycyjne",
		nameEn: "Navigation Lights",
		description:
			"Ułatwiają widoczność w nocy - zielone na prawym skrzydle, czerwone na lewym, białe z tyłu. Informują o orientacji samolotu.",
		category: "external",
		image: navLightsImg,
	},
	{
		id: 15,
		name: "Światła błyskowe",
		nameEn: "Strobe Lights",
		description:
			"Migające światła zwiększające widoczność samolotu dla innych statków powietrznych.",
		category: "external",
		image: strobeLightsImg,
	},
	{
		id: 16,
		name: "Wlew paliwa",
		nameEn: "Fuel Tank Cap",
		description:
			"Zamyka otwór zbiornika paliwa, umożliwia tankowanie i zapobiega przedostawaniu się zanieczyszczeń oraz parowaniu paliwa.",
		category: "external",
		image: fuelCapImg,
	},
	{
		id: 17,
		name: "Rurka Pitota",
		nameEn: "Pitot Tube",
		description:
			"Służy do pomiaru prędkości powietrza względem samolotu (airspeed). Rurka umieszczona jest w niezmąconym strumieniu powietrza, gdzie mierzy ciśnienie całkowite (dynamiczne + statyczne). W połączeniu z portem statycznym umożliwia wskaźnikowi prędkości (airspeed indicator) obliczenie prędkości lotu. Zablokowanie rurki (np. przez owady lub lód) powoduje błędne wskazania prędkościomierza.",
		category: "external",
		image: pitotTubeImg,
	},
	{
		id: 18,
		name: "Port statyczny",
		nameEn: "Static Port",
		description:
			"Mierzy ciśnienie statyczne (atmosferyczne) poza strumieniem powietrza. Dane z portu statycznego są używane przez wysokościomierz, wariometr i prędkościomierz do obliczania wysokości, prędkości i tempa wznoszenia/opadania. Zablokowanie portu prowadzi do błędnych odczytów tych przyrządów.",
		category: "external",
		image: staticPortImg,
	},
	{
		id: 19,
		name: "Statecznik pionowy",
		nameEn: "Vertical Stabilizer",
		description:
			"Pionowa powierzchnia usterzenia znajdująca się z tyłu kadłuba. Zapewnia stabilność kierunkową samolotu (yaw stability) i utrzymuje go w locie na wprost. Współpracuje ze sterem kierunku, przeciwdziałając niepożądanym odchyleniom od kursu.",
		category: "external",
		image: verticalStabilizerImg,
	},
	{
		id: 20,
		name: "Ster kierunku",
		nameEn: "Rudder",
		description:
			"Ruchoma powierzchnia umieszczona na tylnej krawędzi statecznika pionowego. Kontroluje obrót samolotu wokół osi pionowej (yaw) i umożliwia skręt w lewo lub w prawo. Sterowany pedałami w kabinie, służy do koordynowania zakrętów i kompensowania momentu obrotowego śmigła przy starcie.",
		category: "external",
		image: rudderImg,
	},
	{
		id: 21,
		name: "Statecznik poziomy",
		nameEn: "Horizontal Stabilizer",
		description:
			"Pozioma powierzchnia usterzenia znajdująca się na ogonie samolotu. Zapewnia stabilność w osi podłużnej (pitch stability), przeciwdziałając unoszeniu się lub opadaniu nosa samolotu. Współpracuje ze sterem wysokości, pomagając utrzymać równowagę aerodynamiczną podczas lotu.",
		category: "external",
		image: horizontalStabilizerImg,
	},
	{
		id: 22,
		name: "Ster wysokości",
		nameEn: "Elevator",
		description:
			"Ruchoma powierzchnia na tylnej krawędzi statecznika poziomego. Kontroluje pochylenie samolotu (pitch), umożliwiając wznoszenie lub opadanie poprzez zmianę siły nośnej usterzenia. Sterowany drążkiem lub wolantem – pociągnięcie go powoduje uniesienie nosa samolotu, a popchnięcie – jego opuszczenie.",
		category: "external",
		image: elevatorImg,
	},
	{
		id: 23,
		name: "Trymer",
		nameEn: "Trim Tab",
		description:
			"Mała ruchoma powierzchnia na tylnej krawędzi steru wysokości. Umożliwia zbalansowanie samolotu w locie, zmniejszając siłę potrzebną do utrzymania drążka w określonej pozycji. Nie służy do sterowania samolotem, lecz do odciążenia pilota i utrzymania stabilnego pochylenia bez ciągłego nacisku na wolant.",
		category: "external",
		image: trimTabImg,
	},
	{
		id: 24,
		name: "Przednie koło",
		nameEn: "Nose Wheel",
		description:
			"Przednie koło podwozia, połączone z pedałami steru kierunku. Umożliwia skręcanie samolotu podczas kołowania i stabilizuje pozycję na ziemi.",
		category: "external",
		image: noseWheelImg,
	},
	{
		id: 25,
		name: "Koła główne",
		nameEn: "Main Wheels",
		description:
			"Podpierają samolot przy lądowaniu i przyjmują większość ciężaru podczas operacji naziemnych.",
		category: "external",
		image: mainWheelsImg,
	},
	{
		id: 26,
		name: "Amortyzator podwozia",
		nameEn: "Landing Gear Strut",
		description:
			"Tłumi uderzenia przy lądowaniu i zapewnia płynne toczenie po nawierzchni. W większości Cessen wykorzystuje amortyzator olejowo-powietrzny typu oleo.",
		category: "external",
		image: landingGearStrutImg,
	},
	{
		id: 27,
		name: "Osłona kół",
		nameEn: "Wheel Fairing",
		description:
			"Lekka, aerodynamiczna osłona kół głównych podwozia. Zmniejsza opór powietrza i poprawia osiągi samolotu, choć nie jest stosowana w wersjach szkoleniowych.",
		category: "external",
		image: wheelFairingImg,
	},
	{
		id: 28,
		name: "Układ hamulcowy",
		nameEn: "Brake System",
		description:
			"Zazwyczaj hydrauliczny układ hamulców na kołach głównych, kontrolowany przez pedały.",
		category: "external",
		image: brakeSystemImg,
	},
	{
		id: 29,
		name: "Przednia szyba",
		nameEn: "Windshield",
		description:
			"Chroni pilotów przed wiatrem, wykonana z wytrzymałego, przezroczystego materiału odpornego na wysokie prędkości.",
		category: "external",
		image: windshieldImg,
	},
	{
		id: 30,
		name: "Drzwi",
		nameEn: "Door",
		description: "Wejście do kabiny, zazwyczaj po obu stronach kadłuba.",
		category: "external",
		image: doorImg,
	},
	{
		id: 31,
		name: "Stopień i uchwyt",
		nameEn: "Step & Handle",
		description: "Ułatwiają wejście do kabiny samolotu.",
		category: "external",
		image: stepHandleImg,
	},
	{
		id: 32,
		name: "Antena",
		nameEn: "Antenna",
		description:
			"Anteny radiowe i GPS umożliwiają komunikację z kontrolą ruchu oraz nawigację.",
		category: "external",
		image: antennaImg,
	},
	{
		id: 33,
		name: "Antena ELT",
		nameEn: "ELT Antenna",
		description:
			"Antena lokalizatora awaryjnego, automatycznie wysyła sygnał ratunkowy po wypadku.",
		category: "external",
		image: eltAntennaImg,
	},
	{
		id: 34,
		name: "Odgromnik",
		nameEn: "Static Wick",
		description:
			"Odprowadza ładunki elektrostatyczne z końcówek skrzydeł i usterzenia.",
		category: "external",
		image: staticWickImg,
	},

	// CZĘŚCI WEWNĘTRZNE
	{
		id: 35,
		name: "Drążek sterowy",
		nameEn: "Control Yoke",
		description:
			"Główny element sterowania samolotem - ruch do przodu/tyłu kontroluje pitch (wznoszenie/opadanie), obrót kontroluje roll (przechylenie).",
		category: "internal",
		image: controlYokeImg,
	},
	{
		id: 36,
		name: "Pedały steru kierunku",
		nameEn: "Rudder Pedals",
		description:
			"Kontrolują ster kierunku (yaw) oraz hamulce kół głównych podczas kołowania.",
		category: "internal",
		image: rudderPedalsImg,
	},
	{
		id: 37,
		name: "Manetka przepustnicy",
		nameEn: "Throttle",
		description:
			"Reguluje moc silnika poprzez kontrolę ilości paliwa i powietrza dostarczanych do cylindrów.",
		category: "internal",
		image: throttleImg,
	},
	{
		id: 38,
		name: "Kontrola mieszanki",
		nameEn: "Mixture Control",
		description:
			"Reguluje stosunek paliwa do powietrza, wymaga dostosowania na różnych wysokościach.",
		category: "internal",
		image: mixtureControlImg,
	},
	{
		id: 39,
		name: "Podgrzewanie gaźnika",
		nameEn: "Carburetor Heat",
		description:
			"Doprowadza ciepłe powietrze do gaźnika, zapobiega oblodzeniu w wilgotnych warunkach.",
		category: "internal",
		image: carbHeatImg,
	},
	{
		id: 40,
		name: "Dźwignia klap",
		nameEn: "Flap Lever",
		description:
			"Kontroluje wysunięcie klap zwiększających siłę nośną przy starcie i lądowaniu.",
		category: "internal",
		image: flapLeverImg,
	},
	{
		id: 41,
		name: "Pokrętło trymera",
		nameEn: "Trim Wheel",
		description:
			"Dostosowuje trymer steru wysokości, redukując potrzebę ciągłego nacisku na drążek.",
		category: "internal",
		image: trimWheelImg,
	},
	{
		id: 42,
		name: "Hamulec postojowy",
		nameEn: "Parking Brake",
		description: "Blokuje koła podczas postoju samolotu na ziemi.",
		category: "internal",
		image: parkingBrakeImg,
	},
	{
		id: 43,
		name: "Wybór zbiornika paliwa",
		nameEn: "Fuel Selector",
		description:
			"Wybiera źródło paliwa: lewy zbiornik (LEFT), prawy (RIGHT) lub oba (BOTH).",
		category: "internal",
		image: fuelSelectorImg,
	},
	{
		id: 44,
		name: "Pompka rozruchowa",
		nameEn: "Primer",
		description:
			"Ręczna pompka wtryskująca paliwo bezpośrednio do cylindrów przed uruchomieniem silnika.",
		category: "internal",
		image: primerImg,
	},
	{
		id: 45,
		name: "Prędkościomierz",
		nameEn: "Airspeed Indicator",
		description:
			"Pokazuje prędkość samolotu względem powietrza na podstawie różnicy między ciśnieniem Pitota a ciśnieniem statycznym. Wskazuje prędkość w węzłach (kt) i posiada kolorowe łuki określające zakresy bezpiecznych prędkości.",
		category: "internal",
		image: airspeedIndicatorImg,
	},
	{
		id: 46,
		name: "Sztuczny horyzont",
		nameEn: "Attitude Indicator",
		description:
			"Pokazuje położenie samolotu względem rzeczywistego horyzontu – kąt pochylenia (pitch) oraz przechylenia (bank). Działa na zasadzie żyroskopu i umożliwia orientację przestrzenną w warunkach ograniczonej widoczności (IMC). Może wykazywać niewielkie błędy przy długotrwałych zakrętach lub przyspieszeniach.",
		category: "internal",
		image: attitudeIndicatorImg,
	},
	{
		id: 47,
		name: "Wysokościomierz",
		nameEn: "Altimeter",
		description:
			"Mierzy wysokość nad poziomem morza na podstawie ciśnienia statycznego. Wymaga ustawienia ciśnienia odniesienia (QNH) dla prawidłowych wskazań.",
		category: "internal",
		image: altimeterImg,
	},
	{
		id: 48,
		name: "Koordynator skrętu",
		nameEn: "Turn Coordinator",
		description:
			"Pokazuje tempo skrętu oraz informuje, czy skręt jest koordynowany (bez poślizgu). Pomaga utrzymać prawidłową równowagę między użyciem lotek i steru kierunku.",
		category: "internal",
		image: turnCoordinatorImg,
	},
	{
		id: 49,
		name: "Wskaźnik kierunku",
		nameEn: "Heading Indicator",
		description:
			"Żyroskopowy wskaźnik kursu, dokładniejszy niż kompas magnetyczny podczas manewrów. Wymaga okresowego ustawiania względem kompasu, ponieważ z czasem dryfuje.",
		category: "internal",
		image: headingIndicatorImg,
	},
	{
		id: 50,
		name: "Wariometr",
		nameEn: "Vertical Speed Indicator",
		description:
			"Pokazuje tempo wznoszenia lub opadania w stopach na minutę. Działa na zasadzie różnicy ciśnienia statycznego w czasie, co powoduje niewielkie opóźnienie wskazań.",
		category: "internal",
		image: verticalSpeedIndicatorImg,
	},
	{
		id: 51,
		name: "Kompas magnetyczny",
		nameEn: "Magnetic Compass",
		description:
			"Podstawowy przyrząd nawigacyjny wskazujący kierunek względem północy magnetycznej. Działa niezależnie od zasilania elektrycznego, wykorzystując pole magnetyczne Ziemi. Podczas przyspieszania, zwalniania i zakrętów wykazuje błędy odczytu (dewiacje i błędy przyspieszeń), dlatego należy regularnie porównywać go z żyroskopowym wskaźnikiem kierunku.",
		category: "internal",
		image: magneticCompassImg,
	},
	{
		id: 52,
		name: "Obrotomierz",
		nameEn: "Tachometer",
		description:
			"Pokazuje prędkość obrotową wału korbowego silnika w obrotach na minutę (RPM). Służy do kontroli mocy podczas startu, wznoszenia i przelotu. Wskaźnik ten rejestruje również czas pracy silnika (tach time), używany do planowania przeglądów technicznych.",
		category: "internal",
		image: tachometerImg,
	},
	{
		id: 53,
		name: "Wskaźnik ciśnienia oleju",
		nameEn: "Oil Pressure Gauge",
		description:
			"Pokazuje ciśnienie oleju w układzie smarowania silnika. Wartości powinny mieścić się w zielonym zakresie po kilku sekundach od uruchomienia silnika. Zbyt niskie ciśnienie może oznaczać wyciek, niedobór oleju lub awarię pompy, a zbyt wysokie — zatkanie przewodów lub problem z zaworem regulacyjnym.",
		category: "internal",
		image: oilPressureGaugeImg,
	},
	{
		id: 54,
		name: "Wskaźnik temperatury oleju",
		nameEn: "Oil Temperature Gauge",
		description:
			"Pokazuje temperaturę oleju silnikowego, co pozwala ocenić stan pracy silnika. Zbyt niska temperatura oznacza, że silnik jest jeszcze zimny i nie powinien pracować z pełną mocą. Zbyt wysoka może świadczyć o przegrzewaniu lub problemach z układem chłodzenia lub smarowania.",
		category: "internal",
		image: oilTempGaugeImg,
	},
	{
		id: 55,
		name: "Wskaźniki poziomu paliwa",
		nameEn: "Fuel Quantity Gauges",
		description:
			"Pokazują przybliżoną ilość paliwa w każdym zbiorniku. Działają elektrycznie i mogą być niedokładne, dlatego ilość paliwa należy zawsze potwierdzić wizualnie przed lotem, otwierając wlewy paliwa i sprawdzając poziom ręcznie.",
		category: "internal",
		image: fuelGaugesImg,
	},
	{
		id: 56,
		name: "Amperomierz",
		nameEn: "Ammeter",
		description:
			"Pokazuje natężenie prądu w układzie elektrycznym. Wskazanie dodatnie oznacza ładowanie akumulatora przez alternator, ujemne – pobór prądu z akumulatora.",
		category: "internal",
		image: ammeterImg,
	},
	{
		id: 57,
		name: "Woltomierz",
		nameEn: "Voltmeter",
		description: "Mierzy napięcie w układzie elektrycznym samolotu.",
		category: "internal",
		image: voltmeterImg,
	},
	{
		id: 58,
		name: "Zegar",
		nameEn: "Clock",
		description: "Standardowy przyrząd do pomiaru czasu lotu i nawigacji.",
		category: "internal",
		image: clockImg,
	},
	{
		id: 59,
		name: "Akumulator",
		nameEn: "Battery",
		description:
			"Magazynuje energię elektryczną do uruchomienia silnika i zasilania systemów przy wyłączonym silniku.",
		category: "internal",
		image: batteryImg,
	},
	{
		id: 60,
		name: "Prądnica",
		nameEn: "Alternator",
		description:
			"Generuje prąd elektryczny podczas pracy silnika, ładuje akumulator i zasila systemy.",
		category: "internal",
		image: alternatorImg,
	},
	{
		id: 61,
		name: "Bezpieczniki",
		nameEn: "Circuit Breakers",
		description: "Chronią układy elektryczne przed przeciążeniem i zwarciem.",
		category: "internal",
		image: circuitBreakersImg,
	},
	{
		id: 62,
		name: "Wyłącznik główny",
		nameEn: "Master Switch",
		description: "Główny wyłącznik zasilania elektrycznego samolotu.",
		category: "internal",
		image: masterSwitchImg,
	},
	{
		id: 63,
		name: "Zasilanie awioniki",
		nameEn: "Avionics Master",
		description: "Oddzielny wyłącznik dla systemów radiowych i nawigacyjnych.",
		category: "internal",
		image: avionicsMasterImg,
	},
	{
		id: 64,
		name: "Zbiorniki paliwa",
		nameEn: "Fuel Tanks",
		description:
			"Zazwyczaj umieszczone w skrzydłach, przechowują paliwo lotnicze (Avgas 100LL).",
		category: "internal",
		image: fuelTanksImg,
	},
	{
		id: 65,
		name: "Przewody paliwowe",
		nameEn: "Fuel Lines",
		description: "Transportują paliwo ze zbiorników do silnika.",
		category: "internal",
		image: fuelLinesImg,
	},
	{
		id: 66,
		name: "Filtr paliwa",
		nameEn: "Fuel Strainer",
		description:
			"Oddziela wodę i zanieczyszczenia z paliwa przed dostarczeniem do silnika.",
		category: "internal",
		image: fuelStrainerImg,
	},
	{
		id: 67,
		name: "Pompa paliwa",
		nameEn: "Fuel Pump",
		description:
			"Elektryczna pompa zapasowa wspomaga mechaniczną pompę silnika.",
		category: "internal",
		image: fuelPumpImg,
	},
	{
		id: 68,
		name: "Odpowietrzenie zbiornika",
		nameEn: "Fuel Vent",
		description:
			"Wyrównuje ciśnienie w zbiorniku paliwa podczas zużycia paliwa.",
		category: "internal",
		image: fuelVentImg,
	},
	{
		id: 69,
		name: "Układ smarowania",
		nameEn: "Lubrication System",
		description:
			"Pompa oleju, filtr, zbiornik i chłodnica zapewniają ciągłe smarowanie części ruchomych silnika.",
		category: "internal",
		image: lubricationSystemImg,
	},
	{
		id: 70,
		name: "Układ chłodzenia",
		nameEn: "Cooling System",
		description:
			"W samolotach tłokowych chłodzonych powietrzem (jak Cessna 172) powietrze przepływa wokół cylindrów dzięki kanałom w osłonie silnika. Utrzymuje właściwą temperaturę pracy silnika.",
		category: "internal",
		image: coolingSystemImg,
	},
	{
		id: 71,
		name: "Magnetos",
		nameEn: "Magnetos",
		description:
			"Dwa niezależne generatory iskry napędzane mechanicznie przez silnik. Zasilają świece zapłonowe bez potrzeby prądu z akumulatora, zapewniając redundancję bezpieczeństwa.",
		category: "internal",
		image: magnetosImg,
	},
	{
		id: 72,
		name: "Świece zapłonowe",
		nameEn: "Spark Plugs",
		description: "Zapalają mieszankę paliwowo-powietrzną w cylindrach silnika.",
		category: "internal",
		image: sparkPlugsImg,
	},
	{
		id: 73,
		name: "Stacyjka",
		nameEn: "Ignition Switch",
		description:
			"Pozycje: OFF (wyłączone), L (lewy magnetos), R (prawy magnetos), BOTH (oba), START (rozruch).",
		category: "internal",
		image: ignitionSwitchImg,
	},
	{
		id: 74,
		name: "Pasy bezpieczeństwa",
		nameEn: "Seatbelts",
		description:
			"Zapewniają ochronę pilotom i pasażerom podczas startu, lądowania i turbulencji. W Cessnach są to czteropunktowe pasy biodrowo-ramienne, które należy zawsze zapiąć przed uruchomieniem silnika.",
		category: "internal",
		image: seatbeltsImg,
	},
	{
		id: 75,
		name: "Gaśnica",
		nameEn: "Fire Extinguisher",
		description:
			"Przenośna gaśnica umieszczona w kabinie, przeznaczona do gaszenia pożarów instalacji elektrycznej lub tapicerki. Powinna być łatwo dostępna dla pilota i regularnie kontrolowana pod względem daty ważności i ciśnienia.",
		category: "internal",
		image: fireExtinguisherImg,
	},
	{
		id: 76,
		name: "Lokalizator awaryjny",
		nameEn: "ELT",
		description:
			"Nadajnik awaryjny (Emergency Locator Transmitter) aktywowany automatycznie po silnym uderzeniu. Wysyła sygnał ratunkowy na częstotliwości 406 MHz, umożliwiając lokalizację samolotu.",
		category: "internal",
		image: eltImg,
	},
];

export default function AircraftParts() {
	const [selectedPart, setSelectedPart] = useState<AircraftPart | null>(null);
	const [hoveredPart, setHoveredPart] = useState<number | null>(null);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [viewMode, setViewMode] = useState<"external" | "cockpit">("external");

	const modelUrls = {
		external:
			"https://sketchfab.com/models/3bad38124b784eafa9f16740fbb9f23e/embed?autospin=0.2&autostart=1&ui_theme=dark",
		cockpit:
			"https://sketchfab.com/models/8abac371880c47869ee4063a3c33707b/embed?autospin=0.2&autostart=1&ui_theme=dark",
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">
						Budowa samolotu - Cessna 172
					</CardTitle>
					<p className="text-muted-foreground">
						Obróć model 3D lub wybierz część z listy, aby poznać jej funkcję
					</p>
				</CardHeader>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card className="lg:col-span-2">
					<CardContent className="p-6">
						<div className="relative">
							<div className="absolute top-2 left-2 z-10 flex gap-2">
								<Button
									variant={viewMode === "external" ? "default" : "outline"}
									size="sm"
									onClick={() => setViewMode("external")}
									className="backdrop-blur-sm"
								>
									<Plane className="h-4 w-4 mr-2" />
									Zewnętrzny
								</Button>
								<Button
									variant={viewMode === "cockpit" ? "default" : "outline"}
									size="sm"
									onClick={() => setViewMode("cockpit")}
									className="backdrop-blur-sm"
								>
									<Gauge className="h-4 w-4 mr-2" />
									Kokpit
								</Button>
							</div>
							<button
								onClick={() => setIsFullscreen(!isFullscreen)}
								className="absolute top-2 right-2 z-10 p-2 bg-background/80 hover:bg-background rounded-lg backdrop-blur-sm transition-colors"
							>
								<Maximize2 className="h-4 w-4" />
							</button>
							<div
								className={`rounded-lg overflow-hidden border border-border shadow-lg ${
									isFullscreen ? "fixed inset-4 z-50" : "aspect-video"
								}`}
							>
								<iframe
									key={viewMode}
									src={modelUrls[viewMode]}
									className="w-full h-full"
									allow="autoplay; fullscreen; xr-spatial-tracking"
									allowFullScreen
								/>
							</div>
							{isFullscreen && (
								<button
									onClick={() => setIsFullscreen(false)}
									className="fixed top-6 right-6 z-50 p-3 bg-background hover:bg-accent rounded-lg shadow-lg transition-colors"
								>
									<X className="h-5 w-5" />
								</button>
							)}
							<p className="text-xs text-muted-foreground mt-2 text-center">
								Użyj myszki aby obracać • Scroll aby przybliżać • Prawy przycisk
								aby przesuwać
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							Szczegóły części
							{selectedPart && (
								<button
									onClick={() => setSelectedPart(null)}
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									<X className="h-5 w-5" />
								</button>
							)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{selectedPart ? (
							<div className="space-y-4 animate-fade-in">
								<div>
									<h3 className="text-xl font-bold text-primary">
										{selectedPart.name}
									</h3>
									<p className="text-sm text-muted-foreground">
										{selectedPart.nameEn}
									</p>
								</div>
								<div className="p-4 bg-primary/5 rounded-lg border border-primary/20 overflow-hidden">
									<p className="text-sm leading-relaxed break-words overflow-wrap-anywhere whitespace-normal w-full">
										{selectedPart.description}
									</p>
								</div>
							</div>
						) : (
							<div className="text-center py-12 text-muted-foreground">
								<p>Kliknij na część samolotu,</p>
								<p>aby zobaczyć szczegółowy opis</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>🛩️ I. Części Zewnętrzne Samolotu</CardTitle>
					<p className="text-sm text-muted-foreground">
						External Aircraft Parts
					</p>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[400px] pr-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{aircraftParts
								.filter((p) => p.category === "external")
								.map((part) => (
									<button
										key={part.id}
										onClick={() => setSelectedPart(part)}
										className={`p-3 rounded-lg border text-left transition-all hover:shadow-md ${
											selectedPart?.id === part.id
												? "bg-primary/10 border-primary shadow-sm"
												: "bg-card border-border hover:bg-accent"
										}`}
									>
										<p className="font-semibold text-sm">{part.name}</p>
										<p className="text-xs text-muted-foreground">
											{part.nameEn}
										</p>
									</button>
								))}
						</div>
					</ScrollArea>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>⚙️ II. Części Wewnętrzne Samolotu</CardTitle>
					<p className="text-sm text-muted-foreground">Internal Components</p>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[400px] pr-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{aircraftParts
								.filter((p) => p.category === "internal")
								.map((part) => (
									<button
										key={part.id}
										onClick={() => setSelectedPart(part)}
										className={`p-3 rounded-lg border text-left transition-all hover:shadow-md ${
											selectedPart?.id === part.id
												? "bg-primary/10 border-primary shadow-sm"
												: "bg-card border-border hover:bg-accent"
										}`}
									>
										<p className="font-semibold text-sm">{part.name}</p>
										<p className="text-xs text-muted-foreground">
											{part.nameEn}
										</p>
									</button>
								))}
						</div>
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	);
}
