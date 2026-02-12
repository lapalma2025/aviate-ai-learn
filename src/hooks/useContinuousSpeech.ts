import { useState, useRef, useCallback } from "react";

export function useContinuousSpeech(onResult: (text: string) => void) {
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
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let silenceTimer: ReturnType<typeof setTimeout> | null = null;
    let fullTranscript = "";

    recognition.onresult = (event: any) => {
      // Collect all final results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          fullTranscript += (fullTranscript ? " " : "") + event.results[i][0].transcript;
        }
      }
      // Reset silence timer — give 2.5s of silence before sending
      if (silenceTimer) clearTimeout(silenceTimer);
      silenceTimer = setTimeout(() => {
        if (fullTranscript.trim()) {
          onResultRef.current(fullTranscript.trim());
          fullTranscript = "";
        }
        recognition.stop();
      }, 2500);
    };
    recognition.onerror = () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      setIsListening(false);
    };
    recognition.onend = () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      setIsListening(false);
    };

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
