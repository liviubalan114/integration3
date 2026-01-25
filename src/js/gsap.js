// ================================================
// GSAP ANIMATIONS FOR ARTIFACTS CAROUSEL
// ================================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Initial entrance animation from below
export const entranceAnimation = (labelEl, quoteEl, centerPedestal, callback) => {
    gsap.set([labelEl, quoteEl, centerPedestal], { y: 100, opacity: 0 });

    const tl = gsap.timeline();
    tl.call(callback)
        .to(labelEl, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
        })
        .to(quoteEl, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.6")
        .to(centerPedestal, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "elastic.out(1, 0.5)"
        }, "-=0.5");
};

// Transition animation with rotation
export const transitionAnimation = (labelEl, quoteEl, backgroundTextEl, centerImage, currentIndex, callback) => {
    const tl = gsap.timeline();

    // Fade out with rotation
    tl.to([labelEl, quoteEl], {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.inOut"
    })
        .to(backgroundTextEl, {
            xPercent: -50,
            yPercent: -50,
            scale: 1.1,
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut"
        }, "<")
        .to(centerImage, {
            scale: 0.8,
            rotation: currentIndex % 2 === 0 ? -15 : 15,
            opacity: 0.5,
            duration: 0.4,
            ease: "power2.inOut"
        }, "<")
        .call(callback)
        // Fade in with bounce
        .to(centerImage, {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)"
        })
        .to([labelEl, quoteEl], {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        }, "<0.1")
        .to(backgroundTextEl, {
            xPercent: -50,
            yPercent: -50,
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
        }, "<");
};

// Walter selection success indicator
export const showWalterSuccess = (centerPedestal) => {
    // Create glow effect
    const glow = document.createElement('div');
    glow.className = 'artifacts__walter-glow';
    centerPedestal.appendChild(glow);

    // Animate glow pulse
    gsap.fromTo(glow,
        { scale: 0.5, opacity: 1 },
        {
            scale: 2,
            opacity: 0,
            duration: 4,
            ease: "power2.out",
            onComplete: () => glow.remove()
        }
    );

    // Pedestal celebration bounce - wild!
    const tl = gsap.timeline();
    tl.to(centerPedestal, {
        y: -30,
        rotation: -5,
        scale: 1.1,
        duration: 0.4,
        ease: "power2.out"
    })
        .to(centerPedestal, {
            y: 0,
            rotation: 3,
            scale: 0.95,
            duration: 0.3,
            ease: "bounce.out"
        })
        .to(centerPedestal, {
            y: -15,
            rotation: -2,
            scale: 1.05,
            duration: 0.25,
            ease: "power2.out"
        })
        .to(centerPedestal, {
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.4,
            ease: "elastic.out(1, 0.4)"
        });
};

// Continuous subtle animations
export const initContinuousAnimations = (leftPedestal, rightPedestal, backgroundTextEl) => {
    // Side pedestals gentle float
    if (leftPedestal && rightPedestal) {
        gsap.to(leftPedestal, {
            y: -8,
            duration: 2.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });

        gsap.to(rightPedestal, {
            y: -8,
            duration: 2.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 0.5
        });
    }

    // Background text rotation disabled - conflicts with CSS centering
    // TODO: Fix centering issue if animation is needed later
};

// Enhanced drag feedback with elastic resistance
export const dragFeedback = (centerImage, diff) => {
    const resistance = Math.max(0.3, 1 - Math.abs(diff) / 200);
    gsap.to(centerImage, {
        x: -diff * resistance,
        rotation: diff * 0.03,
        duration: 0.1
    });
};

// Elastic snap back after drag
export const dragSnapBack = (centerImage) => {
    gsap.to(centerImage, {
        x: 0,
        rotation: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)"
    });
};

// ================================================
// BRUSH EFFECT - MOUSE TRAIL
// ================================================

