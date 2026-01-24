// ================================================
// GSAP ANIMATIONS FOR ARTIFACTS CAROUSEL
// ================================================

import gsap from 'gsap';

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
        { scale: 0.3, opacity: 1 },
        {
            scale: 3.5,
            opacity: 0,
            duration: 2.5,
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

    // Background text very subtle rotation (only on desktop)
    if (window.innerWidth >= 768 && backgroundTextEl) {
        gsap.to(backgroundTextEl, {
            rotation: 3,
            duration: 8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
    }
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
