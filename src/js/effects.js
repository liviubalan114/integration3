// ================================================
// SIGNATURE EFFECTS
// - colorSplash: paint burst used across the page
// - initPukpukReveal: "Walter unlocked" reveal
// - initNoMoreHiding: redacted text torn away by Walter
// - initNewYou: pinned, scroll-driven costume runway
// ================================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const PALETTE = ['#FFE100', '#16E3FE', '#D32227', '#6C3CD6', '#FF6B35'];

const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Irregular ink-splat outline inside a 200x200 viewBox
export const splatPath = (points = 16, jag = 0.5) => {
    const pts = [];
    for (let i = 0; i < points; i++) {
        const a = (i / points) * Math.PI * 2 + gsap.utils.random(-0.12, 0.12);
        const r = i % 2
            ? gsap.utils.random(80 * (1 - jag), 70)
            : gsap.utils.random(78, 98);
        pts.push([100 + Math.cos(a) * r, 100 + Math.sin(a) * r]);
    }
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const f = (n) => n.toFixed(1);
    let d = `M${mid(pts[pts.length - 1], pts[0]).map(f).join(' ')}`;
    pts.forEach((p, i) => {
        const m = mid(p, pts[(i + 1) % pts.length]);
        d += ` Q${f(p[0])} ${f(p[1])} ${f(m[0])} ${f(m[1])}`;
    });
    return `${d} Z`;
};

const splatSvg = (color, size) =>
    `<svg viewBox="0 0 200 200" width="${size}" height="${size}" aria-hidden="true" focusable="false"><path d="${splatPath()}" fill="${color}"/></svg>`;

/**
 * Paint burst at (x, y) in container coordinates.
 * The container must be positioned (relative/absolute).
 */
export const colorSplash = (container, x, y, {
    count = 24,
    scale = 1,
    colors = PALETTE,
    blob = true,
    zIndex = 50
} = {}) => {
    if (!container || prefersReducedMotion()) return;

    const layer = document.createElement('div');
    layer.className = 'fx-splash';
    layer.style.cssText = `left:${x}px;top:${y}px;z-index:${zIndex};`;
    container.appendChild(layer);

    const tl = gsap.timeline({ onComplete: () => layer.remove() });

    if (blob) {
        const size = 200 * scale;
        const wrap = document.createElement('div');
        wrap.className = 'fx-splash__blob';
        wrap.style.cssText = `width:${size}px;height:${size}px;margin:${-size / 2}px 0 0 ${-size / 2}px;`;
        wrap.innerHTML = splatSvg(pick(colors), size);
        layer.appendChild(wrap);
        tl.fromTo(wrap,
            { scale: 0, rotation: gsap.utils.random(-120, 120), opacity: 0.95 },
            { scale: 1, rotation: '+=40', duration: 0.45, ease: 'back.out(2)' }, 0)
            .to(wrap, { scale: 1.2, opacity: 0, duration: 0.7, ease: 'power2.in' }, 0.5);
    }

    const ring = document.createElement('div');
    ring.className = 'fx-splash__ring';
    const ringSize = 44 * scale;
    ring.style.cssText = `width:${ringSize}px;height:${ringSize}px;margin:${-ringSize / 2}px 0 0 ${-ringSize / 2}px;border-color:${pick(colors)};`;
    layer.appendChild(ring);
    tl.fromTo(ring, { scale: 0, opacity: 1 }, { scale: 6, opacity: 0, duration: 0.9, ease: 'power2.out' }, 0);

    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        const s = gsap.utils.random(5, 16) * scale;
        const confetti = Math.random() < 0.35;
        dot.className = 'fx-splash__dot';
        dot.style.cssText = `width:${s}px;height:${confetti ? s * 0.45 : s}px;margin:${-s / 2}px 0 0 ${-s / 2}px;background:${pick(colors)};border-radius:${confetti ? '2px' : '50%'};`;
        layer.appendChild(dot);

        const angle = Math.random() * Math.PI * 2;
        const dist = gsap.utils.random(60, 190) * scale;
        const t = gsap.utils.random(0.45, 0.75);
        tl.fromTo(dot,
            { x: 0, y: 0, scale: 0, rotation: 0 },
            {
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                scale: 1,
                rotation: gsap.utils.random(-180, 180),
                duration: t,
                ease: 'power3.out'
            }, 0)
            .to(dot, {
                y: `+=${gsap.utils.random(30, 90) * scale}`,
                opacity: 0,
                scale: 0.3,
                duration: gsap.utils.random(0.5, 0.9),
                ease: 'power1.in'
            }, t * 0.8);
    }
    return tl;
};

