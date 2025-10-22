import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Check } from "lucide-react";
import Aircraft3DViewer from "@/components/Aircraft3DViewer";

interface AircraftPart {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  position: { x: number; y: number; width: number; height: number };
}

const aircraftParts: AircraftPart[] = [
  {
    id: 1,
    name: "Śmigło",
    nameEn: "Propeller",
    description: "Zapewnia ciąg napędowy, zasysa powietrze i pcha samolot do przodu. Jest napędzane przez silnik i przekształca moc obrotową w siłę pociągową.",
    position: { x: 85, y: 42, width: 6, height: 8 },
  },
  {
    id: 2,
    name: "Kołpak śmigła",
    nameEn: "Spinner",
    description: "Aerodynamiczna osłona centralnej części śmigła. Zmniejsza opór powietrza i chroni mechanizm mocowania śmigła.",
    position: { x: 91, y: 44, width: 3, height: 4 },
  },
  {
    id: 3,
    name: "Osłona silnika",
    nameEn: "Engine Cowling",
    description: "Chroni silnik i kieruje przepływ powietrza chłodzącego. Zapewnia odpowiednią temperaturę pracy silnika podczas lotu.",
    position: { x: 88, y: 45, width: 6, height: 6 },
  },
  {
    id: 4,
    name: "Przednia szyba",
    nameEn: "Windshield",
    description: "Chroni pilotów przed wiatrem i owadami. Wykonana z wytrzymałego, przezroczystego materiału odpornego na wysokie prędkości.",
    position: { x: 70, y: 40, width: 8, height: 6 },
  },
  {
    id: 5,
    name: "Skrzydło",
    nameEn: "Wing",
    description: "Generuje siłę nośną potrzebną do lotu. Profil skrzydła powoduje różnicę ciśnień powietrza nad i pod skrzydłem, co tworzy unoszenie.",
    position: { x: 45, y: 28, width: 35, height: 15 },
  },
  {
    id: 6,
    name: "Lotka",
    nameEn: "Aileron",
    description: "Kontroluje przechylenie samolotu (roll). Znajduje się na tylnej krawędzi skrzydła i porusza się przeciwnie na obu skrzydłach.",
    position: { x: 30, y: 32, width: 12, height: 4 },
  },
  {
    id: 7,
    name: "Klapa",
    nameEn: "Flap",
    description: "Zwiększa siłę nośną przy starcie i lądowaniu. Wysuwana z tylnej krawędzi skrzydła, zwiększa krzywizną profilu skrzydła.",
    position: { x: 58, y: 38, width: 10, height: 4 },
  },
  {
    id: 8,
    name: "Kadłub",
    nameEn: "Fuselage",
    description: "Główna część samolotu, mieści kabinę i bagażnik. Zapewnia strukturę nośną i połączenie wszystkich pozostałych elementów.",
    position: { x: 50, y: 42, width: 28, height: 10 },
  },
  {
    id: 9,
    name: "Statecznik poziomy",
    nameEn: "Horizontal Stabilizer",
    description: "Stabilizuje samolot w osi podłużnej. Zapobiega niekontrolowanym ruchom góra-dół podczas lotu.",
    position: { x: 18, y: 43, width: 12, height: 3 },
  },
  {
    id: 10,
    name: "Ster wysokości",
    nameEn: "Elevator",
    description: "Kontroluje wznoszenie i opadanie (pitch). Znajduje się na tylnej krawędzi statecznika poziomego.",
    position: { x: 15, y: 43, width: 8, height: 3 },
  },
  {
    id: 11,
    name: "Statecznik pionowy",
    nameEn: "Vertical Stabilizer",
    description: "Stabilizuje samolot kierunkowo. Zapobiega niepożądanym odchyleniom od kursu podczas lotu.",
    position: { x: 20, y: 32, width: 8, height: 12 },
  },
  {
    id: 12,
    name: "Ster kierunku",
    nameEn: "Rudder",
    description: "Kontroluje skręt w lewo/prawo (yaw). Znajduje się na tylnej krawędzi statecznika pionowego.",
    position: { x: 16, y: 35, width: 5, height: 9 },
  },
  {
    id: 13,
    name: "Podwozie",
    nameEn: "Landing Gear",
    description: "Umożliwia start, lądowanie i kołowanie. Absorbuje uderzenia podczas lądowania i pozwala na poruszanie się po ziemi.",
    position: { x: 52, y: 60, width: 18, height: 10 },
  },
  {
    id: 14,
    name: "Przednie koło",
    nameEn: "Nose Wheel",
    description: "Główne koło sterujące na ziemi. Umożliwia skręcanie podczas kołowania i jest połączone z pedalami steru kierunku.",
    position: { x: 82, y: 62, width: 6, height: 8 },
  },
  {
    id: 15,
    name: "Koła główne",
    nameEn: "Main Wheels",
    description: "Podpierają samolot przy lądowaniu. Przyjmują większość ciężaru samolotu podczas operacji naziemnych.",
    position: { x: 58, y: 62, width: 8, height: 8 },
  },
  {
    id: 16,
    name: "Wspornik skrzydła",
    nameEn: "Wing Strut",
    description: "Wzmacnia strukturę skrzydła. Przenosi obciążenia ze skrzydła na kadłub i zwiększa sztywność konstrukcji.",
    position: { x: 60, y: 48, width: 4, height: 12 },
  },
  {
    id: 17,
    name: "Rurka Pitota",
    nameEn: "Pitot Tube",
    description: "Mierzy prędkość powietrza. Umieszczona w niezmąconym strumieniu powietrza, dostarcza danych do wskaźnika prędkości.",
    position: { x: 48, y: 38, width: 3, height: 2 },
  },
  {
    id: 18,
    name: "Światła pozycyjne",
    nameEn: "Navigation Lights",
    description: "Ułatwiają widoczność w nocy. Czerwone na lewym skrzydle, zielone na prawym, białe z tyłu - informują o orientacji samolotu.",
    position: { x: 28, y: 32, width: 3, height: 2 },
  },
  {
    id: 19,
    name: "Port statyczny",
    nameEn: "Static Port",
    description: "Mierzy ciśnienie powietrza do przyrządów pokładowych. Dostarcza danych dla wysokościomierza i wariometru.",
    position: { x: 68, y: 50, width: 2, height: 2 },
  },
  {
    id: 20,
    name: "Antena",
    nameEn: "Antenna",
    description: "Umożliwia komunikację radiową i nawigację GPS. Niezbędna do łączności z kontrolą ruchu lotniczego i odbioru sygnałów nawigacyjnych.",
    position: { x: 55, y: 38, width: 3, height: 2 },
  },
];

