// Timer alarm: a repeating Web Audio chime plus vibration where supported.
// iOS only lets audio start from a user gesture, so call unlockAudio() from the
// tap that starts a timer; the chime can then play when it reaches zero.

let ctx: AudioContext | null = null;
let loop: ReturnType<typeof setInterval> | null = null;

type AudioSessionNavigator = Navigator & { audioSession?: { type: string } };

export function unlockAudio() {
  try {
    // Safari 17+: play through the ringer/mute switch like an alarm would
    const session = (navigator as AudioSessionNavigator).audioSession;
    if (session) session.type = "playback";

    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    // A silent buffer fully unlocks output on older iOS versions
    const source = ctx.createBufferSource();
    source.buffer = ctx.createBuffer(1, 1, 22050);
    source.connect(ctx.destination);
    source.start();
  } catch {
    // no Web Audio, the visual alert still shows
  }
}

function chime() {
  if (!ctx) return;
  const start = ctx.currentTime + 0.02;
  [880, 1175, 1568].forEach((freq, i) => {
    const t = start + i * 0.18;
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    osc.connect(gain).connect(ctx!.destination);
    osc.start(t);
    osc.stop(t + 0.65);
  });
}

function vibrate(pattern: number[]) {
  // Not available on iOS Safari
  if ("vibrate" in navigator) navigator.vibrate(pattern);
}

export function startAlarm() {
  if (loop) return;
  if (ctx?.state === "suspended") void ctx.resume();
  const ring = () => {
    chime();
    vibrate([300, 150, 300]);
  };
  ring();
  loop = setInterval(ring, 2000);
}

export function stopAlarm() {
  if (!loop) return;
  clearInterval(loop);
  loop = null;
  vibrate([]);
}
