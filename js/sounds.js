/**
 * Losownik.pl - Sound Effects Module v2
 * Realistic procedural audio using Web Audio API
 */
(function() {
    'use strict';
    const STORAGE_KEY = 'losownik_sound';
    let isMuted = localStorage.getItem(STORAGE_KEY) === 'off';
    let audioCtx = null;

    function getCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }

    // Helper: create noise buffer
    function createNoise(ctx, duration, type) {
        const len = ctx.sampleRate * duration;
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) {
            if (type === 'pink') {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 0.3);
            } else {
                data[i] = Math.random() * 2 - 1;
            }
        }
        return buf;
    }

    // ========== COIN: Metallic clink/ring ==========
    function playCoinSound() {
        if (isMuted) return;
        const ctx = getCtx(); const t = ctx.currentTime;

        // Main metallic ring (fundamental + overtones)
        const freqs = [3200, 5400, 7600, 9800];
        const gains = [0.08, 0.05, 0.03, 0.02];
        const decays = [0.6, 0.4, 0.25, 0.15];

        freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.98, t + decays[i]);
            gain.gain.setValueAtTime(gains[i], t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + decays[i]);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(t); osc.stop(t + decays[i]);
        });

        // Impact transient (short click)
        const nBuf = createNoise(ctx, 0.008, 'white');
        const nSrc = ctx.createBufferSource(); nSrc.buffer = nBuf;
        const nGain = ctx.createGain();
        const nFilter = ctx.createBiquadFilter();
        nFilter.type = 'highpass'; nFilter.frequency.value = 4000;
        nGain.gain.setValueAtTime(0.15, t);
        nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
        nSrc.connect(nFilter); nFilter.connect(nGain); nGain.connect(ctx.destination);
        nSrc.start(t); nSrc.stop(t + 0.015);

        // Second bounce (quieter, delayed)
        setTimeout(() => {
            const t2 = ctx.currentTime;
            const osc2 = ctx.createOscillator();
            const g2 = ctx.createGain();
            osc2.type = 'sine'; osc2.frequency.value = 2800;
            g2.gain.setValueAtTime(0.03, t2);
            g2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.2);
            osc2.connect(g2); g2.connect(ctx.destination);
            osc2.start(t2); osc2.stop(t2 + 0.2);
        }, 180);
    }

    // ========== CARD: Shuffle/riffle sound ==========
    function playCardSound() {
        if (isMuted) return;
        const ctx = getCtx(); const t = ctx.currentTime;

        for (let i = 0; i < 8; i++) {
            const delay = i * 0.025 + Math.random() * 0.01;
            const buf = createNoise(ctx, 0.02 + Math.random() * 0.015, 'white');
            const src = ctx.createBufferSource(); src.buffer = buf;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass'; filter.frequency.value = 2500 + Math.random() * 3000; filter.Q.value = 1.5;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.12 + Math.random() * 0.06, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.03);
            src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
            src.start(t + delay); src.stop(t + delay + 0.04);
        }
    }

    // ========== WHEEL TICK: Clicking during spin ==========
    function playWheelTick() {
        if (isMuted) return;
        const ctx = getCtx(); const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square'; osc.frequency.value = 800 + Math.random() * 200;
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.015);
    }

    // ========== APPLAUSE: Short crowd clapping ==========
    function playApplauseSound() {
        if (isMuted) return;
        const ctx = getCtx(); const t = ctx.currentTime;
        const duration = 1.2;
        const buf = createNoise(ctx, duration, 'white');
        const src = ctx.createBufferSource(); src.buffer = buf;

        // Shape like applause envelope: ramp up, sustain, ramp down
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.1);
        gain.gain.setValueAtTime(0.12, t + 0.4);
        gain.gain.linearRampToValueAtTime(0.08, t + 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        // Filter to sound like clapping (mid-high frequencies)
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1200;
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 8000;

        // Modulate with LFO for "clap" texture
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'square'; lfo.frequency.value = 12;
        lfoGain.gain.value = 0.04;
        lfo.connect(lfoGain); lfoGain.connect(gain.gain);

        src.connect(hp); hp.connect(lp); lp.connect(gain); gain.connect(ctx.destination);
        lfo.start(t); lfo.stop(t + duration);
        src.start(t); src.stop(t + duration);
    }

    // ========== CROWD CHEER: Short goal celebration ==========
    function playCrowdCheer() {
        if (isMuted) return;
        const ctx = getCtx(); const t = ctx.currentTime;
        const duration = 1.5;

        // Layer 1: Crowd roar (filtered noise, rising then falling)
        const buf1 = createNoise(ctx, duration, 'pink');
        const src1 = ctx.createBufferSource(); src1.buffer = buf1;
        const g1 = ctx.createGain();
        g1.gain.setValueAtTime(0, t);
        g1.gain.linearRampToValueAtTime(0.15, t + 0.15);
        g1.gain.setValueAtTime(0.15, t + 0.5);
        g1.gain.linearRampToValueAtTime(0.1, t + 0.9);
        g1.gain.exponentialRampToValueAtTime(0.001, t + duration);
        const bp1 = ctx.createBiquadFilter(); bp1.type = 'bandpass'; bp1.frequency.value = 600; bp1.Q.value = 0.8;
        src1.connect(bp1); bp1.connect(g1); g1.connect(ctx.destination);
        src1.start(t); src1.stop(t + duration);

        // Layer 2: Higher pitched excitement
        const buf2 = createNoise(ctx, duration * 0.8, 'white');
        const src2 = ctx.createBufferSource(); src2.buffer = buf2;
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0, t);
        g2.gain.linearRampToValueAtTime(0.06, t + 0.1);
        g2.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.8);
        const bp2 = ctx.createBiquadFilter(); bp2.type = 'bandpass'; bp2.frequency.value = 2000; bp2.Q.value = 1;
        src2.connect(bp2); bp2.connect(g2); g2.connect(ctx.destination);
        src2.start(t); src2.stop(t + duration * 0.8);

        // Layer 3: Low rumble (stadium bass)
        const osc = ctx.createOscillator();
        const g3 = ctx.createGain();
        osc.type = 'sawtooth'; osc.frequency.value = 80;
        g3.gain.setValueAtTime(0, t);
        g3.gain.linearRampToValueAtTime(0.04, t + 0.2);
        g3.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
        osc.connect(g3); g3.connect(ctx.destination);
        osc.start(t); osc.stop(t + 1.0);
    }

    // ========== LOTTO: Plastic balls bouncing in machine ==========
    function playLottoBallsSound() {
        if (isMuted) return;
        const ctx = getCtx(); const t = ctx.currentTime;

        // Multiple ball impacts with resonance
        for (let i = 0; i < 12; i++) {
            const delay = i * 0.06 + Math.random() * 0.03;
            const freq = 400 + Math.random() * 600;

            // Ball impact: short sine with pitch drop
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + delay);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + delay + 0.06);
            gain.gain.setValueAtTime(0.06 + Math.random() * 0.04, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.08);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(t + delay); osc.stop(t + delay + 0.08);

            // Plastic click component
            const nbuf = createNoise(ctx, 0.005, 'white');
            const nsrc = ctx.createBufferSource(); nsrc.buffer = nbuf;
            const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 3000 + Math.random() * 2000; nf.Q.value = 3;
            const ng = ctx.createGain(); ng.gain.setValueAtTime(0.08, t + delay); ng.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.01);
            nsrc.connect(nf); nf.connect(ng); ng.connect(ctx.destination);
            nsrc.start(t + delay); nsrc.stop(t + delay + 0.015);
        }

        // Machine hum underneath
        const hum = ctx.createOscillator();
        const humGain = ctx.createGain();
        hum.type = 'sine'; hum.frequency.value = 120;
        humGain.gain.setValueAtTime(0.015, t);
        humGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
        hum.connect(humGain); humGain.connect(ctx.destination);
        hum.start(t); hum.stop(t + 0.8);
    }

    // ========== DICE: Rolling on table ==========
    function playDiceSound() {
        if (isMuted) return;
        const ctx = getCtx(); const t = ctx.currentTime;

        for (let i = 0; i < 5; i++) {
            const delay = i * 0.08 + Math.random() * 0.03;
            const freq = 250 + Math.random() * 300;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + delay);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + delay + 0.04);
            gain.gain.setValueAtTime(0.06, t + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.05);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(t + delay); osc.stop(t + delay + 0.06);

            // Table tap
            const nb = createNoise(ctx, 0.006, 'white');
            const ns = ctx.createBufferSource(); ns.buffer = nb;
            const ng = ctx.createGain(); ng.gain.setValueAtTime(0.05, t + delay); ng.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.01);
            ns.connect(ng); ng.connect(ctx.destination);
            ns.start(t + delay); ns.stop(t + delay + 0.012);
        }
    }

    // ========== MUTE BUTTON ==========
    function createMuteButton() {
        const btn = document.createElement('button');
        btn.id = 'soundToggle'; btn.className = 'sound-toggle';
        btn.setAttribute('aria-label', 'Dźwięk wł/wył');
        btn.innerHTML = isMuted ? '&#128263;' : '&#128266;';
        btn.title = isMuted ? 'Dźwięk wyłączony' : 'Dźwięk włączony';
        btn.addEventListener('click', () => {
            isMuted = !isMuted;
            localStorage.setItem(STORAGE_KEY, isMuted ? 'off' : 'on');
            btn.innerHTML = isMuted ? '&#128263;' : '&#128266;';
            btn.title = isMuted ? 'Dźwięk wyłączony' : 'Dźwięk włączony';
            btn.classList.toggle('muted', isMuted);
        });
        if (isMuted) btn.classList.add('muted');
        document.body.appendChild(btn);
    }

    function addStyles() {
        const s = document.createElement('style');
        s.textContent = `.sound-toggle{position:fixed;bottom:80px;right:20px;width:52px;height:52px;border-radius:50%;border:2px solid rgba(123,47,247,0.4);background:rgba(26,26,62,0.95);color:#00f5d4;font-size:1.5rem;cursor:pointer;z-index:999;display:flex;align-items:center;justify-content:center;transition:all .3s;backdrop-filter:blur(8px);box-shadow:0 4px 16px rgba(0,0,0,0.3)}.sound-toggle:hover{transform:scale(1.1);border-color:#00f5d4;box-shadow:0 0 20px rgba(0,245,212,0.3)}.sound-toggle.muted{color:#a0a0c0;border-color:rgba(160,160,192,0.3)}@media(max-width:768px){.sound-toggle{bottom:76px;right:14px;width:48px;height:48px;font-size:1.3rem}}`;
        document.head.appendChild(s);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { addStyles(); createMuteButton(); });
    } else { addStyles(); createMuteButton(); }

    window.losownikSounds = {
        coin: playCoinSound,
        card: playCardSound,
        wheelTick: playWheelTick,
        applause: playApplauseSound,
        crowdCheer: playCrowdCheer,
        lottoBalls: playLottoBallsSound,
        dice: playDiceSound,
        isMuted: () => isMuted
    };
})();
