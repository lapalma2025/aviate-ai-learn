import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Send,
  Volume2,
  VolumeX,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  Loader2,
  Mic,
  MicOff,
} from "lucide-react";

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

// ─── Web Audio API: Radio Static ─────────────────────────────
function useRadioStatic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<ScriptProcessorNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const start = useCallback(() => {
    if (ctxRef.current) return;
    const ctx = new AudioContext();
    const bufferSize = 4096;
    const whiteNoise = ctx.createScriptProcessor(bufferSize, 1, 1);
    whiteNoise.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    };

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 0.03;

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    ctxRef.current = ctx;
    noiseRef.current = whiteNoise;
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
      noiseRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) stop();
    else start();
  }, [isPlaying, start, stop]);

  useEffect(() => () => { ctxRef.current?.close(); }, []);

  return { isPlaying, toggle, start, stop };
}

// ─── TTS with radio effect ───────────────────────────────────
function speakText(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) { resolve(); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pl-PL";
    utterance.rate = 0.9;
    utterance.pitch = 0.85;
    utterance.volume = 0.9;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

// ─── Continuous Speech Recognition ───────────────────────────
function useContinuousSpeech(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const start = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pl-PL";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0]?.[0]?.transcript;
      if (text) onResultRef.current(text);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (isListening) stop(); else start();
  }, [isListening, start, stop]);

  const supported =
    typeof window !== "undefined" &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  return { isListening, toggle, start, stop, supported };
}