export default function AircraftParts() {
  const [selectedPart, setSelectedPart] = useState<AircraftPart | null>(null);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Budowa samolotu - Cessna 172</CardTitle>
          <p className="text-muted-foreground">
            Obróć model 3D myszką i wybierz część z listy, aby poznać jej funkcję
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="h-[600px] rounded-lg overflow-hidden">
              <Aircraft3DViewer
                selectedPartId={selectedPart?.id || null}
                onPartClick={(partId) => {
                  const part = aircraftParts.find((p) => p.id === partId);
                  if (part) setSelectedPart(part);
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center px-6 pb-4">
              Użyj myszki aby obracać • Scroll aby przybliżać • Kliknij na część aby zobaczyć szczegóły
            </p>
          </CardContent>
        </Card>

        <Card className="lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {selectedPart ? (
                <>
                  <span>Szczegóły części</span>
                  <button
                    onClick={() => setSelectedPart(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <span>Wybierz część</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPart ? (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary shadow-sm">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-primary">{selectedPart.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedPart.nameEn}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-card rounded-lg border border-border">
                  <p className="text-sm leading-relaxed">{selectedPart.description}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Wybierz część z listy poniżej,</p>
                <p>aby zobaczyć szczegółowy opis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista wszystkich części</CardTitle>
          <p className="text-sm text-muted-foreground">
            Kliknij na część, aby zobaczyć szczegóły i podświetlić ją na modelu
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {aircraftParts.map((part) => (
                <button
                  key={part.id}
                  onClick={() => setSelectedPart(part)}
                  className={`p-3 rounded-lg border text-left transition-all hover:shadow-md group relative ${
                    selectedPart?.id === part.id
                      ? "bg-primary/10 border-primary shadow-md ring-2 ring-primary/50"
                      : "bg-card border-border hover:bg-accent hover:border-primary/30"
                  }`}
                >
                  {selectedPart?.id === part.id && (
                    <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <p className={`font-semibold text-sm ${
                    selectedPart?.id === part.id ? "text-primary" : ""
                  }`}>
                    {part.name}
                  </p>
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
