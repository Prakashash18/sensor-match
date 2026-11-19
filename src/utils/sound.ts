class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    delay = 0
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playCorrect(streak: number): void {
    const pitchBoost = Math.min(streak - 1, 5) * 35;
    this.playTone(523.25 + pitchBoost, 0.14, 'triangle', 0.14, 0);
    this.playTone(659.25 + pitchBoost, 0.18, 'triangle', 0.15, 0.08);
  }

  playWrong(): void {
    this.playTone(220, 0.16, 'sawtooth', 0.08, 0);
    this.playTone(175, 0.22, 'sawtooth', 0.08, 0.1);
  }

  playTap(): void {
    this.playTone(420, 0.06, 'sine', 0.07, 0);
  }

  playVictory(): void {
    this.playTone(523.25, 0.14, 'triangle', 0.13, 0);
    this.playTone(659.25, 0.14, 'triangle', 0.13, 0.09);
    this.playTone(783.99, 0.16, 'triangle', 0.13, 0.18);
    this.playTone(1046.5, 0.3, 'triangle', 0.15, 0.27);
  }
}

export const soundEngine = new SoundEngine();
