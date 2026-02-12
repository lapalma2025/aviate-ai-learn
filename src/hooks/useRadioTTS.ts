import { useRef, useCallback } from "react";

/**
 * Radio-filtered TTS using Web Audio API.
 * Routes speechSynthesis voice settings + squelch overlay
 * to simulate aviation COM radio sound.
 * 
 * No PTT clicks — just squelch noise overlay during speech
 * with radio-like voice characteristics via utterance tuning.
 */
export function useRadioTTS() {
  const ctxRef = useRef<AudioContext | null>(null);
  const squelchRef = useRef<{ noise: AudioBufferSourceNode; gain: GainNode } | null>(null);
  const voicesLoaded = useRef(false);

  // Preload voices on mount
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const loadVoices = () => { 
      window.speechSynthesis.getVoices(); 
      voicesLoaded.current = true;
    };
    if (window.speechSynthesis.getVoices().length) {
      voicesLoaded.current = true;
    } else {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices, { once: true });
    }
  }

  const getOrCreateCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  // Squelch noise (background static while ATC speaks)
  const startSquelch = useCallback((ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 0.025;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    squelchRef.current = { noise, gain };
  }, []);

  const stopSquelch = useCallback(() => {
    if (squelchRef.current) {
      try {
        squelchRef.current.noise.stop();
      } catch {}
      squelchRef.current = null;
    }
  }, []);

  // Main speak function with radio-style voice
  const speak = useCallback(async (text: string): Promise<void> => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const ctx = getOrCreateCtx();
    if (ctx.state === "suspended") await ctx.resume();

    // Start squelch overlay
    startSquelch(ctx);

    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pl-PL";
      utterance.rate = 0.95;
      utterance.pitch = 0.75;
      utterance.volume = 0.9;

      // Pick best Polish voice: Google > Microsoft > any
      const voices = window.speechSynthesis.getVoices();
      const googlePl = voices.find(
        (v) => v.lang.startsWith("pl") && v.name.toLowerCase().includes("google")
      );
      const msPl = voices.find(
        (v) => v.lang.startsWith("pl") && v.name.toLowerCase().includes("microsoft")
      );
      const anyPl = voices.find((v) => v.lang.startsWith("pl"));
      const chosenVoice = googlePl || msPl || anyPl;
      if (chosenVoice) utterance.voice = chosenVoice;

      utterance.onend = () => {
        stopSquelch();
        setTimeout(resolve, 80);
      };
      utterance.onerror = () => {
        stopSquelch();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [getOrCreateCtx, startSquelch, stopSquelch]);

  const cancel = useCallback(() => {
    window.speechSynthesis?.cancel();
    stopSquelch();
  }, [stopSquelch]);

  return { speak, cancel };
}
