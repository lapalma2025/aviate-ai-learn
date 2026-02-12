import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Radio,
  Volume2,
  VolumeX,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  Loader2,
  Mic,
  Plane,
  TowerControl,
} from "lucide-react";
import { useRadioStatic } from "@/hooks/useRadioStatic";
import { useRadioTTS } from "@/hooks/useRadioTTS";
import { useContinuousSpeech } from "@/hooks/useContinuousSpeech";
import gsap from "gsap";

// ─── Types ───────────────────────────────────────────────────
interface ChatMessage {
  role: "pilot" | "atc" | "system";
  text: string;
  errors?: string[];
  expectedReadback?: string | null;
  hint?: string | null;
  phaseComplete?: boolean;
}

interface Scenario {
  id: string;
  label: string;
  description: string;
  prompt: string;
}

// ─── Scenarios ───────────────────────────────────────────────
const SCENARIOS: Scenario[] = [
  {
    id: "startup_taxi",
    label: "Uruchomienie i kołowanie",
    description: "EPWA (Warszawa Okęcie), Cessna 172, SP-KAM",
    prompt:
      "Lotnisko: EPWA (Warszawa Okęcie). Znak wywoławczy pilota: SP-KAM. Typ: Cessna 172. Faza lotu: uruchomienie silnika i kołowanie na pas startowy. Rozpocznij od oczekiwania na kontakt pilota na częstotliwości ground.",
  },
  {
    id: "takeoff",
    label: "Start i odlot",
    description: "EPKK (Kraków Balice), PA-28, SP-LTA",
    prompt:
      "Lotnisko: EPKK (Kraków-Balice). Znak wywoławczy pilota: SP-LTA. Typ: PA-28 Warrior. Faza lotu: pilot jest na progu drogi startowej, gotowy do startu. Wiatr 240/8kt, QNH 1013. Ruch na lotnisku: Boeing 737 na podejściu końcowym.",
  },
  {
    id: "circuit",
    label: "Lot po kręgu",
    description: "EPPO (Poznań Ławica), Cessna 152, SP-ABC",
    prompt:
      "Lotnisko: EPPO (Poznań Ławica). Znak wywoławczy pilota: SP-ABC. Typ: Cessna 152. Faza lotu: lot po kręgu (circuit pattern). Pilot jest w powietrzu na downwindzie, lewy kręg, pas 28. QNH 1015, wiatr 260/5kt.",
  },
  {
    id: "landing",
    label: "Podejście i lądowanie",
    description: "EPWR (Wrocław), Diamond DA40, SP-WRC",
    prompt:
      "Lotnisko: EPWR (Wrocław). Znak wywoławczy pilota: SP-WRC. Typ: Diamond DA40. Faza lotu: podejście do lądowania, pilot zgłasza się na częstotliwości wieży w odległości 10 NM od lotniska. Wiatr 180/12kt, porywisty do 20kt. QNH 1008. Lekki deszcz.",
  },
  {
    id: "emergency",
    label: "Sytuacja awaryjna",
    description: "EPGD (Gdańsk), Cessna 172, SP-MAY",
    prompt:
      "Lotnisko: EPGD (Gdańsk). Znak wywoławczy pilota: SP-MAY. Typ: Cessna 172. Faza lotu: lot na trasie, pilot ma problem z silnikiem (spadek obrotów). Jest 15 NM na zachód od lotniska na wysokości 3000 ft. QNH 1020.",
  },
  {
    id: "vfr_transit",
    label: "Przelot przez CTR",
    description: "EPWA CTR, Piper PA-28, SP-FLY",
    prompt:
      "Lotnisko: przelot przez strefę kontrolowaną EPWA CTR. Znak wywoławczy pilota: SP-FLY. Typ: Piper PA-28. Faza lotu: pilot zgłasza się na granicy CTR, chce przelecieć tranzytem z zachodu na wschód na wysokości 1500 ft. QNH 1017.",
  },
];