export const initBrushEffect = () => {
    // Only enable brush effect on desktop (>= 768px)
    if (window.innerWidth < 768) {
        return () => { }; // Return empty cleanup function
    }

    // Website colors - gradient cycle
    const colors = [
        '#FFE100', // yellow
        '#FF6B35', // orange
        '#D32227', // red
        '#7B1FA2', // purple
        '#2196F3', // blue
    ];

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'brush-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Trail points array - stores position and color info
    const trail = [];
    const maxTrailLength = 80;
    const lineWidth = 8;
    let colorIndex = 0;
    let colorProgress = 0;

    // Resize handler
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Interpolate between two hex colors
    const lerpColor = (color1, color2, t) => {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);

        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);

        return `rgb(${r}, ${g}, ${b})`;
    };

    // Get current gradient color
    const getCurrentColor = () => {
        const nextIndex = (colorIndex + 1) % colors.length;
        return lerpColor(colors[colorIndex], colors[nextIndex], colorProgress);
    };

    // Mouse move handler
    const handleMouseMove = (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Add point to trail with current color
        trail.push({
            x,
            y,
            color: getCurrentColor(),
            life: 1
        });

        // Keep trail at max length
        if (trail.length > maxTrailLength) {
            trail.shift();
        }

        // Progress through colors gradually
        colorProgress += 0.02;
        if (colorProgress >= 1) {
            colorProgress = 0;
            colorIndex = (colorIndex + 1) % colors.length;
        }
    };

    // Touch support
    const handleTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Animation loop
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fade out trail points over time
        for (let i = trail.length - 1; i >= 0; i--) {
            trail[i].life -= 0.015;
            if (trail[i].life <= 0) {
                trail.splice(i, 1);
            }
        }

        // Draw the trail as connected line segments with gradient
        if (trail.length > 1) {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let i = 1; i < trail.length; i++) {
                const prev = trail[i - 1];
                const curr = trail[i];

                // Calculate opacity based on position in trail and life
                const positionOpacity = i / trail.length;
                const lifeOpacity = curr.life;
                const opacity = positionOpacity * lifeOpacity;

                // Draw segment
                ctx.beginPath();
                ctx.moveTo(prev.x, prev.y);
                ctx.lineTo(curr.x, curr.y);

                // Line width tapers toward the tail
                ctx.lineWidth = lineWidth * positionOpacity * lifeOpacity;
                ctx.strokeStyle = curr.color;
                ctx.globalAlpha = opacity;
                ctx.stroke();
            }

            ctx.globalAlpha = 1;
        }

        requestAnimationFrame(animate);
    };

    animate();

    // Return cleanup function
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('resize', resize);
        canvas.remove();
    };
};

// Text fade animations on scroll
export const initTextScrollAnimations = () => {
    // Select all text elements to animate (excluding artifacts title and footer)
    const textElements = gsap.utils.toArray('h1, h2, h3, h4, p, blockquote, .artifacts__label, .artifacts__quote');

    // Filter out artifacts title and footer elements
    const filteredElements = textElements.filter(el => {
        return !el.classList.contains('artifacts__title') &&
            !el.closest('.site-footer');
    });

    filteredElements.forEach(element => {
        // Adjust start point based on screen size - earlier on tablet
        const isTablet = window.matchMedia('(min-width: 768px)').matches;
        const startPoint = isTablet ? "top 80%" : "top 95%";

        gsap.fromTo(element,
            {
                opacity: 0,
                y: 40,
                rotation: -2
            },
            {
                opacity: 1,
                y: 0,
                rotation: 0,
                duration: 0.5,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: element,
                    start: startPoint,
                    end: "top 25%",
                    toggleActions: "play reverse play reverse",
                    scrub: 0.3
                }
            }
        );
    });

    // Animate colored block elements sliding in from left
    const coloredBlocks = gsap.utils.toArray('.artifacts__title, .no-more-hiding__quote, .pukpuk__tag');
    const isTablet = window.matchMedia('(min-width: 768px)').matches;
    const blockStartPoint = isTablet ? "top 80%" : "top 95%";

    coloredBlocks.forEach(block => {
        gsap.fromTo(block,
            {
                x: -100,
                opacity: 0
            },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: block,
                    start: blockStartPoint,
                    toggleActions: "play reverse play reverse"
                }
            }
        );
    });

    // Pukpuk card falling animation
    const pukpukCard = document.querySelector('.pukpuk__card');
    if (pukpukCard) {
        const isTablet = window.matchMedia('(min-width: 768px)').matches;
        const cardStartPoint = isTablet ? "top 75%" : "top 85%";

        gsap.fromTo(pukpukCard,
            {
                y: -200,
                rotation: -30,
                opacity: 0
            },
            {
                y: 0,
                rotation: 17,
                opacity: 1,
                duration: 1.5,
                ease: "bounce.out",
                scrollTrigger: {
                    trigger: pukpukCard,
                    start: cardStartPoint,
                    toggleActions: "play none none reverse"
                }
            }
        );
    }
};
