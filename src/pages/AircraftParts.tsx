import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Maximize2 } from "lucide-react";
import fuselageImg from "@/assets/parts/fuselage.png";
import propellerImg from "@/assets/parts/propeller.png";
import wingImg from "@/assets/parts/wing.png";
import engineImg from "@/assets/parts/engine.png";

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
    description: "Główny korpus samolotu, łączy wszystkie sekcje i mieści kabinę pilotów, pasażerów oraz bagaż. Zapewnia strukturę nośną dla wszystkich pozostałych elementów.",
    category: "external",
    image: fuselageImg,
  },
  {
    id: 2,
    name: "Silnik",
    nameEn: "Engine",
    description: "Silnik tłokowy (najczęściej Lycoming lub Continental w Cessnach), generuje moc do napędu śmigła i wytworzenia ciągu.",
    category: "external",
    image: engineImg,
  },
  {
    id: 3,
    name: "Śmigło",
    nameEn: "Propeller",
    description: "Przetwarza energię silnika w ciąg, zasysając powietrze i pchając samolot do przodu. Przekształca moc obrotową w siłę pociągową.",
    category: "external",
    image: propellerImg,
  },
  {
    id: 4,
    name: "Kołpak śmigła",
    nameEn: "Spinner",
    description: "Aerodynamiczna osłona centralnej części śmigła, poprawia aerodynamikę i zmniejsza opór powietrza.",
    category: "external",
  },
  {
    id: 5,
    name: "Osłona silnika",
    nameEn: "Cowling",
    description: "Kieruje przepływ powietrza chłodzącego i chroni silnik, zapewniając odpowiednią temperaturę pracy podczas lotu.",
    category: "external",
  },
  {
    id: 6,
    name: "Wlot powietrza",
    nameEn: "Air Intake",
    description: "Dostarcza powietrze do silnika, niezbędne do procesu spalania paliwa.",
    category: "external",
  },
  {
    id: 7,
    name: "Układ wylotowy",
    nameEn: "Exhaust",
    description: "Odprowadza spaliny z silnika, minimalizując hałas i zapewniając bezpieczeństwo.",
    category: "external",
  },
  {
    id: 8,
    name: "Chłodnica oleju",
    nameEn: "Oil Cooler",
    description: "Obniża temperaturę oleju silnikowego, zapobiegając przegrzaniu układu smarowania.",
    category: "external",
  },
  {
    id: 9,
    name: "Skrzydło",
    nameEn: "Wing",
    description: "Główna powierzchnia nośna, generuje siłę potrzebną do lotu. Profil skrzydła powoduje różnicę ciśnień nad i pod skrzydłem.",
    category: "external",
    image: wingImg,
  },
  {
    id: 10,
    name: "Lotka",
    nameEn: "Aileron",
    description: "Kontroluje przechylenie samolotu (roll). Znajduje się na tylnej krawędzi skrzydła i porusza się przeciwnie na obu skrzydłach.",
    category: "external",
  },
  {
    id: 11,
    name: "Klapa",
    nameEn: "Flap",
    description: "Zwiększa siłę nośną przy starcie i lądowaniu. Wysuwana z tylnej krawędzi skrzydła, zwiększa krzywiznę profilu.",
    category: "external",
  },
  {
    id: 12,
    name: "Wspornik skrzydła",
    nameEn: "Wing Strut",
    description: "Wzmacnia strukturę skrzydła w samolotach z wysokim płatem (jak Cessna 172). Przenosi obciążenia ze skrzydła na kadłub.",
    category: "external",
  },
  {
    id: 13,
    name: "Końcówka skrzydła",
    nameEn: "Wingtip",
    description: "Zakończenie skrzydła, często wyposażone w lampy pozycyjne. Może mieć modyfikacje aerodynamiczne.",
    category: "external",
  },
  {
    id: 14,
    name: "Światła pozycyjne",
    nameEn: "Navigation Lights",
    description: "Ułatwiają widoczność w nocy - zielone na prawym skrzydle, czerwone na lewym, białe z tyłu. Informują o orientacji samolotu.",
    category: "external",
  },
  {
    id: 15,
    name: "Światła błyskowe",
    nameEn: "Strobe Lights",
    description: "Migające światła zwiększające widoczność samolotu dla innych statków powietrznych.",
    category: "external",
  },
  {
    id: 16,
    name: "Wlew paliwa",
    nameEn: "Fuel Tank Cap",
    description: "Punkt tankowania paliwa, zazwyczaj umieszczony na górnej powierzchni skrzydła.",
    category: "external",
  },
  {
    id: 17,
    name: "Rurka Pitota",
    nameEn: "Pitot Tube",
    description: "Mierzy prędkość powietrza, umieszczona w niezmąconym strumieniu. Dostarcza dane do wskaźnika prędkości.",
    category: "external",
  },
  {
    id: 18,
    name: "Port statyczny",
    nameEn: "Static Port",
    description: "Mierzy ciśnienie atmosferyczne, dostarcza danych dla wysokościomierza, wariometru i prędkościomierza.",
    category: "external",
  },
  {
    id: 19,
    name: "Statecznik pionowy",
    nameEn: "Vertical Stabilizer",
    description: "Stabilizuje samolot kierunkowo, zapobiega niepożądanym odchyleniom od kursu podczas lotu.",
    category: "external",
  },
  {
    id: 20,
    name: "Ster kierunku",
    nameEn: "Rudder",
    description: "Kontroluje skręt w lewo/prawo (yaw). Znajduje się na tylnej krawędzi statecznika pionowego.",
    category: "external",
  },
  {
    id: 21,
    name: "Statecznik poziomy",
    nameEn: "Horizontal Stabilizer",
    description: "Stabilizuje samolot w osi podłużnej, zapobiega niekontrolowanym ruchom góra-dół podczas lotu.",
    category: "external",
  },
  {
    id: 22,
    name: "Ster wysokości",
    nameEn: "Elevator",
    description: "Kontroluje wznoszenie i opadanie (pitch). Znajduje się na tylnej krawędzi statecznika poziomego.",
    category: "external",
  },
  {
    id: 23,
    name: "Trymer",
    nameEn: "Trim Tab",
    description: "Zmniejsza siłę potrzebną na sterze, pozwala na zbalansowanie samolotu w locie bez ciągłego nacisku na drążek.",
    category: "external",
  },
  {
    id: 24,
    name: "Przednie koło",
    nameEn: "Nose Wheel",
    description: "Główne koło sterujące na ziemi, umożliwia skręcanie podczas kołowania. Połączone z pedalami steru kierunku.",
    category: "external",
  },
  {
    id: 25,
    name: "Koła główne",
    nameEn: "Main Wheels",
    description: "Podpierają samolot przy lądowaniu i przyjmują większość ciężaru podczas operacji naziemnych.",
    category: "external",
  },
  {
    id: 26,
    name: "Amortyzator podwozia",
    nameEn: "Landing Gear Strut",
    description: "Absorbuje uderzenia podczas lądowania, zapewnia płynne kołowanie po nierównej powierzchni.",
    category: "external",
  },
  {
    id: 27,
    name: "Osłona kół",
    nameEn: "Wheel Fairing",
    description: "Aerodynamiczna osłona podwozia (opcjonalna), zmniejsza opór powietrza.",
    category: "external",
  },
  {
    id: 28,
    name: "Układ hamulcowy",
    nameEn: "Brake System",
    description: "Zazwyczaj hydrauliczny układ hamulców na kołach głównych, kontrolowany przez pedały.",
    category: "external",
  },
  {
    id: 29,
    name: "Przednia szyba",
    nameEn: "Windshield",
    description: "Chroni pilotów przed wiatrem, wykonana z wytrzymałego, przezroczystego materiału odpornego na wysokie prędkości.",
    category: "external",
  },
  {
    id: 30,
    name: "Drzwi",
    nameEn: "Door",
    description: "Wejście do kabiny, zazwyczaj po obu stronach kadłuba.",
    category: "external",
  },
  {
    id: 31,
    name: "Stopień i uchwyt",
    nameEn: "Step & Handle",
    description: "Ułatwiają wejście do kabiny samolotu.",
    category: "external",
  },
  {
    id: 32,
    name: "Antena",
    nameEn: "Antenna",
    description: "Anteny radiowe i GPS umożliwiają komunikację z kontrolą ruchu oraz nawigację.",
    category: "external",
  },
  {
    id: 33,
    name: "Antena ELT",
    nameEn: "ELT Antenna",
    description: "Antena lokalizatora awaryjnego, automatycznie wysyła sygnał ratunkowy po wypadku.",
    category: "external",
  },
  {
    id: 34,
    name: "Odgromnik",
    nameEn: "Static Wick",
    description: "Odprowadza ładunki elektrostatyczne z końcówek skrzydeł i usterzenia.",
    category: "external",
  },
  
  // CZĘŚCI WEWNĘTRZNE
  {
    id: 35,
    name: "Drążek sterowy",
    nameEn: "Control Yoke",
    description: "Główny element sterowania samolotem - ruch do przodu/tyłu kontroluje pitch (wznoszenie/opadanie), obrót kontroluje roll (przechylenie).",
    category: "internal",
  },
  {
    id: 36,
    name: "Pedały steru kierunku",
    nameEn: "Rudder Pedals",
    description: "Kontrolują ster kierunku (yaw) oraz hamulce kół głównych podczas kołowania.",
    category: "internal",
  },
  {
    id: 37,
    name: "Manetka przepustnicy",
    nameEn: "Throttle",
    description: "Reguluje moc silnika poprzez kontrolę ilości paliwa i powietrza dostarczanych do cylindrów.",
    category: "internal",
  },
  {
    id: 38,
    name: "Kontrola mieszanki",
    nameEn: "Mixture Control",
    description: "Reguluje stosunek paliwa do powietrza, wymaga dostosowania na różnych wysokościach.",
    category: "internal",
  },
  {
    id: 39,
    name: "Podgrzewanie gaźnika",
    nameEn: "Carburetor Heat",
    description: "Doprowadza ciepłe powietrze do gaźnika, zapobiega oblodzeniu w wilgotnych warunkach.",
    category: "internal",
  },
  {
    id: 40,
    name: "Dźwignia klap",
    nameEn: "Flap Lever",
    description: "Kontroluje wysunięcie klap zwiększających siłę nośną przy starcie i lądowaniu.",
    category: "internal",
  },
  {
    id: 41,
    name: "Pokrętło trymera",
    nameEn: "Trim Wheel",
    description: "Dostosowuje trymer steru wysokości, redukując potrzebę ciągłego nacisku na drążek.",
    category: "internal",
  },
  {
    id: 42,
    name: "Hamulec postojowy",
    nameEn: "Parking Brake",
    description: "Blokuje koła podczas postoju samolotu na ziemi.",
    category: "internal",
  },
  {
    id: 43,
    name: "Wybór zbiornika paliwa",
    nameEn: "Fuel Selector",
    description: "Wybiera źródło paliwa: lewy zbiornik (LEFT), prawy (RIGHT) lub oba (BOTH).",
    category: "internal",
  },
  {
    id: 44,
    name: "Pompka rozruchowa",
    nameEn: "Primer",
    description: "Ręczna pompka wtryskująca paliwo bezpośrednio do cylindrów przed uruchomieniem silnika.",
    category: "internal",
  },
  {
    id: 45,
    name: "Prędkościomierz",
    nameEn: "Airspeed Indicator",
    description: "Pokazuje prędkość samolotu względem otaczającego powietrza w węzłach lub mph.",
    category: "internal",
  },
  {
    id: 46,
    name: "Sztuczny horyzont",
    nameEn: "Attitude Indicator",
    description: "Wyświetla położenie samolotu względem horyzontu - kluczowy przyrząd w locie w chmurach.",
    category: "internal",
  },
  {
    id: 47,
    name: "Wysokościomierz",
    nameEn: "Altimeter",
    description: "Mierzy wysokość samolotu nad poziomem morza na podstawie ciśnienia atmosferycznego.",
    category: "internal",
  },
  {
    id: 48,
    name: "Koordynator skrętu",
    nameEn: "Turn Coordinator",
    description: "Pokazuje tempo skrętu i koordynację (czy skręt jest prawidłowo wykonany bez poślizgu).",
    category: "internal",
  },
  {
    id: 49,
    name: "Wskaźnik kierunku",
    nameEn: "Heading Indicator",
    description: "Żyroskopowy wskaźnik kursu, dokładniejszy niż kompas magnetyczny podczas manewrów.",
    category: "internal",
  },
  {
    id: 50,
    name: "Wariometr",
    nameEn: "Vertical Speed Indicator",
    description: "Pokazuje prędkość wznoszenia lub opadania samolotu w stopach na minutę.",
    category: "internal",
  },
  {
    id: 51,
    name: "Kompas magnetyczny",
    nameEn: "Magnetic Compass",
    description: "Podstawowy instrument nawigacyjny wskazujący kierunek magnetyczny północy.",
    category: "internal",
  },
  {
    id: 52,
    name: "Obrotomierz",
    nameEn: "Tachometer",
    description: "Pokazuje obroty silnika w RPM (obrotach na minutę).",
    category: "internal",
  },
  {
    id: 53,
    name: "Wskaźnik ciśnienia oleju",
    nameEn: "Oil Pressure Gauge",
    description: "Monitoruje ciśnienie oleju w układzie smarowania silnika.",
    category: "internal",
  },
  {
    id: 54,
    name: "Wskaźnik temperatury oleju",
    nameEn: "Oil Temperature Gauge",
    description: "Pokazuje temperaturę oleju silnikowego.",
    category: "internal",
  },
  {
    id: 55,
    name: "Wskaźniki poziomu paliwa",
    nameEn: "Fuel Quantity Gauges",
    description: "Pokazują ilość paliwa w każdym zbiorniku.",
    category: "internal",
  },
  {
    id: 56,
    name: "Amperomierz",
    nameEn: "Ammeter",
    description: "Pokazuje obciążenie układu elektrycznego i stan ładowania akumulatora.",
    category: "internal",
  },
  {
    id: 57,
    name: "Woltomierz",
    nameEn: "Voltmeter",
    description: "Mierzy napięcie w układzie elektrycznym samolotu.",
    category: "internal",
  },
  {
    id: 58,
    name: "Zegar",
    nameEn: "Clock",
    description: "Standardowy przyrząd do pomiaru czasu lotu i nawigacji.",
    category: "internal",
  },
  {
    id: 59,
    name: "Akumulator",
    nameEn: "Battery",
    description: "Magazynuje energię elektryczną do uruchomienia silnika i zasilania systemów przy wyłączonym silniku.",
    category: "internal",
  },
  {
    id: 60,
    name: "Prądnica",
    nameEn: "Alternator",
    description: "Generuje prąd elektryczny podczas pracy silnika, ładuje akumulator i zasila systemy.",
    category: "internal",
  },
  {
    id: 61,
    name: "Bezpieczniki",
    nameEn: "Circuit Breakers",
    description: "Chronią układy elektryczne przed przeciążeniem i zwarciem.",
    category: "internal",
  },
  {
    id: 62,
    name: "Wyłącznik główny",
    nameEn: "Master Switch",
    description: "Główny wyłącznik zasilania elektrycznego samolotu.",
    category: "internal",
  },
  {
    id: 63,
    name: "Zasilanie awioniki",
    nameEn: "Avionics Master",
    description: "Oddzielny wyłącznik dla systemów radiowych i nawigacyjnych.",
    category: "internal",
  },
  {
    id: 64,
    name: "Zbiorniki paliwa",
    nameEn: "Fuel Tanks",
    description: "Zazwyczaj umieszczone w skrzydłach, przechowują paliwo lotnicze (Avgas 100LL).",
    category: "internal",
  },
  {
    id: 65,
    name: "Przewody paliwowe",
    nameEn: "Fuel Lines",
    description: "Transportują paliwo ze zbiorników do silnika.",
    category: "internal",
  },
  {
    id: 66,
    name: "Filtr paliwa",
    nameEn: "Fuel Strainer",
    description: "Oddziela wodę i zanieczyszczenia z paliwa przed dostarczeniem do silnika.",
    category: "internal",
  },
  {
    id: 67,
    name: "Pompa paliwa",
    nameEn: "Fuel Pump",
    description: "Elektryczna pompa zapasowa wspomaga mechaniczną pompę silnika.",
    category: "internal",
  },
  {
    id: 68,
    name: "Odpowietrzenie zbiornika",
    nameEn: "Fuel Vent",
    description: "Wyrównuje ciśnienie w zbiorniku paliwa podczas zużycia paliwa.",
    category: "internal",
  },
  {
    id: 69,
    name: "Układ smarowania",
    nameEn: "Lubrication System",
    description: "Pompa oleju, filtr, zbiornik i chłodnica zapewniają ciągłe smarowanie części ruchomych silnika.",
    category: "internal",
  },
  {
    id: 70,
    name: "Układ chłodzenia",
    nameEn: "Cooling System",
    description: "W Cessnach powietrzny - kanały w osłonie kierują przepływ powietrza wokół cylindrów silnika.",
    category: "internal",
  },
  {
    id: 71,
    name: "Magnetos",
    nameEn: "Magnetos",
    description: "Dwa niezależne systemy zapłonowe zapewniające redundancję i bezpieczeństwo.",
    category: "internal",
  },
  {
    id: 72,
    name: "Świece zapłonowe",
    nameEn: "Spark Plugs",
    description: "Zapalają mieszankę paliwowo-powietrzną w cylindrach silnika.",
    category: "internal",
  },
  {
    id: 73,
    name: "Stacyjka",
    nameEn: "Ignition Switch",
    description: "Pozycje: OFF (wyłączone), L (lewy magnetos), R (prawy magnetos), BOTH (oba), START (rozruch).",
    category: "internal",
  },
  {
    id: 74,
    name: "Pasy bezpieczeństwa",
    nameEn: "Seatbelts",
    description: "Zabezpieczają pilotów i pasażerów podczas lotu i lądowania.",
    category: "internal",
  },
  {
    id: 75,
    name: "Gaśnica",
    nameEn: "Fire Extinguisher",
    description: "Przenośna gaśnica do gaszenia pożarów w kabinie.",
    category: "internal",
  },
  {
    id: 76,
    name: "Lokalizator awaryjny",
    nameEn: "ELT",
    description: "Emergency Locator Transmitter - automatycznie wysyła sygnał ratunkowy po wypadku.",
    category: "internal",
  },
];

