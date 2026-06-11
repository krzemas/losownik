/**
 * Losownik.pl - Sound Effects Module
 * Lightweight procedural audio using Web Audio API
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

    // Coin clink (metallic ring)
    function playCoinSound() {
        if (isMuted) return;
        const ctx = getCtx(); const t = ctx.currentTime;
        const osc1 = ctx.createOscillator(); const gain1 = ctx.createGain();
        osc1.type = 'sine'; osc1.frequency.setValueAtTime(2200, t);
        osc1.frequency.exponentialRampToValueAtTime(1800, t + 0.15);
        gain1.gain.setValueAtTime(0.12, t); gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc1.connect(gain1); gain1.connect(ctx.destination); osc1.start(t); osc1.stop(t + 0.4);
        const osc2 = ctx.createOscillator(); const gain2 = ctx.createGain();
        osc2.type = 'sine'; osc2.frequency.setValueAtTime(4400, t);
        osc2.frequency.exponentialRampToValueAtTime(3600, t + 0.1);
        gain2.gain.setValueAtTime(0.06, t); gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc2.connect(gain2); gain2.connect(ctx.destination); osc2.start(t); osc2.stop(t + 0.25);
        setTimeout(() => {
            const osc3 = ctx.createOscillator(); const gain3 = ctx.createGain();
            osc3.type = 'sine'; osc3.frequency.setValueAtTime(1600, ctx.currentTime);
            osc3.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
            gain3.gain.setValueAtTime(0.08, ctx.currentTime); gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc3.connect(gain3); gain3.connect(ctx.destination); osc3.start(ctx.currentTime); osc3.stop(ctx.currentTime + 0.15);
        }, 200);
    }

    // Card shuffle (white noise bursts)
    function playCardSound() {
        if (isMuted) return;
        const ctx = getCtx();
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const bufferSize = ctx.sampleRate * 0.04;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let j = 0; j < bufferSize; j++) data[j] = (Math.random() * 2 - 1) * 0.3;
                const noise = ctx.createBufferSource(); noise.buffer = buffer;
                const filter = ctx.createBiquadFilter(); filter.type = 'bandpass';
                filter.frequency.value = 3000 + Math.random() * 2000; filter.Q.value = 2;
                const gain = ctx.createGain(); gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
                noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
                noise.start(ctx.currentTime); noise.stop(ctx.currentTime + 0.05);
            }, i * 50);
        }
    }

    // Short applause
    function playApplauseSound() {
        if (isMuted) return;
        const ctx = getCtx();
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const bufferSize = ctx.sampleRate * 0.02;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let j = 0; j < bufferSize; j++) data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.3));
                const noise = ctx.createBufferSource(); noise.buffer = buffer;
                const filter = ctx.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.value = 800 + Math.random() * 1500;
                const gain = ctx.createGain(); gain.gain.value = 0.04 + Math.random() * 0.06;
                noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination); noise.start(ctx.currentTime);
            }, i * (40 + Math.random() * 60));
        }
    }

    // Lotto balls (bouncing plastic)
    function playLottoBallsSound() {
        if (isMuted) return;
        const ctx = getCtx();
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const osc = ctx.createOscillator(); const gain = ctx.createGain();
                const freq = 300 + Math.random() * 500;
                osc.type = 'sine'; osc.frequency.setValueAtTime(freq, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + 0.06);
                gain.gain.setValueAtTime(0.08, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
                osc.connect(gain); gain.connect(ctx.destination); osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.08);
            }, i * 70 + Math.random() * 30);
        }
    }

    // Dice roll
    function playDiceSound() {
        if (isMuted) return;
        const ctx = getCtx();
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                const osc = ctx.createOscillator(); const gain = ctx.createGain();
                osc.frequency.value = 180 + Math.random() * 350; osc.type = 'square';
                gain.gain.setValueAtTime(0.025, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
                osc.connect(gain); gain.connect(ctx.destination); osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.04);
            }, i * 70);
        }
    }

    // Mute button
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

    window.losownikSounds = { coin: playCoinSound, card: playCardSound, applause: playApplauseSound, lottoBalls: playLottoBallsSound, dice: playDiceSound, isMuted: () => isMuted };
})();
