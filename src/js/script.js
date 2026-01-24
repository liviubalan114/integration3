// ================================================
// ARTIFACTS CAROUSEL
// ================================================

import {
    entranceAnimation,
    transitionAnimation,
    showWalterSuccess,
    initContinuousAnimations,
    dragFeedback,
    dragSnapBack,
    initBrushEffect
} from './gsap.js';

// Initialize brush effect
initBrushEffect();

const ArtifactsCarousel = () => {
    // Data for each artifact
    const artifacts = [
        {
            name: "WALTER",
            title: "The visionary storyteller",
            quote: '"For me, it is important that clothes are representative of the <strong>spirit of the wearer</strong>, as opposed <strong>to the body wearing them.</strong>"',
            image: "src/assets/WalterHat.png",
            className: "artifact--walter"
        },
        {
            name: "ANN",
            title: "The gothic romantic",
            quote: '"For me, Black is poetic. How do you imagine a poet? In a bright yellow jacket? <strong>Probably not.</strong>"',
            image: "src/assets/AnnInk.png",
            className: "artifact--ann"
        },
        {
            name: "DRIES",
            title: "The textile poet",
            quote: '"Clothes is just something you put on to cover yourself. <strong>Fashion is a way to communicate.</strong>"',
            image: "src/assets/DriesLip.png",
            className: "artifact--dries"
        },
        {
            name: "MARINA",
            title: "The quiet deconstructor",
            quote: '"Reworking is not about recycling. <strong>It\'s about reconciliation.</strong>"',
            image: "src/assets/MarinaBag.png",
            className: "artifact--marina"
        },
        {
            name: "DIRK B",
            title: "The athletic revolutionary",
            quote: '"Fashion and football were two different and remote worlds, <strong>impossible to synthesize.</strong>"',
            image: "src/assets/DirkFoot.png",
            className: "artifact--dirkb"
        },
        {
            name: "DIRK VS",
            title: "The playful experimenter",
            quote: '"I don\'t like perfection or being too literal. I need to be able to <strong>break it</strong> in order to create a balance."',
            image: "src/assets/drikSpray.png",
            className: "artifact--dirkvs"
        }
    ];

    // State - start at Ann (index 1) instead of Walter
    let currentIndex = 1;
    let startX = 0;
    let isDragging = false;

    // DOM Elements
    const labelEl = document.getElementById('artifactsLabel');
    const quoteEl = document.getElementById('artifactsQuote');
    const backgroundTextEl = document.getElementById('artifactsBackgroundText');
    const centerImage = document.getElementById('artifactsImageCenter');
    const leftImage = document.getElementById('artifactsImageLeft');
    const rightImage = document.getElementById('artifactsImageRight');
    const centerPedestal = document.getElementById('artifactsPedestalCenter');
    const leftPedestal = document.getElementById('artifactsPedestalLeft');
    const rightPedestal = document.getElementById('artifactsPedestalRight');
    const prevBtn = document.getElementById('artifactsPrev');
    const nextBtn = document.getElementById('artifactsNext');
    const dotsContainer = document.getElementById('artifactsDots');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.artifacts__dot') : [];
    const allOptions = document.getElementById('artifactsAllOptions');
    const pukpukSection = document.getElementById('pukpukSection');

    // Check if elements exist
    if (!centerImage || !labelEl) return;

    // Add js-enabled class to body to hide fallback content
    document.body.classList.add('js-enabled');

    // Track if entrance animation has played
    let hasPlayedEntrance = false;

    // Initialize with entrance animation
    const init = () => {
        setupEventListeners();
        initContinuousAnimations(leftPedestal, rightPedestal, backgroundTextEl);
        setupScrollTrigger();
    };

    // Setup scroll trigger for entrance animation
    const setupScrollTrigger = () => {
        const artifactsSection = document.querySelector('.artifacts');
        if (!artifactsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasPlayedEntrance) {
                    hasPlayedEntrance = true;
                    updateContent(true); // Trigger entrance animation
                    observer.disconnect(); // Stop observing after first trigger
                }
            });
        }, {
            threshold: 0.3 // Trigger when 30% of section is visible
        });

        observer.observe(artifactsSection);
    };

    // Get wrapped index for infinite loop
    const getWrappedIndex = (index) => {
        if (index < 0) return artifacts.length - 1;
        if (index >= artifacts.length) return 0;
        return index;
    };

    // Update all content
    const updateContent = (isInitial = false) => {
        const current = artifacts[currentIndex];
        const prevIndex = getWrappedIndex(currentIndex - 1);
        const nextIndex = getWrappedIndex(currentIndex + 1);

        if (isInitial) {
            // Initial entrance animation from below
            entranceAnimation(labelEl, quoteEl, centerPedestal, () => {
                applyContent(current, prevIndex, nextIndex);
            });
        } else {
            // Transition animation with rotation and scale
            transitionAnimation(labelEl, quoteEl, backgroundTextEl, centerImage, currentIndex, () => {
                applyContent(current, prevIndex, nextIndex);
                // Walter success indicator
                if (currentIndex === 0) {
                    showWalterSuccess(centerPedestal);
                }
            });
        }

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('artifacts__dot--active', index === currentIndex);
        });

        // Update pukpuk section state (greyed out if not Walter)
        if (pukpukSection) {
            if (currentIndex === 0) {
                pukpukSection.classList.remove('pukpuk--inactive');
            } else {
                pukpukSection.classList.add('pukpuk--inactive');
            }
        }
    };

    // Apply content to DOM
    const applyContent = (current, prevIndex, nextIndex) => {
        labelEl.textContent = current.title;
        quoteEl.innerHTML = current.quote;
        backgroundTextEl.textContent = current.name;
        centerImage.src = current.image;
        centerImage.alt = `${current.name}'s artifact`;

        // Update artifact class for positioning
        centerImage.className = 'artifacts__artifact-image ' + current.className;

        // Update side images
        if (leftImage) {
            leftImage.src = artifacts[prevIndex].image;
            leftImage.className = 'artifacts__artifact-image ' + artifacts[prevIndex].className;
        }
        if (rightImage) {
            rightImage.src = artifacts[nextIndex].image;
            rightImage.className = 'artifacts__artifact-image ' + artifacts[nextIndex].className;
        }
    };

    // Navigate to index
    const navigateTo = (newIndex) => {
        currentIndex = getWrappedIndex(newIndex);
        updateContent();
    };

    // Setup event listeners
    const setupEventListeners = () => {
        // Arrow buttons
        if (prevBtn) prevBtn.addEventListener('click', () => navigateTo(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => navigateTo(currentIndex + 1));

        // Side pedestal clicks
        if (leftPedestal) leftPedestal.addEventListener('click', () => navigateTo(currentIndex - 1));
        if (rightPedestal) rightPedestal.addEventListener('click', () => navigateTo(currentIndex + 1));

        // Dot navigation
        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index, 10);
                navigateTo(index);
            });
        });

        // Drag/swipe on center pedestal
        if (centerPedestal) {
            centerPedestal.addEventListener('mousedown', handleDragStart);
            centerPedestal.addEventListener('touchstart', handleDragStart, { passive: true });

            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('touchmove', handleDragMove, { passive: false });

            document.addEventListener('mouseup', handleDragEnd);
            document.addEventListener('touchend', handleDragEnd);
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const artifactsSection = document.querySelector('.artifacts');
            if (!artifactsSection) return;

            const rect = artifactsSection.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;

            if (!isInView) return;

            if (e.key === 'ArrowLeft') navigateTo(currentIndex - 1);
            if (e.key === 'ArrowRight') navigateTo(currentIndex + 1);
        });
    };

    // Drag handlers
    const handleDragStart = (e) => {
        isDragging = true;
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        centerImage.style.cursor = 'grabbing';
    };

    // Enhanced drag with elastic snap
    const handleDragMove = (e) => {
        if (!isDragging) return;
        if (e.type === 'touchmove') e.preventDefault();

        const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const diff = startX - currentX;

        // Visual feedback with elastic resistance
        dragFeedback(centerImage, diff);
    };

    const handleDragEnd = (e) => {
        if (!isDragging) return;

        const currentX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
        const diff = startX - currentX;

        // Elastic snap back with bounce
        dragSnapBack(centerImage);

        // Threshold for swipe (50px)
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                navigateTo(currentIndex + 1); // Swiped left - next
            } else {
                navigateTo(currentIndex - 1); // Swiped right - prev
            }
        }

        isDragging = false;
        centerImage.style.cursor = 'grab';
    };

    // Initialize
    init();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ArtifactsCarousel);
} else {
    ArtifactsCarousel();
}
