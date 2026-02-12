import { useState, useRef, useCallback } from "react";

export function useContinuousSpeech(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);
  const transcriptRef = useRef("");
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  onResultRef.current = onResult;

  const start = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    transcriptRef.current = "";

    const recognition = new SpeechRecognition();
    recognition.lang = "pl-PL";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcriptRef.current += (transcriptRef.current ? " " : "") + event.results[i][0].transcript;
        }
      }
      // Reset silence timer — auto-send after 2.5s silence
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (transcriptRef.current.trim()) {
          onResultRef.current(transcriptRef.current.trim());
          transcriptRef.current = "";
        }
        recognition.stop();
      }, 2500);
    };
    recognition.onerror = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setIsListening(false);
    };
    recognition.onend = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  const stop = useCallback(() => {
    // Send accumulated transcript before stopping
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (transcriptRef.current.trim()) {
      onResultRef.current(transcriptRef.current.trim());
      transcriptRef.current = "";
    }
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