// ─── Main Component ──────────────────────────────────────────
const RadioPhraseology = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [sessionActive, setSessionActive] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scenarioCardRef = useRef<HTMLDivElement>(null);
  const chatCardRef = useRef<HTMLDivElement>(null);
  const micBtnRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();
  const radioStatic = useRadioStatic();
  const radioTTS = useRadioTTS();

  // Voice: when speech result arrives, auto-send
  const handleVoiceResult = useCallback((text: string) => {
    if (!text.trim()) return;
    sendMessageWithText(text);
  }, []);

  const speech = useContinuousSpeech(handleVoiceResult);

  // ─── GSAP Animations ────────────────────────────────────
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (!sessionActive && scenarioCardRef.current) {
      gsap.fromTo(
        scenarioCardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.4)" }
      );
    }
  }, [sessionActive]);

  useEffect(() => {
    if (sessionActive && chatCardRef.current) {
      gsap.fromTo(
        chatCardRef.current,
        { opacity: 0, scale: 0.92, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }
  }, [sessionActive]);

  // Animate new messages
  useEffect(() => {
    if (scrollRef.current) {
      const lastMsg = scrollRef.current.querySelector(".chat-message:last-child");
      if (lastMsg) {
        gsap.fromTo(
          lastMsg,
          { opacity: 0, x: lastMsg.classList.contains("msg-pilot") ? 40 : -40, scale: 0.9 },
          { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: "power2.out" }
        );
      }
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Pulse mic button when idle
  useEffect(() => {
    if (sessionActive && micBtnRef.current && !loading && !speech.isListening) {
      const pulse = gsap.to(micBtnRef.current, {
        boxShadow: "0 0 0 12px hsla(var(--primary) / 0.15)",
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      return () => { pulse.kill(); };
    }
  }, [sessionActive, loading, speech.isListening]);

  const startSession = async () => {
    const scenario = SCENARIOS.find((s) => s.id === selectedScenario);
    if (!scenario) {
      toast({
        title: "Wybierz scenariusz",
        description: "Musisz wybrać scenariusz przed rozpoczęciem.",
        variant: "destructive",
      });
      return;
    }

    setMessages([
      {
        role: "system",
        text: `📡 Scenariusz: ${scenario.label}\n${scenario.description}\n\n🎙️ Kliknij mikrofon i nawiąż kontakt radiowy z wieżą.`,
      },
    ]);
    setSessionActive(true);
    radioStatic.start();
  };

  const sendMessageWithText = async (text: string) => {
    if (!text.trim() || loading) return;

    const pilotMsg: ChatMessage = { role: "pilot", text: text.trim() };
    setMessages((prev) => {
      const newMsgs = [...prev, pilotMsg];
      doSend(newMsgs, text.trim());
      return newMsgs;
    });
  };

  const doSend = async (currentMessages: ChatMessage[], pilotText: string) => {
    setLoading(true);

    try {
      const scenario = SCENARIOS.find((s) => s.id === selectedScenario);

      const apiMessages = currentMessages
        .filter((m) => m.role === "pilot" || m.role === "atc")
        .map((m) => ({
          role: m.role === "pilot" ? "user" : "assistant",
          content: m.text,
        }));

      const { data, error } = await supabase.functions.invoke("grok-atc", {
        body: {
          messages: apiMessages,
          scenario: scenario?.prompt,
        },
      });

      if (error) throw error;

      const atcMsg: ChatMessage = {
        role: "atc",
        text: data.atc_message || "...",
        errors: data.pilot_errors,
        expectedReadback: data.expected_readback,
        hint: data.hint,
        phaseComplete: data.phase_complete,
      };

      setMessages((prev) => {
        const updated = [...prev, atcMsg];
        if (data.phase_complete) {
          updated.push({
            role: "system",
            text: "✅ Faza korespondencji zakończona pomyślnie! Możesz kontynuować lub wybrać nowy scenariusz.",
          });
        }
        return updated;
      });

      // TTS with radio filter
      if (ttsEnabled && data.atc_message) {
        await radioTTS.speak(data.atc_message);
      }

      // Auto-restart mic after ATC finishes
      if (!data.phase_complete) {
        setTimeout(() => speech.start(), 400);
      }
    } catch (error: any) {
      toast({
        title: "Błąd komunikacji",
        description: error.message || "Nie udało się połączyć z ATC",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetSession = () => {
    setMessages([]);
    setSessionActive(false);
    radioStatic.stop();
    speech.stop();
    radioTTS.cancel();
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div ref={headerRef} className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Radio className="h-7 w-7 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Frazeologia Radiowa</h1>
          <p className="text-muted-foreground text-sm">
            Ćwicz korespondencję pilot–wieża z AI kontrolerem ATC
          </p>
        </div>
      </div>

      {/* Scenario selection */}
      {!sessionActive && (
        <div ref={scenarioCardRef}>
          <Card className="border-2 border-primary/20 shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/0" />
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Wybierz scenariusz
              </CardTitle>
              <CardDescription>
                AI wcieli się w rolę wymagającego kontrolera ATC (ICAO/ULC).
                Komunikacja odbywa się głosowo — jak przez prawdziwe radio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Wybierz scenariusz..." />
                </SelectTrigger>
                <SelectContent>
                  {SCENARIOS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <span className="font-medium">{s.label}</span>
                      <span className="text-muted-foreground ml-2 text-xs">{s.description}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedScenario && (
                <div className="p-4 bg-muted/50 rounded-xl border text-sm flex items-start gap-3">
                  <Radio className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">
                      {SCENARIOS.find((s) => s.id === selectedScenario)?.label}
                    </p>
                    <p className="text-muted-foreground">
                      {SCENARIOS.find((s) => s.id === selectedScenario)?.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-sm text-muted-foreground flex items-center gap-2">
                <Mic className="h-4 w-4 text-primary" />
                Tryb głosowy z filtrem radiowym — mów jak przez COM radio
              </div>

              <Button
                onClick={startSession}
                disabled={!selectedScenario}
                className="w-full h-12 text-base font-semibold gap-2"
              >
                <Radio className="h-5 w-5" />
                Rozpocznij sesję radiową
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active session */}
      {sessionActive && (
        <div ref={chatCardRef} className="space-y-4">
          {/* Controls bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1.5 py-1 px-3">
              <Radio className="h-3 w-3 text-primary" />
              {SCENARIOS.find((s) => s.id === selectedScenario)?.label}
            </Badge>

            <Badge variant="secondary" className="gap-1.5 py-1 px-3">
              <Mic className="h-3 w-3" />
              Głos + Radio FX
            </Badge>

            <div className="flex-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={radioStatic.toggle}
              className="gap-1.5"
            >
              {radioStatic.isPlaying ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
              Szum
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className="gap-1.5"
            >
              {ttsEnabled ? "🔊" : "🔇"} ATC
            </Button>

            <Button variant="ghost" size="sm" onClick={resetSession} className="gap-1.5">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Chat area */}
          <Card className="border-2 border-border/50 shadow-xl overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-60" />
            <CardContent className="p-0">
              <ScrollArea className="h-[420px] p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`chat-message ${msg.role === "pilot" ? "msg-pilot" : ""}`}
                    >
                      {msg.role === "system" && (
                        <div className="text-center text-sm text-muted-foreground bg-muted/40 rounded-xl p-4 whitespace-pre-line border border-border/50">
                          {msg.text}
                        </div>
                      )}

                      {msg.role === "pilot" && (
                        <div className="flex justify-end">
                          <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%] shadow-md">
                            <div className="text-xs opacity-70 mb-1 flex items-center gap-1">
                              <Plane className="h-3 w-3" /> Pilot
                            </div>
                            {msg.text}
                          </div>
                        </div>
                      )}

                      {msg.role === "atc" && (
                        <div className="space-y-2">
                          <div className="flex justify-start">
                            <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%] shadow-md">
                              <div className="text-xs opacity-70 mb-1 flex items-center gap-1">
                                <TowerControl className="h-3 w-3" /> ATC
                              </div>
                              {msg.text}
                            </div>
                          </div>

                          {msg.errors && msg.errors.length > 0 && (
                            <div className="ml-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm">
                              <div className="flex items-center gap-1.5 font-medium text-destructive mb-1.5">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Błędy we frazeologii:
                              </div>
                              <ul className="list-disc list-inside text-destructive/80 space-y-0.5">
                                {msg.errors.map((err, j) => (
                                  <li key={j}>{err}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {msg.expectedReadback && (
                            <div className="ml-2 p-3 bg-accent/50 border border-accent rounded-xl text-sm">
                              <span className="font-medium">Oczekiwany readback: </span>
                              {msg.expectedReadback}
                            </div>
                          )}

                          {msg.hint && (
                            <div className="ml-2 p-3 bg-muted rounded-xl text-sm flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                              <span>{msg.hint}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary rounded-2xl px-4 py-3 flex items-center gap-2 shadow-md">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">ATC odpowiada...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Voice input area */}
              <div className="border-t p-6 bg-muted/20">
                <div className="flex flex-col items-center gap-4">
                  <Button
                    ref={micBtnRef}
                    size="lg"
                    variant={speech.isListening ? "destructive" : "default"}
                    onClick={speech.toggle}
                    disabled={loading}
                    className="w-28 h-28 rounded-full flex flex-col gap-2 text-lg shadow-lg transition-all duration-300"
                  >
                    {speech.isListening ? (
                      <>
                        <Mic className="h-9 w-9 animate-pulse" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">Nadaję...</span>
                      </>
                    ) : loading ? (
                      <>
                        <Loader2 className="h-9 w-9 animate-spin" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">ATC...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-9 w-9" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">PTT</span>
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center max-w-xs">
                    {speech.isListening
                      ? "🔴 Nadaję... mów wyraźnie jak przez radio"
                      : loading
                        ? "Kontroler odpowiada..."
                        : "Naciśnij PTT aby nadawać"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RadioPhraseology;