export default function AircraftParts() {
  const [selectedPart, setSelectedPart] = useState<AircraftPart | null>(null);
  const [hoveredPart, setHoveredPart] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Budowa samolotu - Cessna 172</CardTitle>
          <p className="text-muted-foreground">
            Obróć model 3D lub wybierz część z listy, aby poznać jej funkcję
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="relative">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="absolute top-2 right-2 z-10 p-2 bg-background/80 hover:bg-background rounded-lg backdrop-blur-sm transition-colors"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <div className={`rounded-lg overflow-hidden border border-border shadow-lg ${
                isFullscreen ? "fixed inset-4 z-50" : "aspect-video"
              }`}>
                <iframe
                  src="https://sketchfab.com/models/3bad38124b784eafa9f16740fbb9f23e/embed?autospin=0.2&autostart=1&ui_theme=dark"
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
                Użyj myszki aby obracać • Scroll aby przybliżać • Prawy przycisk aby przesuwać
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
                  <h3 className="text-xl font-bold text-primary">{selectedPart.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPart.nameEn}</p>
                </div>
                {selectedPart.image && (
                  <div className="relative aspect-square w-full max-w-sm mx-auto rounded-lg overflow-hidden border border-border bg-card">
                    <img 
                      src={selectedPart.image} 
                      alt={`${selectedPart.name} - ${selectedPart.nameEn}`}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                )}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm leading-relaxed">{selectedPart.description}</p>
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
          <p className="text-sm text-muted-foreground">External Aircraft Parts</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aircraftParts.filter(p => p.category === "external").map((part) => (
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
                  <p className="text-xs text-muted-foreground">{part.nameEn}</p>
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
              {aircraftParts.filter(p => p.category === "internal").map((part) => (
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
                  <p className="text-xs text-muted-foreground">{part.nameEn}</p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