// ─── Main Component ──────────────────────────────────────────
const RadioPhraseology = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [sessionActive, setSessionActive] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [voiceMode, setVoiceMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const radioStatic = useRadioStatic();

  // Voice mode: when speech result arrives, auto-send
  const handleVoiceResult = useCallback((text: string) => {
    if (!text.trim()) return;
    setInput(text);
    // We'll send on next tick so input state updates
    setTimeout(() => {
      sendMessageWithText(text);
    }, 100);
  }, []);

  const speech = useContinuousSpeech(handleVoiceResult);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
        text: `📡 Scenariusz: ${scenario.label}\n${scenario.description}\n\nNawiąż kontakt radiowy z wieżą.\n\n${voiceMode ? "🎙️ Tryb głosowy aktywny — kliknij mikrofon i mów." : "⌨️ Tryb tekstowy — wpisz korespondencję."}`,
      },
    ]);
    setSessionActive(true);
    radioStatic.start();
  };

  const sendMessageWithText = async (text: string) => {
    if (!text.trim() || loading) return;

    const pilotMsg: ChatMessage = { role: "pilot", text: text.trim() };
    setMessages(prev => {
      const newMsgs = [...prev, pilotMsg];
      doSend(newMsgs, text.trim());
      return newMsgs;
    });
    setInput("");
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

      // TTS — speak the ATC response, then re-enable mic in voice mode
      if (ttsEnabled && data.atc_message) {
        await speakText(data.atc_message);
      }

      // In voice mode, auto-restart listening after ATC finishes speaking
      if (voiceMode && !data.phase_complete) {
        setTimeout(() => speech.start(), 300);
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

  const sendMessage = () => sendMessageWithText(input);

  const resetSession = () => {
    setMessages([]);
    setSessionActive(false);
    setInput("");
    radioStatic.stop();
    speech.stop();
    window.speechSynthesis?.cancel();
  };

  const toggleVoiceMode = () => {
    const newMode = !voiceMode;
    setVoiceMode(newMode);
    if (!newMode) {
      speech.stop();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Radio className="h-8 w-8 text-primary" />
          Frazeologia Radiowa
        </h1>
        <p className="text-muted-foreground mt-1">
          Ćwicz korespondencję radiową pilot–wieża z AI kontrolerem ATC
        </p>
      </div>

      {/* Scenario selection */}
      {!sessionActive && (
        <Card>
          <CardHeader>
            <CardTitle>Wybierz scenariusz</CardTitle>
            <CardDescription>
              Wybierz fazę lotu do przećwiczenia. AI wcieli się w rolę kontrolera ATC i będzie wymagający — jak prawdziwy kontroler.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz scenariusz..." />
              </SelectTrigger>
              <SelectContent>
                {SCENARIOS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label} — {s.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedScenario && (
              <div className="p-3 bg-muted rounded-md text-sm">
                {SCENARIOS.find((s) => s.id === selectedScenario)?.description}
              </div>
            )}

            {/* Voice mode toggle */}
            <div className="flex items-center gap-3 p-3 border rounded-md">
              <Button
                variant={voiceMode ? "default" : "outline"}
                size="sm"
                onClick={toggleVoiceMode}
                className="gap-2"
              >
                <Mic className="h-4 w-4" />
                {voiceMode ? "Tryb głosowy ✓" : "Tryb głosowy"}
              </Button>
              <span className="text-sm text-muted-foreground">
                {voiceMode
                  ? "Będziesz rozmawiać głosowo z kontrolerem — jak przez radio!"
                  : "Włącz aby rozmawiać głosowo zamiast pisać"}
              </span>
            </div>

            <Button onClick={startSession} disabled={!selectedScenario} className="w-full">
              <Radio className="h-4 w-4 mr-2" />
              Rozpocznij sesję radiową
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active session */}
      {sessionActive && (
        <>
          {/* Controls bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1">
              <Radio className="h-3 w-3" />
              {SCENARIOS.find((s) => s.id === selectedScenario)?.label}
            </Badge>

            <Badge variant={voiceMode ? "default" : "secondary"} className="gap-1">
              {voiceMode ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
              {voiceMode ? "Głos" : "Tekst"}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={radioStatic.toggle}
            >
              {radioStatic.isPlaying ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setTtsEnabled(!ttsEnabled)}
            >
              {ttsEnabled ? "🔊 Głos ATC" : "🔇 Głos ATC"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleVoiceMode}
            >
              {voiceMode ? "⌨️ Przełącz na tekst" : "🎙️ Przełącz na głos"}
            </Button>

            <Button variant="outline" size="sm" onClick={resetSession}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Nowa sesja
            </Button>
          </div>

          {/* Chat area */}
          <Card className="border-2">
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i}>
                      {msg.role === "system" && (
                        <div className="text-center text-sm text-muted-foreground bg-muted/50 rounded-md p-3 whitespace-pre-line">
                          {msg.text}
                        </div>
                      )}

                      {msg.role === "pilot" && (
                        <div className="flex justify-end">
                          <div className="bg-primary text-primary-foreground rounded-lg rounded-br-none px-4 py-2 max-w-[80%]">
                            <div className="text-xs opacity-70 mb-1">🛩️ Pilot</div>
                            {msg.text}
                          </div>
                        </div>
                      )}

                      {msg.role === "atc" && (
                        <div className="space-y-2">
                          <div className="flex justify-start">
                            <div className="bg-secondary text-secondary-foreground rounded-lg rounded-bl-none px-4 py-2 max-w-[80%]">
                              <div className="text-xs opacity-70 mb-1">🗼 ATC</div>
                              {msg.text}
                            </div>
                          </div>

                          {msg.errors && msg.errors.length > 0 && (
                            <div className="ml-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md text-sm">
                              <div className="flex items-center gap-1 font-medium text-destructive mb-1">
                                <AlertTriangle className="h-3 w-3" />
                                Błędy we frazeologii:
                              </div>
                              <ul className="list-disc list-inside text-destructive/80">
                                {msg.errors.map((err, j) => (
                                  <li key={j}>{err}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {msg.expectedReadback && (
                            <div className="ml-2 p-2 bg-accent/50 border border-accent rounded-md text-sm">
                              <span className="font-medium">Oczekiwany readback: </span>
                              {msg.expectedReadback}
                            </div>
                          )}

                          {msg.hint && (
                            <div className="ml-2 p-2 bg-muted rounded-md text-sm flex items-start gap-1">
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
                      <div className="bg-secondary rounded-lg px-4 py-2 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">ATC odpowiada...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input area */}
              <div className="border-t p-4">
                {voiceMode ? (
                  <div className="flex flex-col items-center gap-3">
                    <Button
                      size="lg"
                      variant={speech.isListening ? "destructive" : "default"}
                      onClick={speech.toggle}
                      disabled={loading}
                      className="w-32 h-32 rounded-full flex flex-col gap-2"
                    >
                      {speech.isListening ? (
                        <>
                          <Mic className="h-10 w-10 animate-pulse" />
                          <span className="text-xs">Mówię...</span>
                        </>
                      ) : loading ? (
                        <>
                          <Loader2 className="h-10 w-10 animate-spin" />
                          <span className="text-xs">ATC...</span>
                        </>
                      ) : (
                        <>
                          <Mic className="h-10 w-10" />
                          <span className="text-xs">Naciśnij i mów</span>
                        </>
                      )}
                    </Button>
                    {input && (
                      <p className="text-sm text-muted-foreground italic">"{input}"</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {speech.isListening
                        ? "Słucham... mów wyraźnie jak przez radio"
                        : loading
                        ? "Kontroler odpowiada..."
                        : "Kliknij mikrofon aby mówić"}
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Wpisz korespondencję radiową..."
                      disabled={loading}
                      className="flex-1"
                    />
                    {speech.supported && (
                      <Button
                        variant={speech.isListening ? "destructive" : "outline"}
                        size="icon"
                        onClick={speech.toggle}
                        disabled={loading}
                        title="Mów"
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                    )}
                    <Button onClick={sendMessage} disabled={loading || !input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default RadioPhraseology;
