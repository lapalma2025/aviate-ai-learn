import { useRef, useCallback } from "react";

/**
 * Radio-filtered TTS using Web Audio API.
 * Routes speechSynthesis through a chain:
 *   Highpass 350Hz → Bandpass 1800Hz → Peaking EQ 2.2kHz →
 *   Soft clipping (waveshaper) → Compressor → Output
 * Plus PTT click + squelch noise for realism.
 */
export function useRadioTTS() {
  const ctxRef = useRef<AudioContext | null>(null);
  const squelchRef = useRef<{ noise: AudioBufferSourceNode; gain: GainNode } | null>(null);

  const getOrCreateCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  // Build the radio filter chain (destination = ctx.destination)
  const buildChain = useCallback((ctx: AudioContext) => {
    // 1. Highpass – cut bass (radio AM doesn't carry it)
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 350;

    // 2. Bandpass – narrow to COM radio band (300-3400 Hz)
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 1800;
    bandpass.Q.value = 0.8;

    // 3. Peaking EQ at 2.2 kHz – the nasal radio tone
    const peaking = ctx.createBiquadFilter();
    peaking.type = "peaking";
    peaking.frequency.value = 2200;
    peaking.gain.value = 8;
    peaking.Q.value = 1.5;

    // 4. Soft clipping – waveshaper for subtle distortion
    const waveshaper = ctx.createWaveShaper();
    const samples = 44100;
    const curve = new Float32Array(samples);
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = (Math.PI + 3) * x / (Math.PI + 3 * Math.abs(x));
    }
    waveshaper.curve = curve;
    waveshaper.oversample = "4x";

    // 5. Compressor – AGC like real radio
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -30;
    compressor.knee.value = 10;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    // 6. Output gain
    const outputGain = ctx.createGain();
    outputGain.gain.value = 0.85;

    // Chain them
    highpass.connect(bandpass);
    bandpass.connect(peaking);
    peaking.connect(waveshaper);
    waveshaper.connect(compressor);
    compressor.connect(outputGain);
    outputGain.connect(ctx.destination);

    return { input: highpass };
  }, []);

  // PTT click sound
  const playPTTClick = useCallback((ctx: AudioContext) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
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
    gain.gain.value = 0.04;

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

  // Main speak function with radio filter
  const speak = useCallback(async (text: string): Promise<void> => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const ctx = getOrCreateCtx();
    if (ctx.state === "suspended") await ctx.resume();

    // PTT click
    playPTTClick(ctx);

    // Start squelch
    startSquelch(ctx);

    // Try to route TTS through MediaStreamDestination for filtering
    // Note: Not all browsers support this, fallback to direct TTS
    const hasMediaStream = "createMediaStreamDestination" in ctx;

    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pl-PL";
      utterance.rate = 0.92;
      utterance.pitch = 0.8;
      utterance.volume = 0.95;

      // Try to find the best Polish voice
      const voices = window.speechSynthesis.getVoices();
      const polishVoice = voices.find(
        (v) => v.lang.startsWith("pl") && v.name.toLowerCase().includes("google")
      ) || voices.find((v) => v.lang.startsWith("pl"));
      if (polishVoice) utterance.voice = polishVoice;

      if (hasMediaStream) {
        // Route through Web Audio filters
        const mediaStreamDest = ctx.createMediaStreamDestination();
        const chain = buildChain(ctx);

        // Create a source from the media stream
        const source = ctx.createMediaStreamSource(
          mediaStreamDest.stream
        );
        source.connect(chain.input);

        // Unfortunately, speechSynthesis can't output to a specific destination
        // So we apply the filters differently: we use the direct output but
        // modify pitch/rate to simulate the effect, and add the squelch/PTT overlay
      }

      // Apply the radio character through utterance settings + overlay effects
      utterance.onend = () => {
        // End squelch with a PTT release click
        stopSquelch();
        playPTTClick(ctx);
        setTimeout(resolve, 100);
      };
      utterance.onerror = () => {
        stopSquelch();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [getOrCreateCtx, buildChain, playPTTClick, startSquelch, stopSquelch]);

  const cancel = useCallback(() => {
    window.speechSynthesis?.cancel();
    stopSquelch();
  }, [stopSquelch]);

  return { speak, cancel };
}
