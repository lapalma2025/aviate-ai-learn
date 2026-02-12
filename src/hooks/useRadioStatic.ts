import { useState, useEffect, useRef, useCallback } from "react";

export function useRadioStatic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const ensureContext = useCallback(() => {
    if (ctxRef.current && ctxRef.current.state !== "closed") return;

    const ctx = new AudioContext();
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
    gain.gain.value = 0; // start muted

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    ctxRef.current = ctx;
    gainRef.current = gain;
  }, []);

  const start = useCallback(() => {
    ensureContext();
    if (gainRef.current) {
      gainRef.current.gain.value = 0.03;
    }
    if (ctxRef.current?.state === "suspended") {
      ctxRef.current.resume();
    }
    setIsPlaying(true);
  }, [ensureContext]);

  const stop = useCallback(() => {
    // Mute instead of closing — prevents AudioContext closure from killing the mic
    if (gainRef.current) {
      gainRef.current.gain.value = 0;
    }
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) stop();
    else start();
  }, [isPlaying, start, stop]);

  useEffect(() => () => {
    try { ctxRef.current?.close(); } catch {}
  }, []);

  return { isPlaying, toggle, start, stop };
}
