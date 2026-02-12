import { useState, useRef, useCallback } from "react";

export function useContinuousSpeech(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);
  const wantsListeningRef = useRef(false);
  onResultRef.current = onResult;

  const start = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("[Speech] SpeechRecognition not supported");
      return;
    }

    // Stop any existing instance
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }

    wantsListeningRef.current = true;

    const recognition = new SpeechRecognition();
    recognition.lang = "pl-PL";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = "";

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + transcript;
          console.log("[Speech] Final chunk:", transcript);
        } else {
          interim = transcript;
          console.log("[Speech] Interim:", transcript);
        }
      }
    };

    recognition.onerror = (e: any) => {
      console.warn("[Speech] Error:", e.error);
      // no-speech and aborted are normal — auto-restart via onend
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        wantsListeningRef.current = false;
        setIsListening(false);
        recognitionRef.current = null;
      }
      // For no-speech, do nothing — onend will auto-restart
    };

    recognition.onend = () => {
      console.log("[Speech] onend, wantsListening:", wantsListeningRef.current, "transcript:", finalTranscript);
      if (wantsListeningRef.current) {
        // Auto-restart — browser killed recognition due to silence
        console.log("[Speech] Auto-restarting...");
        try {
          recognition.start();
        } catch (err) {
          console.error("[Speech] Auto-restart failed:", err);
          wantsListeningRef.current = false;
          setIsListening(false);
          recognitionRef.current = null;
        }
      } else {
        setIsListening(false);
        recognitionRef.current = null;
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
      console.log("[Speech] Started listening (continuous + interimResults)");
    } catch (err) {
      console.error("[Speech] Failed to start:", err);
      wantsListeningRef.current = false;
      setIsListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    wantsListeningRef.current = false;
    const recognition = recognitionRef.current;
    if (recognition) {
      // Grab the final transcript before stopping
      try { recognition.stop(); } catch {}
    }
    // The onresult should have accumulated finalTranscript
    // We need to send it via a different mechanism since finalTranscript is local to start()
    // Solution: use a ref
    setIsListening(false);
  }, []);

  // Use a ref-based approach to extract transcript on stop
  const startWithTranscript = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("[Speech] SpeechRecognition not supported");
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }

    wantsListeningRef.current = true;
    const transcriptRef = { value: "" };

    const recognition = new SpeechRecognition();
    recognition.lang = "pl-PL";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          transcriptRef.value += (transcriptRef.value ? " " : "") + transcript;
          console.log("[Speech] Final chunk:", transcript);
        } else {
          console.log("[Speech] Interim:", transcript);
        }
      }
    };

    recognition.onerror = (e: any) => {
      console.warn("[Speech] Error:", e.error);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        wantsListeningRef.current = false;
        setIsListening(false);
        recognitionRef.current = null;
      }
    };

    recognition.onend = () => {
      console.log("[Speech] onend, wantsListening:", wantsListeningRef.current);
      if (wantsListeningRef.current) {
        console.log("[Speech] Auto-restarting after silence...");
        try { recognition.start(); } catch {
          wantsListeningRef.current = false;
          setIsListening(false);
        }
      } else {
        // Stopped by user — send accumulated transcript
        if (transcriptRef.value.trim()) {
          console.log("[Speech] Sending transcript:", transcriptRef.value.trim());
          onResultRef.current(transcriptRef.value.trim());
        }
        setIsListening(false);
        recognitionRef.current = null;
      }
    };

    (recognition as any).__transcriptRef = transcriptRef;
    recognitionRef.current = recognition;
    
    try {
      recognition.start();
      setIsListening(true);
      console.log("[Speech] Started listening (continuous + interim)");
    } catch (err) {
      console.error("[Speech] Failed to start:", err);
      wantsListeningRef.current = false;
      setIsListening(false);
    }
  }, []);

  const stopAndSend = useCallback(() => {
    wantsListeningRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      // onend handler will send the transcript and clean up
    } else {
      setIsListening(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isListening) stopAndSend(); else startWithTranscript();
  }, [isListening, startWithTranscript, stopAndSend]);

  const supported =
    typeof window !== "undefined" &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  return { isListening, toggle, start: startWithTranscript, stop: stopAndSend, supported };
}
