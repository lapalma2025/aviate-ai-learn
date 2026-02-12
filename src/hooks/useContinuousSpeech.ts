import { useState, useRef, useCallback } from "react";

export function useContinuousSpeech(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);
  const transcriptRef = useRef("");
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wantsListeningRef = useRef(false);
  onResultRef.current = onResult;

  const start = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    transcriptRef.current = "";
    wantsListeningRef.current = true;

    const recognition = new SpeechRecognition();
    recognition.lang = "pl-PL";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript;
          console.log("[Speech] Final transcript:", transcript);
          transcriptRef.current += (transcriptRef.current ? " " : "") + transcript;
        }
      }
      // Reset silence timer — auto-send after 2.5s silence
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (transcriptRef.current.trim()) {
          console.log("[Speech] Silence timeout — sending:", transcriptRef.current.trim());
          onResultRef.current(transcriptRef.current.trim());
          transcriptRef.current = "";
        }
        // Stop after sending
        wantsListeningRef.current = false;
        try { recognition.stop(); } catch {}
      }, 2500);
    };

    recognition.onerror = (e: any) => {
      console.warn("[Speech] Error:", e.error);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      // no-speech and aborted are normal — auto-restart happens in onend
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        wantsListeningRef.current = false;
        setIsListening(false);
      }
    };

    // Auto-restart on silence timeout (browser stops after ~5-10s silence)
    recognition.onend = () => {
      if (wantsListeningRef.current) {
        // Browser stopped due to silence — restart automatically
        console.log("[Speech] Auto-restarting via onend");
        try { recognition.start(); } catch {}
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  const stop = useCallback(() => {
    // Send accumulated transcript before stopping
    wantsListeningRef.current = false;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (transcriptRef.current.trim()) {
      onResultRef.current(transcriptRef.current.trim());
      transcriptRef.current = "";
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
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