// Center of an element relative to a positioned container
const centerIn = (el, container) => {
    const r = el.getBoundingClientRect();
    const c = container.getBoundingClientRect();
    return { x: r.left - c.left + r.width / 2, y: r.top - c.top + r.height / 2 };
};

// ================================================
// WALTER UNLOCKED (PUKPUK SECTION)
// ================================================
export const initPukpukReveal = () => {
    const section = document.getElementById('pukpukSection');
    if (!section) return null;

    const q = (s) => section.querySelector(s);
    const title = q('.pukpuk__title');
    const figure = q('.pukpuk__figure');
    const card = q('.pukpuk__card');
    const blue = q('.pukpuk__shape--blue');
    const yellow = q('.pukpuk__shape--yellow');
    const desc = q('.pukpuk__description');
    const subtitle = q('.pukpuk__subtitle');
    const marks = gsap.utils.toArray('.pukpuk__tag-mark', section);
    const tagTexts = gsap.utils.toArray('.pukpuk__tag-text, .pukpuk__tag-index', section);
    const animated = [section, title, figure, card, blue, yellow, desc, subtitle, ...marks, ...tagTexts];

    let unlocked = false;
    let played = false;
    let tl = null;
    let idle = [];
    let splits = [];

    const reset = () => {
        if (tl) tl.kill();
        tl = null;
        idle.forEach((t) => t.kill());
        idle = [];
        splits.forEach((s) => s.revert());
        splits = [];
        gsap.set(animated, { clearProps: 'all' });
    };

    // Hide everything that is about to be revealed (prevents a flash of
    // the final state before the timeline plays)
    const prepare = () => {
        gsap.set(section, { filter: 'grayscale(1)', opacity: 0.5 });
        gsap.set([title, desc, subtitle, ...tagTexts], { autoAlpha: 0 });
        gsap.set(marks, { scaleX: 0 });
        gsap.set([blue, yellow], { scaleX: 0 });
        gsap.set([figure, card], { autoAlpha: 0 });
    };

    const play = () => {
        played = true;
        if (prefersReducedMotion()) {
            reset();
            return;
        }

        const titleSplit = SplitText.create(title, { type: 'chars,words' });
        const descSplit = SplitText.create(desc, { type: 'lines', mask: 'lines' });
        const subSplit = SplitText.create(subtitle, { type: 'chars,words' });
        splits = [titleSplit, descSplit, subSplit];
        gsap.set([title, desc, subtitle], { autoAlpha: 1 });

        tl = gsap.timeline({
            defaults: { overwrite: 'auto' },
            onComplete: () => {
                splits.forEach((s) => s.revert());
                splits = [];
                gsap.set(section, { clearProps: 'filter,opacity' });
                // Living idle motion once revealed
                idle = [
                    gsap.to(card, { rotation: 22, y: -8, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
                    gsap.to(figure, { y: -10, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
                ];
            }
        });

        // 1. Colour floods back in, with a saturation overshoot
        tl.to(section, { filter: 'grayscale(0) saturate(1.8)', opacity: 1, duration: 0.7, ease: 'power2.out' }, 0)
            .to(section, { filter: 'grayscale(0) saturate(1)', duration: 0.9, ease: 'power1.inOut' }, 0.7)
            .call(() => {
                const c = centerIn(figure, section);
                colorSplash(section, c.x, c.y, { count: 44, scale: 2.2, zIndex: 1 });
            }, null, 0.05)

            // 2. Beams shoot across
            .fromTo(blue, { scaleX: 0, transformOrigin: '0% 50%' },
                { scaleX: 1, duration: 0.7, ease: 'expo.out' }, 0.1)

            // 3. Figure springs up from the ground
            .fromTo(figure, { autoAlpha: 0, y: 160, scaleY: 0.6, scaleX: 1.2, transformOrigin: '50% 100%' },
                { autoAlpha: 1, y: 0, scaleY: 1, scaleX: 1, duration: 1.2, ease: 'elastic.out(1, 0.55)' }, 0.15)

            // 4. Title letters tumble in, flashing brand colours
            .from(titleSplit.chars, {
                yPercent: 130,
                rotation: () => gsap.utils.random(-45, 45),
                scale: 0.3,
                autoAlpha: 0,
                color: () => pick(PALETTE),
                duration: 0.9,
                ease: 'back.out(2.2)',
                stagger: { each: 0.035, from: 'random' }
            }, 0.25)

            // 5. The sketch card spins in and lands at its tilt
            .fromTo(card, { autoAlpha: 0, scale: 0, rotation: -200 },
                { autoAlpha: 1, scale: 1, rotation: 17, duration: 1, ease: 'back.out(1.8)' }, 0.55)

            // 6. Description rises line by line
            .from(descSplit.lines, { yPercent: 110, duration: 0.8, ease: 'power4.out', stagger: 0.09 }, 0.8)

            // 7. Subtitle types in
            .from(subSplit.chars, { autoAlpha: 0, y: 14, duration: 0.3, ease: 'power2.out', stagger: 0.012 }, 1.1)

            // 8. Marker swipes + tag words
            .to(marks, { scaleX: 1, duration: 0.55, ease: 'expo.out', stagger: 0.16 }, 1.35)
            .fromTo(tagTexts, { autoAlpha: 0, yPercent: 60 },
                { autoAlpha: 1, yPercent: 0, duration: 0.5, ease: 'back.out(2.5)', stagger: 0.08 }, 1.45)

            // 9. Yellow beam closes the composition
            .fromTo(yellow, { scaleX: 0, transformOrigin: '100% 50%' },
                { scaleX: 1, duration: 0.8, ease: 'expo.out' }, 1.5);
    };

    const inView = () => {
        const r = section.getBoundingClientRect();
        return r.top < window.innerHeight * 0.7 && r.bottom > window.innerHeight * 0.2;
    };

    const maybePlay = () => {
        if (unlocked && !played) play();
    };

    ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        end: 'bottom 20%',
        onEnter: maybePlay,
        onEnterBack: maybePlay
    });

    const setUnlocked = (value) => {
        if (value === unlocked) return;
        unlocked = value;
        played = false;
        reset();
        if (unlocked) {
            prepare();
            if (inView()) play();
        }
    };

    return { setUnlocked };
};

// ================================================
// NO MORE HIDING - REDACTED TEXT, WALTER TEARS IT OFF
// ================================================
// Used by "Ask Walter" (intro) and "What does he believe?" (No More Hiding)
const createRedactReveal = (wrap) => {
    const trigger = wrap ? wrap.querySelector('button[aria-controls]') : null;
    if (!wrap || !trigger) return;

    const head = trigger.querySelector('.walter-head');
    const paragraphs = gsap.utils.toArray('p', wrap);
    const mm = gsap.matchMedia();

    mm.add('(min-width: 64rem) and (prefers-reduced-motion: no-preference)', () => {
        let revealed = false;
        let splits = [];

        const addBars = () => {
            splits.forEach((s) => s.revert());
            splits = paragraphs.map((p, pi) => SplitText.create(p, {
                type: 'lines',
                autoSplit: true,
                linesClass: 'nmh-line',
                onSplit(self) {
                    if (revealed) return;
                    self.lines.forEach((line) => {
                        const bar = document.createElement('span');
                        bar.className = 'nmh-redact';
                        bar.style.transformOrigin = pi === 0 ? '0% 50%' : '100% 50%';
                        line.appendChild(bar);
                    });
                }
            }));
        };

        wrap.classList.add('is-redacted');
        addBars();

        const bob = gsap.to(head, { y: -10, rotation: 3, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });

        const burst = () => {
            const c = centerIn(head, wrap);
            colorSplash(wrap, c.x, c.y, { count: 40, scale: 1.7, zIndex: 0 });
        };

        const reveal = () => {
            const bars = gsap.utils.toArray('.nmh-redact', wrap);
            const left = bars.filter((b) => paragraphs[0].contains(b));
            const right = bars.filter((b) => paragraphs[1].contains(b));
            const lines = gsap.utils.toArray('.nmh-line', wrap);

            const tl = gsap.timeline({
                onComplete: () => {
                    bars.forEach((b) => b.remove());
                    splits.forEach((s) => s.revert());
                    splits = [];
                }
            });

            tl.to(head, { scale: 1.3, rotation: -12, duration: 0.14, ease: 'power2.out' })
                .to(head, { scale: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.35)' })
                .call(burst, null, 0.12)
                // bars flash through the palette ...
                .to(bars, {
                    backgroundColor: () => pick(PALETTE),
                    duration: 0.12,
                    stagger: { each: 0.03, from: 'start' }
                }, 0.15)
                // ... then tear away from Walter outwards
                .to(left, { scaleX: 0, duration: 0.55, ease: 'expo.inOut', stagger: 0.07 }, 0.4)
                .to(right, { scaleX: 0, duration: 0.55, ease: 'expo.inOut', stagger: 0.07 }, 0.4)
                .from(lines, { y: 10, duration: 0.6, ease: 'back.out(3)', stagger: 0.04 }, 0.55);
        };

        const onClick = () => {
            if (!revealed) {
                revealed = true;
                wrap.classList.remove('is-redacted');
                wrap.classList.add('is-revealed');
                trigger.setAttribute('aria-expanded', 'true');
                reveal();
            } else {
                // Encore: spin + splash
                gsap.fromTo(head, { rotationY: 0 }, { rotationY: 360, duration: 0.9, ease: 'power3.inOut' });
                burst();
            }
        };
        trigger.addEventListener('click', onClick);

        return () => {
            trigger.removeEventListener('click', onClick);
            bob.kill();
            splits.forEach((s) => s.revert());
            splits = [];
            wrap.querySelectorAll('.nmh-redact').forEach((b) => b.remove());
            wrap.classList.remove('is-redacted', 'is-revealed');
            gsap.set(head, { clearProps: 'all' });
        };
    });
};

export const initNoMoreHiding = () => {
    createRedactReveal(document.getElementById('identity-text'));
    createRedactReveal(document.getElementById('no-hiding-content'));
};

// ================================================
// THE NEW YOU - PINNED COSTUME RUNWAY
// ================================================
const COSTUME_COLORS = {
    red: '#D32227',
    yellow: '#FFE100',
    green: '#16E3FE',
    brown: '#6C3CD6',
    orange: '#FF6B35'
};

export const initNewYou = () => {
    const section = document.getElementById('newYouSection');
    const runway = document.getElementById('newYouRunway');
    if (!section || !runway) return;

    const container = runway.querySelector('.epilogue__scroll-container');
    const content = runway.querySelector('.epilogue__scroll-content');
    const items = gsap.utils.toArray('.epilogue__item', runway);
    const title = section.querySelector('.new-you__title');
    const marquee = runway.querySelector('.new-you__marquee');
    const bar = runway.querySelector('.new-you__progress-bar');
    const text = section.querySelector('.new-you__text');
    const message = section.querySelector('.new-you__message');
    const contentWrap = section.querySelector('.new-you__content');

    if (prefersReducedMotion()) return;

    // Paint splat behind every costume, in the costume's shadow colour
    items.forEach((item) => {
        const key = Object.keys(COSTUME_COLORS).find((k) => item.classList.contains(`epilogue__item--${k}`));
        const splat = document.createElement('div');
        splat.className = 'epilogue__splat';
        splat.innerHTML = splatSvg(COSTUME_COLORS[key] || pick(PALETTE), 200);
        item.prepend(splat);
    });

    // --- Title: letters drop and bounce, colour settles to purple
    const titleSplit = SplitText.create(title, { type: 'chars' });
    gsap.from(titleSplit.chars, {
        yPercent: -160,
        rotation: () => gsap.utils.random(-60, 60),
        color: () => pick(PALETTE),
        autoAlpha: 0,
        duration: 1,
        ease: 'bounce.out',
        stagger: { each: 0.05, from: 'random' },
        onComplete: () => gsap.set(titleSplit.chars, { clearProps: 'color' }),
        scrollTrigger: { trigger: runway, start: 'top 75%', toggleActions: 'play none none reverse' }
    });

    // --- Runway: vertical scroll drives the strip sideways
    runway.classList.add('is-runway');
    const distance = () => Math.max(0, content.scrollWidth - container.clientWidth);

    // Runway dressing in the site's own language: colour-spike spotlight
    // beams, a striped catwalk floor and palette-coloured camera flashes
    const beams = document.createElement('div');
    beams.className = 'new-you__beams';
    beams.setAttribute('aria-hidden', 'true');
    beams.innerHTML = ['yellow', 'cyan', 'purple'].map((c) => `<span class="new-you__beam new-you__beam--${c}"></span>`).join('');
    runway.prepend(beams);
    const beamEls = gsap.utils.toArray('.new-you__beam', beams);

    const floor = document.createElement('div');
    floor.className = 'new-you__floor';
    floor.setAttribute('aria-hidden', 'true');
    container.appendChild(floor);

    const wash = document.createElement('div');
    wash.className = 'new-you__flash';
    runway.appendChild(wash);

    // Spiky starburst polygon (like the site's spike shapes)
    const spikeSvg = (color) => {
        const n = gsap.utils.random(8, 12, 1);
        const pts = [];
        for (let i = 0; i < n * 2; i++) {
            const a = (i / (n * 2)) * Math.PI * 2;
            const r = i % 2 ? gsap.utils.random(14, 24) : gsap.utils.random(70, 100);
            pts.push(`${(100 + Math.cos(a) * r).toFixed(1)},${(100 + Math.sin(a) * r).toFixed(1)}`);
        }
        return `<svg viewBox="0 0 200 200" aria-hidden="true"><polygon points="${pts.join(' ')}" fill="${color}"/></svg>`;
    };

    let lastWash = 0;
    const flash = (x, y, size = 1) => {
        const f = document.createElement('div');
        const s = gsap.utils.random(60, 140) * size;
        const color = pick(PALETTE);
        f.className = 'paparazzi-flash';
        f.style.cssText = `left:${x}px;top:${y}px;width:${s}px;height:${s}px;margin:${-s / 2}px 0 0 ${-s / 2}px;`;
        f.innerHTML = spikeSvg(color);
        runway.appendChild(f);
        gsap.timeline({ onComplete: () => f.remove() })
            .fromTo(f, { scale: 0, autoAlpha: 1, rotation: gsap.utils.random(0, 45) },
                { scale: 1, duration: 0.07, ease: 'power4.out' })
            .to(f, { scale: 0.3, autoAlpha: 0, duration: 0.35, ease: 'power2.in' });
        // Full-frame wash is throttled (max ~2 per second) for photosensitivity
        const now = performance.now();
        if (now - lastWash > 450) {
            lastWash = now;
            gsap.fromTo(wash, { opacity: 0.16, backgroundColor: color }, { opacity: 0, duration: 0.45, ease: 'power2.out' });
        }
    };

    // A volley of camera flashes around a look as it hits the spotlight
    const volley = (item) => {
        const r = runway.getBoundingClientRect();
        const ir = item.getBoundingClientRect();
        const n = gsap.utils.random(3, 6, 1);
        for (let i = 0; i < n; i++) {
            gsap.delayedCall(i * gsap.utils.random(0.06, 0.15), () => {
                flash(
                    ir.left - r.left + gsap.utils.random(-0.6, 1.6) * ir.width,
                    ir.top - r.top + gsap.utils.random(-0.1, 0.8) * ir.height
                );
            });
        }
        const img = item.querySelector('img');
        gsap.fromTo(img, { filter: 'brightness(1.35) saturate(1.4)' },
            { filter: 'brightness(1) saturate(1)', duration: 0.6, ease: 'power2.out', delay: 0.05, clearProps: 'filter' });
    };

    const runwayTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
            trigger: runway,
            start: 'top top',
            end: () => `+=${Math.max(distance(), window.innerHeight * 0.6)}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => volley(items[0]),
            onUpdate: (self) => {
                // random stray flashes while the visitor scrolls fast
                if (Math.abs(self.getVelocity()) > 500 && Math.random() < 0.05) {
                    flash(gsap.utils.random(0, runway.clientWidth), gsap.utils.random(0, runway.clientHeight * 0.8), 0.7);
                }
            }
        }
    });
    runwayTl
        .to(content, { x: () => -distance(), duration: 1 }, 0)
        .fromTo(marquee, { xPercent: 0 }, { xPercent: -50, duration: 1 }, 0)
        .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
        // spotlight beams sweep, the catwalk stripes run under the feet
        .fromTo(beamEls, { rotation: (i) => [-16, 10, -6][i] }, { rotation: (i) => [12, -14, 16][i], duration: 1 }, 0)
        .fromTo(floor, { backgroundPosition: '0px 50%' }, { backgroundPosition: '-1400px 50%', duration: 1 }, 0);

    // Each costume struts in as it reaches the stage
    items.forEach((item) => {
        const img = item.querySelector('img');
        const splat = item.querySelector('.epilogue__splat');
        const st = {
            trigger: item,
            containerAnimation: runwayTl,
            start: 'left 95%',
            end: 'left 45%',
            scrub: true
        };
        gsap.fromTo(splat, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, ease: 'back.out(1.7)', scrollTrigger: st });
        gsap.fromTo(img, { y: 60, rotation: 8, scale: 0.85 }, { y: 0, rotation: 0, scale: 1, ease: 'power2.out', scrollTrigger: { ...st } });
        ScrollTrigger.create({
            trigger: item,
            containerAnimation: runwayTl,
            start: 'center 62%',
            onEnter: () => volley(item),
            onEnterBack: () => volley(item)
        });
    });

    // --- Body text: words light up as you read (scrubbed)
    const textSplit = SplitText.create(text, { type: 'words' });
    gsap.fromTo(textSplit.words, { opacity: 0.12 }, {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: text, start: 'top 85%', end: 'bottom 55%', scrub: true }
    });
    gsap.fromTo(text.querySelectorAll('strong'), { backgroundSize: '0% 38%' }, {
        backgroundSize: '100% 38%',
        stagger: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: text, start: 'top 70%', end: 'bottom 50%', scrub: true }
    });

    // --- "It's a message." slams down like a stamp
    gsap.timeline({ scrollTrigger: { trigger: message, start: 'top 80%', toggleActions: 'play none none reverse' } })
        .fromTo(message, { scale: 3, rotation: -25, autoAlpha: 0 },
            { scale: 1, rotation: -3, autoAlpha: 1, duration: 0.45, ease: 'expo.in' })
        .call(() => {
            const c = centerIn(message, contentWrap);
            colorSplash(contentWrap, c.x, c.y, { count: 30, scale: 1.3, zIndex: 0 });
        })
        .fromTo(contentWrap, { x: 0 }, { x: 6, duration: 0.05, repeat: 5, yoyo: true, ease: 'none', clearProps: 'x' });

};

// ================================================
// RIGHT ARTIFACT CHOSEN - CELEBRATION
// ================================================

// Confetti falling through a positioned container
export const confettiRain = (container, count = 60) => {
    if (!container || prefersReducedMotion()) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    const layer = document.createElement('div');
    layer.className = 'fx-splash fx-confetti';
    layer.style.cssText = 'left:0;top:0;z-index:30;';
    container.appendChild(layer);
    const tl = gsap.timeline({ onComplete: () => layer.remove() });
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        const s = gsap.utils.random(6, 14);
        piece.className = 'fx-splash__dot';
        piece.style.cssText = `width:${s}px;height:${s * gsap.utils.random(0.35, 1)}px;background:${pick(PALETTE)};border-radius:${Math.random() < 0.3 ? '50%' : '2px'};`;
        layer.appendChild(piece);
        const x = gsap.utils.random(0, w);
        const dur = gsap.utils.random(1.6, 2.8);
        tl.fromTo(piece,
            { x, y: gsap.utils.random(-120, -20), rotation: gsap.utils.random(0, 360) },
            {
                x: x + gsap.utils.random(-120, 120),
                y: gsap.utils.random(h * 0.55, h * 0.95),
                rotation: `+=${gsap.utils.random(-540, 540)}`,
                duration: dur,
                ease: 'power1.in'
            }, gsap.utils.random(0, 0.5))
            .to(piece, { opacity: 0, duration: 0.4 }, '>-0.4');
    }
};

export const initArtifactCelebration = () => {
    const section = document.querySelector('.artifacts');
    const hint = document.getElementById('artifactsUnlockHint');
    if (!section) return null;

    const celebrate = (pedestal, bgText) => {
        if (prefersReducedMotion()) return;
        const c = centerIn(pedestal, section);

        // Three paint bursts around the pedestal
        colorSplash(section, c.x, c.y - 40, { count: 50, scale: 2.4, zIndex: 1 });
        gsap.delayedCall(0.18, () => colorSplash(section, c.x - gsap.utils.random(120, 260), c.y - gsap.utils.random(60, 180), { count: 22, scale: 1.2, zIndex: 1 }));
        gsap.delayedCall(0.32, () => colorSplash(section, c.x + gsap.utils.random(120, 260), c.y - gsap.utils.random(40, 160), { count: 22, scale: 1.2, zIndex: 1 }));
        confettiRain(section, window.innerWidth < 768 ? 40 : 70);

        // Giant name flashes to full yellow, then fades back
        if (bgText) {
            gsap.fromTo(bgText, { color: 'rgba(255, 225, 0, 0.95)' },
                { color: 'rgba(255, 225, 0, 0.15)', duration: 2.2, ease: 'power2.in', delay: 0.4 });
        }

        // Stamp slams onto the pedestal
        const stamp = document.createElement('div');
        stamp.className = 'artifacts__stamp';
        stamp.setAttribute('aria-hidden', 'true');
        stamp.textContent = 'Legend found';
        pedestal.appendChild(stamp);
        gsap.timeline({ onComplete: () => stamp.remove() })
            .fromTo(stamp, { scale: 3.2, rotation: -30, autoAlpha: 0 },
                { scale: 1, rotation: -12, autoAlpha: 1, duration: 0.4, ease: 'expo.in' }, 0.25)
            .to(stamp, { scale: 1.08, duration: 0.08, yoyo: true, repeat: 1 })
            .to(stamp, { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' }, '+=1.4');
    };

    const setHint = (visible) => {
        if (!hint) return;
        gsap.killTweensOf(hint);
        if (visible) {
            hint.hidden = false;
            gsap.fromTo(hint, { autoAlpha: 0, y: 20, scale: 0.9 },
                { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, delay: 0.9, ease: 'back.out(2)' });
        } else {
            gsap.to(hint, { autoAlpha: 0, duration: 0.2, onComplete: () => { hint.hidden = true; } });
        }
    };

    return { celebrate, setHint };
};

// ================================================
// FINALE - FULL-SCREEN PUNCHLINE, WORD BY WORD
// ================================================
export const initFinale = () => {
    const section = document.getElementById('finaleSection');
    if (!section || prefersReducedMotion()) return;

    const alone = section.querySelector('.finale__line--alone');
    const tribeLine = section.querySelector('.finale__line--tribe');
    const text = section.querySelector('.finale__text');
    const mark = section.querySelector('.finale__mark');
    const seen = section.querySelector('.finale__seen');
    const members = gsap.utils.toArray('.finale__member', section);
    const highlights = gsap.utils.toArray('.finale__hl', text);
    if (!alone || !tribeLine || !text) return;

    section.classList.add('is-scripted');

    const aloneSplit = SplitText.create(alone, { type: 'words' });
    const tribeSplit = SplitText.create(tribeLine, { type: 'words' });
    const finalSplit = SplitText.create(text, { type: 'words' });

    // one-shot moments that fire as the scrub passes them
    const once = {};
    const moment = (key, fn) => () => {
        if (once[key]) return;
        once[key] = true;
        fn();
    };
    const flashSeen = moment('seen', () => {
        const c = centerIn(seen, section);
        colorSplash(section, c.x, c.y, { count: 28, scale: 1.5, zIndex: 0, colors: ['#16E3FE', '#FFE100', '#ffffff'] });
        gsap.fromTo(section, { backgroundColor: '#ffffff' }, { backgroundColor: '#fffbe0', duration: 0.12, yoyo: true, repeat: 1 });
    });
    const burstFinal = moment('final', () => {
        highlights.forEach((hl, i) => {
            gsap.delayedCall(i * 0.12, () => {
                const c = centerIn(hl, section);
                colorSplash(section, c.x, c.y, { count: 26, scale: 1.6, zIndex: 0 });
            });
        });
    });

    // only one beat's line is ever visible (their highlight boxes included)
    gsap.set([tribeLine, text], { autoAlpha: 0 });
    gsap.set(members, { autoAlpha: 0, scale: 0 });

    gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=340%',
            pin: true,
            scrub: 0.8,
            onLeaveBack: () => { once.seen = false; once.final = false; }
        }
    })
        // Beat 1 - "You are not alone in your unveiling."
        .fromTo(aloneSplit.words, { opacity: 0.07, yPercent: 25 },
            { opacity: 1, yPercent: 0, ease: 'power2.out', stagger: 0.1, duration: 0.3 }, 0)
        .fromTo(mark, { backgroundSize: '100% 0%' }, { backgroundSize: '100% 100%', duration: 0.25 }, 0.45)
        .to(aloneSplit.words, { autoAlpha: 0, yPercent: -60, stagger: 0.04, duration: 0.25, ease: 'power2.in' }, 1.3)
        .to(alone, { autoAlpha: 0, duration: 0.1 }, 1.5)
        .set(tribeLine, { autoAlpha: 1 }, 1.55)

        // Beat 2 - the tribe gathers, "...dares to be seen."
        .to(members, {
            autoAlpha: 1,
            scale: 1,
            rotation: (i) => [-8, 6, -4, 7, -6][i % 5],
            duration: 0.4,
            ease: 'back.out(1.8)',
            stagger: 0.08
        }, 1.5)
        .fromTo(tribeSplit.words, { autoAlpha: 0, yPercent: 40, scale: 0.9 },
            { autoAlpha: 1, yPercent: 0, scale: 1, ease: 'power2.out', stagger: 0.08, duration: 0.3 }, 1.6)
        .fromTo(seen, { autoAlpha: 0, scale: 0.6, rotation: -8 }, { autoAlpha: 1, scale: 1, rotation: -3, duration: 0.25, ease: 'back.out(3)' }, 2.2)
        .call(flashSeen, null, 2.35)
        .to(tribeSplit.words, { autoAlpha: 0, yPercent: -60, stagger: 0.03, duration: 0.25, ease: 'power2.in' }, 3)
        .to(tribeLine, { autoAlpha: 0, duration: 0.1 }, 3.15)
        .to(members, { autoAlpha: 0.18, scale: 0.85, duration: 0.3, ease: 'power2.in' }, 3)
        .set(text, { autoAlpha: 1 }, 3.2)

        // Beat 3 - the punchline
        .fromTo(finalSplit.words, { autoAlpha: 0, yPercent: 25, scale: 0.92 },
            { autoAlpha: 1, yPercent: 0, scale: 1, ease: 'power2.out', stagger: 0.1, duration: 0.3 }, 3.2)
        .fromTo(highlights, { backgroundSize: '100% 0%', color: '#000' },
            { backgroundSize: '100% 100%', color: (i, el) => (el.classList.contains('finale__hl--cyan') ? '#000' : '#fff'), duration: 0.22, stagger: 0.3 }, 3.7)
        .call(burstFinal, null, 4.5)
        .to(text, { scale: 1.05, duration: 0.25, ease: 'power2.inOut' }, 4.5)
        .to(text, { scale: 1, duration: 0.2 }, 4.75)
        .to({}, { duration: 0.3 });
};
