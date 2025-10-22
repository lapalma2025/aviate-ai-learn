import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Maximize2 } from "lucide-react";
import cessnaImage from "@/assets/cessna-side-view.png";

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
            <Tabs defaultValue="3d" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="3d">Model 3D (interaktywny)</TabsTrigger>
                <TabsTrigger value="diagram">Diagram 2D</TabsTrigger>
              </TabsList>
              
              <TabsContent value="3d" className="mt-0">
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
              </TabsContent>

              <TabsContent value="diagram" className="mt-0">
                <TooltipProvider delayDuration={0}>
                  <div className="relative w-full">
                    <img
                      src={cessnaImage}
                      alt="Cessna 172"
                      className="w-full h-auto rounded-lg"
                    />
                    {aircraftParts.map((part) => (
                      <Tooltip key={part.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={`absolute cursor-pointer transition-all duration-200 rounded ${
                              hoveredPart === part.id
                                ? "bg-primary/30 ring-2 ring-primary shadow-lg shadow-primary/50"
                                : "hover:bg-primary/20"
                            } ${
                              selectedPart?.id === part.id
                                ? "bg-primary/40 ring-2 ring-primary"
                                : ""
                            }`}
                            style={{
                              left: `${part.position.x}%`,
                              top: `${part.position.y}%`,
                              width: `${part.position.width}%`,
                              height: `${part.position.height}%`,
                            }}
                            onMouseEnter={() => setHoveredPart(part.id)}
                            onMouseLeave={() => setHoveredPart(null)}
                            onClick={() => setSelectedPart(part)}
                          />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-xs bg-popover border-primary/20 animate-fade-in"
                        >
                          <p className="font-semibold">{part.name}</p>
                          <p className="text-xs text-muted-foreground">{part.nameEn}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </TabsContent>
            </Tabs>
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
          <CardTitle>Lista wszystkich części</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aircraftParts.map((part) => (
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
