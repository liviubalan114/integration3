// ================================================
// ARTIFACTS CAROUSEL
// ================================================

import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import {
    entranceAnimation,
    transitionAnimation,
    showWalterSuccess,
    initContinuousAnimations,
    dragFeedback,
    dragSnapBack,
    initBrushEffect,
    initTextScrollAnimations,
    initImageAnimations
} from './gsap.js';
import { colorSplash, confettiRain, initPukpukReveal, initNoMoreHiding, initNewYou, initArtifactCelebration, initFinale } from './effects.js';

// Import images for artifacts carousel (Vite handles paths)
import WalterHatImg from '../assets/WalterHat.avif';
import AnnInkImg from '../assets/AnnInk.avif';
import DriesLipImg from '../assets/DriesLip.avif';
import MarinaBagImg from '../assets/MarinaBag.avif';
import DirkFootImg from '../assets/DirkFoot.avif';
import DrikSprayImg from '../assets/drikSpray.avif';

// Import images for dress-up interaction
import WalterSuitDressUpImg from '../assets/WalterSuitDressUp.avif';
import WalterMaskDressUpImg from '../assets/WalterMaskDressUp.avif';
import WrongMaskDressUpImg from '../assets/WrongMaskDressUp.avif';
import BowDressUpImg from '../assets/BowDressUp.avif';
import HatDressUpImg from '../assets/HatDressUp.avif';
import CorrectStickDressUpImg from '../assets/CorrectStickDressUp.avif';
import WrongCaneDressUpImg from '../assets/WrongCaneDressUp.avif';
import LockDressUpImg from '../assets/LockDressUp.avif';
import PantsDressUpImg from '../assets/PantsDressUp.avif';
import NormalSuitDressUpImg from '../assets/NormalSuitDressUp.avif';
import ShadowDressUpImg from '../assets/ShadowDressUp.avif';
import ShieldDressUpImg from '../assets/ShieldDressUp.avif';
import VoodooDressUpImg from '../assets/VoodooDressUp.avif';
import BdsmDressUpImg from '../assets/BdsmDressUp.avif';

// Import background SVGs used by CSS custom properties
import LeftRedImg from '../assets/leftRed.svg';
import RightPurpleImg from '../assets/rightPurple.svg';

// Register GSAP plugins
gsap.registerPlugin(Draggable);

// Set CSS custom properties for background images
document.documentElement.style.setProperty('--left-red-bg', `url(${LeftRedImg})`);
document.documentElement.style.setProperty('--right-purple-bg', `url(${RightPurpleImg})`);

// Initialize brush effect only on desktop (1024px and above)
if (window.innerWidth >= 1024) {
    initBrushEffect();
}

const ArtifactsCarousel = (pukpukReveal, celebration) => {
    // Data for each artifact
    const artifacts = [
        {
            name: "WALTER",
            title: "The visionary storyteller",
            quote: '"For me, it is important that clothes are representative of the <strong>spirit of the wearer</strong>, as opposed <strong>to the body wearing them.</strong>"',
            image: WalterHatImg,
            className: "artifact--walter"
        },
        {
            name: "ANN",
            title: "The gothic romantic",
            quote: '"For me, Black is poetic. How do you imagine a poet? In a bright yellow jacket? <strong>Probably not.</strong>"',
            image: AnnInkImg,
            className: "artifact--ann"
        },
        {
            name: "DRIES",
            title: "The textile poet",
            quote: '"Clothes is just something you put on to cover yourself. <strong>Fashion is a way to communicate.</strong>"',
            image: DriesLipImg,
            className: "artifact--dries"
        },
        {
            name: "MARINA",
            title: "The quiet deconstructor",
            quote: '"Reworking is not about recycling. <strong>It\'s about reconciliation.</strong>"',
            image: MarinaBagImg,
            className: "artifact--marina"
        },
        {
            name: "DIRK B",
            title: "The athletic revolutionary",
            quote: '"Fashion and football were two different and remote worlds, <strong>impossible to synthesize.</strong>"',
            image: DirkFootImg,
            className: "artifact--dirkb"
        },
        {
            name: "DIRK VS",
            title: "The playful experimenter",
            quote: '"I don\'t like perfection or being too literal. I need to be able to <strong>break it</strong> in order to create a balance."',
            image: DrikSprayImg,
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
    const pukpukSection = document.getElementById('pukpukSection');

    // Check if elements exist
    if (!centerImage || !labelEl) return;

    // Add js-enabled class to body to hide fallback content
    document.body.classList.add('js-enabled');

    // The carousel starts on Ann, so Walter's section starts locked
    if (pukpukSection) pukpukSection.classList.add('pukpuk--inactive');

    // Track if entrance animation has played
    let hasPlayedEntrance = false;

    // Initialize background text centering - clear any GSAP transforms
    if (backgroundTextEl) {
        gsap.set(backgroundTextEl, { clearProps: "all" });
    }

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
                    if (celebration) celebration.celebrate(centerPedestal, backgroundTextEl);
                }
            });
        }

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('artifacts__dot--active', index === currentIndex);
        });

        // Update pukpuk section state (greyed out if not Walter)
        if (pukpukSection) {
            const unlocked = currentIndex === 0;
            pukpukSection.classList.toggle('pukpuk--inactive', !unlocked);
            if (pukpukReveal) pukpukReveal.setUnlocked(unlocked);
            if (celebration) celebration.setHint(unlocked);
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

// ================================================
// CREATE THE SKIN - DRESS-UP INTERACTION
// ================================================

const CreateSkinInteraction = () => {
    const dragArea = document.getElementById('createSkinDragArea');
    const drawer = document.getElementById('createSkinDrawer');
    const drawerHandle = document.getElementById('createSkinDrawerHandle');
    const drawerContent = document.getElementById('createSkinDrawerContent');
    const infoText = document.getElementById('createSkinInfoText');

    if (!dragArea) return;

    // Default info text
    const DEFAULT_INFO = 'Interact with the clothes to learn more and create your new skin';
    const COMPLETE_INFO = '<strong>Your new skin is made.</strong> It does not conceal, it reveals. Walter would approve.';

    // Swap the note text with a quick fade so changes feel intentional
    const showInfo = (html) => {
        if (!infoText || infoText.innerHTML === html) return;
        infoText.innerHTML = html;
        gsap.fromTo(infoText, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out', overwrite: true });
    };

    // Helper function to add info hover handlers
    const addInfoHoverHandlers = (element) => {
        const infoFor = (el) => {
            const isMobile = window.innerWidth < 768;
            return isMobile ?
                (el.getAttribute('data-info-mobile') || el.getAttribute('data-info')) :
                el.getAttribute('data-info');
        };
        // Mouse events for desktop
        element.addEventListener('mouseenter', function () {
            const info = infoFor(this);
            if (info) showInfo(info);
        });
        element.addEventListener('mouseleave', function () {
            showInfo(completeEl ? COMPLETE_INFO : DEFAULT_INFO);
        });

        // Touch events for tablet
        element.addEventListener('touchstart', function () {
            const info = infoFor(this);
            if (info) showInfo(info);
        });
    };

    // Fusion pairs configuration
    const fusionPairs = {
        suit: {
            items: ['.create-skin__draggable--normal-suit', '.create-skin__draggable--shield'],
            fused: false,
            fusedElement: null,
            fusedImage: WalterSuitDressUpImg,
            fusedName: 'Walter Suit'
        },
        mask: {
            items: ['.create-skin__draggable--voodoo', '.create-skin__draggable--bdsm'],
            fused: false,
            fusedElement: null,
            fusedImage: WalterMaskDressUpImg,
            fusedName: 'Walter Mask'
        }
    };

    // Check if two elements are overlapping
    const isOverlapping = (elem1, elem2, threshold = 50) => {
        const rect1 = elem1.getBoundingClientRect();
        const rect2 = elem2.getBoundingClientRect();

        const centerX1 = rect1.left + rect1.width / 2;
        const centerY1 = rect1.top + rect1.height / 2;
        const centerX2 = rect2.left + rect2.width / 2;
        const centerY2 = rect2.top + rect2.height / 2;

        const distance = Math.sqrt(
            Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2)
        );

        return distance < threshold;
    };

    // ------------------------------------------------
    // YOUR NEW SKIN: when all the right pieces are dropped on (or near)
    // the silhouette, the outfit is complete. Pieces stay where they are
    // dropped; z only keeps the layering right (lock on top of the clothes).
    // ------------------------------------------------
    const SNAP_TARGETS = {
        pants: { z: 2 },
        suit: { z: 3 },
        stick: { z: 4 },
        mask: { z: 5 },
        lock: { z: 6 }
    };
    const TOTAL_PIECES = Object.keys(SNAP_TARGETS).length;
    const shadowWrap = dragArea.querySelector('.create-skin__shadow');
    const shadowImg = shadowWrap ? shadowWrap.querySelector('img') : null;
    const placed = new Set();
    let completeEl = null;

    const relCenter = (rect) => {
        const c = dragArea.getBoundingClientRect();
        return { x: rect.left - c.left + rect.width / 2, y: rect.top - c.top + rect.height / 2 };
    };

    const unsnap = (el) => {
        if (!el || !el.dataset.snapped) return;
        delete el.dataset.snapped;
        delete el.dataset.snapZ;
        placed.delete(el.dataset.piece);
        if (completeEl) {
            completeEl.remove();
            completeEl = null;
            dragArea.classList.remove('is-complete');
            if (shadowWrap) gsap.to(shadowWrap, { autoAlpha: 1, duration: 0.4 });
        }
    };

    const restoreLayer = (el) => {
        if (el && el.dataset.snapZ) el.style.zIndex = el.dataset.snapZ;
    };

    const celebrateSkin = () => {
        const sil = shadowImg.getBoundingClientRect();
        const c = relCenter(sil);
        dragArea.classList.add('is-complete');
        if (shadowWrap) gsap.to(shadowWrap, { autoAlpha: 0.25, duration: 0.6, delay: 0.2 });

        colorSplash(dragArea, c.x, c.y - sil.height * 0.2, { count: 40, scale: 2.2, zIndex: 1 });
        gsap.delayedCall(0.2, () => colorSplash(dragArea, c.x - sil.width * 0.6, c.y + sil.height * 0.1, { count: 22, scale: 1.3, zIndex: 1 }));
        gsap.delayedCall(0.35, () => colorSplash(dragArea, c.x + sil.width * 0.6, c.y - sil.height * 0.05, { count: 22, scale: 1.3, zIndex: 1 }));
        confettiRain(dragArea, window.innerWidth < 768 ? 40 : 70);

        // the finished outfit struts
        const pieces = Array.from(dragArea.querySelectorAll('[data-snapped]'));
        gsap.to(pieces, { y: '-=14', duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 3 });

        completeEl = document.createElement('div');
        completeEl.className = 'create-skin__complete';
        completeEl.innerHTML = '<span class="create-skin__complete-title">Your new skin is made</span>' +
            '<span class="create-skin__complete-sub">No more hiding.</span>' +
            '<a class="create-skin__complete-link" href="#newYouSection">Meet the new you ↓</a>';
        dragArea.appendChild(completeEl);
        gsap.fromTo(completeEl, { scale: 3, rotation: -25, autoAlpha: 0 },
            { scale: 1, rotation: -4, autoAlpha: 1, duration: 0.45, delay: 0.3, ease: 'expo.in' });

        showInfo(COMPLETE_INFO);
    };

    // Is the piece's centre on the silhouette (with a forgiving margin)?
    const isOnSilhouette = (el) => {
        const sil = shadowImg.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const padX = sil.width * 0.3;
        const padY = sil.height * 0.06;
        return cx > sil.left - padX && cx < sil.right + padX &&
            cy > sil.top - padY && cy < sil.bottom + padY;
    };

    // Called when a piece is released
    const trySnap = (el) => {
        const key = el && el.dataset.piece;
        const t = key && SNAP_TARGETS[key];
        if (!t || !shadowImg || !el.isConnected || !isOnSilhouette(el)) return false;

        el.dataset.snapped = '1';
        el.dataset.snapZ = String(10 + t.z);
        el.style.zIndex = el.dataset.snapZ;
        placed.add(key);

        const c = relCenter(el.getBoundingClientRect());
        colorSplash(dragArea, c.x, c.y, { count: 12, scale: 0.7, zIndex: 5 });
        if (placed.size === TOTAL_PIECES && !completeEl) {
            celebrateSkin();
        } else if (!completeEl) {
            showInfo(`<strong>That suits you.</strong> ${placed.size}/${TOTAL_PIECES} pieces of your new skin are on.`);
        }
        return true;
    };

    // Create fused element
    const createFusedElement = (pairKey, element1 = null, element2 = null) => {
        const pair = fusionPairs[pairKey];

        const elem1 = element1 || document.querySelector(pair.items[0]);
        const elem2 = element2 || document.querySelector(pair.items[1]);

        if (!elem1 || !elem2) return;

        const rect1 = elem1.getBoundingClientRect();
        const containerRect = dragArea.getBoundingClientRect();

        const fusedDiv = document.createElement('div');
        fusedDiv.className = 'create-skin__draggable create-skin__fused-item';
        fusedDiv.dataset.piece = pairKey;

        const fusedImg = document.createElement('img');
        fusedImg.src = pair.fusedImage;
        fusedImg.alt = pair.fusedName;

        if (pairKey === 'suit') {
            fusedDiv.style.width = '11.2rem';
        } else if (pairKey === 'mask') {
            fusedDiv.style.width = '5rem';
        }

        fusedDiv.appendChild(fusedImg);

        fusedDiv.style.position = 'absolute';
        fusedDiv.style.left = (rect1.left - containerRect.left) + 'px';
        fusedDiv.style.top = (rect1.top - containerRect.top) + 'px';
        fusedDiv.style.cursor = 'grab';

        dragArea.appendChild(fusedDiv);

        const fusedInfoText = pairKey === 'suit'
            ? 'Walter suit - Tailored suit fused with a papilla shield. Perfect protection, perfect blend, half office, half battlefield. For the one that never sleeps.'
            : 'Walter mask - Voodoo spirit stitched to a fetish hood. Sacred and obscene at once, looks like you are hiding your darkest secrets under it.';

        fusedDiv.setAttribute('data-info', fusedInfoText);
        addInfoHoverHandlers(fusedDiv);

        Draggable.create(fusedDiv, {
            bounds: dragArea,
            inertia: true,
            onDragStart: function () { unsnap(this.target); },
            onRelease: function () { restoreLayer(this.target); },
            onDrag: function () {
                if (window.innerWidth < 768) {
                    checkReturnToDrawer(this.target);
                }
            },
            onDragEnd: function () {
                let returned = false;
                if (window.innerWidth < 768) {
                    returned = checkReturnToDrawer(this.target, true);
                    if (returned) {
                        pair.fused = false;
                        pair.fusedElement = null;

                        const previewRef1 = elem1.getAttribute('data-preview-ref');
                        const previewRef2 = elem2.getAttribute('data-preview-ref');

                        if (previewRef1) {
                            const preview1 = document.querySelector(`.create-skin__preview[data-shape-index="${previewRef1}"]`);
                            if (preview1) preview1.classList.remove('create-skin__preview--used');
                        }
                        if (previewRef2) {
                            const preview2 = document.querySelector(`.create-skin__preview[data-shape-index="${previewRef2}"]`);
                            if (preview2) preview2.classList.remove('create-skin__preview--used');
                        }
                    }
                }
                if (!returned) trySnap(this.target);
            }
        });

        elem1.classList.add('create-skin__draggable--fused');
        elem2.classList.add('create-skin__draggable--fused');

        // Fusion moment: colour splash where the two pieces met + the new
        // piece pops into existence
        const rect2 = elem2.getBoundingClientRect();
        colorSplash(
            dragArea,
            (rect1.left + rect1.width / 2 + rect2.left + rect2.width / 2) / 2 - containerRect.left,
            (rect1.top + rect1.height / 2 + rect2.top + rect2.height / 2) / 2 - containerRect.top,
            { count: 34, scale: 1.4, zIndex: 5 }
        );
        gsap.from(fusedImg, { scale: 0.2, rotation: -25, duration: 1, ease: 'elastic.out(1, 0.5)' });

        if (elem1.classList.contains('create-skin__mobile-dragged')) {
            fusedDiv.setAttribute('data-preview-ref-1', elem1.getAttribute('data-preview-ref'));
            elem1.remove();
        }
        if (elem2.classList.contains('create-skin__mobile-dragged')) {
            fusedDiv.setAttribute('data-preview-ref-2', elem2.getAttribute('data-preview-ref'));
            elem2.remove();
        }

        pair.fused = true;
        pair.fusedElement = fusedDiv;
    };

    // Check for fusion opportunities
    const checkFusion = () => {
        Object.keys(fusionPairs).forEach(pairKey => {
            const pair = fusionPairs[pairKey];
            if (pair.fused) return;

            const class1 = pair.items[0].split('--')[1];
            const class2 = pair.items[1].split('--')[1];

            const allElems1 = Array.from(document.querySelectorAll(
                pair.items[0] + ':not(.create-skin__draggable--fused), .create-skin__mobile-dragged.create-skin__draggable--' + class1 + ':not(.create-skin__draggable--fused)'
            ));
            const allElems2 = Array.from(document.querySelectorAll(
                pair.items[1] + ':not(.create-skin__draggable--fused), .create-skin__mobile-dragged.create-skin__draggable--' + class2 + ':not(.create-skin__draggable--fused)'
            ));

            let foundOverlap = false;
            allElems1.forEach(elem1 => {
                allElems2.forEach(elem2 => {
                    if (elem1 !== elem2 && isOverlapping(elem1, elem2) &&
                        !elem1.classList.contains('create-skin__fused-item') && !elem2.classList.contains('create-skin__fused-item')) {
                        elem1.classList.add('create-skin__can-fuse');
                        elem2.classList.add('create-skin__can-fuse');
                        foundOverlap = true;
                    }
                });
            });

            if (!foundOverlap) {
                allElems1.forEach(elem => {
                    if (!elem.classList.contains('create-skin__fused-item')) {
                        elem.classList.remove('create-skin__can-fuse');
                    }
                });
                allElems2.forEach(elem => {
                    if (!elem.classList.contains('create-skin__fused-item')) {
                        elem.classList.remove('create-skin__can-fuse');
                    }
                });
            }
        });
    };

    // Initialize desktop draggable items
    const initDesktopDraggables = () => {
        if (window.innerWidth >= 768) {
            Draggable.create(".create-skin__draggable", {
                bounds: dragArea,
                inertia: true,
                onDragStart: function () { unsnap(this.target); },
                onRelease: function () { restoreLayer(this.target); },
                onDrag: function () {
                    checkFusion();
                },
                onDragEnd: function () {
                    checkFusion();
                    trySnap(this.target);

                    Object.keys(fusionPairs).forEach(pairKey => {
                        const pair = fusionPairs[pairKey];
                        if (pair.fused) return;

                        const elem1 = document.querySelector(pair.items[0]);
                        const elem2 = document.querySelector(pair.items[1]);

                        if (elem1 && elem2 && isOverlapping(elem1, elem2)) {
                            createFusedElement(pairKey);
                        }
                    });
                }
            });

            // Info panel hover functionality
            document.querySelectorAll('.create-skin__draggable').forEach(addInfoHoverHandlers);
        }
    };

    // Check if shape is being dragged back to drawer
    const checkReturnToDrawer = (element, shouldReturn = false) => {
        if (!drawer) return false;

        const isDrawerOpen = drawer.classList.contains('create-skin__drawer--open');
        if (!isDrawerOpen) return false;

        const drawerBar = drawer.querySelector('.create-skin__drawer-bar');
        if (!drawerBar) return false;

        const drawerRect = drawerBar.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        // Only the piece's centre counts, so dropping legs/cane low on the
        // silhouette doesn't accidentally send them back into the drawer
        const cx = elementRect.left + elementRect.width / 2;
        const cy = elementRect.top + elementRect.height / 2;
        const isOverDrawer = (
            cy > drawerRect.top &&
            cy < drawerRect.bottom &&
            cx > drawerRect.left &&
            cx < drawerRect.right
        );

        if (isOverDrawer && shouldReturn) {
            const previewRef = element.getAttribute('data-preview-ref');
            const preview = document.querySelector(`.create-skin__preview[data-shape-index="${previewRef}"]`);

            if (preview) {
                preview.classList.remove('create-skin__preview--used');
            }

            element.remove();
            return true;
        }

        return isOverDrawer;
    };

    // Handle dragging from preview
    const handlePreviewDrag = (e) => {
        const preview = e.currentTarget;

        if (preview.classList.contains('create-skin__preview--used')) return;

        const shapeClass = preview.getAttribute('data-shape-class');
        const dataInfo = preview.getAttribute('data-info');
        const dataImage = preview.getAttribute('data-image');

        const fullSize = document.createElement('div');
        fullSize.className = 'create-skin__draggable create-skin__mobile-dragged create-skin__draggable--' + shapeClass;
        fullSize.setAttribute('data-info', dataInfo);
        fullSize.setAttribute('data-preview-ref', preview.getAttribute('data-shape-index'));
        if (SNAP_TARGETS[shapeClass]) fullSize.dataset.piece = shapeClass;

        fullSize.style.width = preview.getAttribute('data-full-size');

        if (dataImage) {
            const img = document.createElement('img');
            img.src = dataImage;
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.objectFit = 'contain';
            img.style.pointerEvents = 'none';
            fullSize.appendChild(img);
        }

        fullSize.style.position = 'absolute';
        fullSize.style.left = '50%';
        fullSize.style.top = '50%';
        fullSize.style.transform = 'translate(-50%, -50%)';
        fullSize.style.cursor = 'grab';
        fullSize.style.display = 'flex';
        fullSize.style.zIndex = '999';

        dragArea.appendChild(fullSize);
        colorSplash(dragArea, dragArea.clientWidth / 2, dragArea.clientHeight / 2, { count: 14, scale: 0.8, zIndex: 5 });

        fullSize.addEventListener('mousedown', bringToFront);
        fullSize.addEventListener('touchstart', bringToFront);

        function bringToFront() {
            document.querySelectorAll('.create-skin__drag-area .create-skin__draggable').forEach(item => {
                item.style.zIndex = item.dataset.snapZ || '1';
            });
            fullSize.style.zIndex = '999';
        }

        // Copy mobile info attribute if it exists
        const mobileInfo = preview.getAttribute('data-info-mobile');
        if (mobileInfo) {
            fullSize.setAttribute('data-info-mobile', mobileInfo);
        }

        if (window.innerWidth < 768) {
            const info = fullSize.getAttribute('data-info-mobile') || fullSize.getAttribute('data-info');
            if (info) showInfo(info);
        }

        addInfoHoverHandlers(fullSize);

        Draggable.create(fullSize, {
            bounds: dragArea,
            inertia: true,
            onDragStart: function () { unsnap(this.target); },
            onRelease: function () { restoreLayer(this.target); },
            onDrag: function () {
                if (window.innerWidth >= 768) {
                    checkFusion();
                } else {
                    checkReturnToDrawer(this.target);
                }
            },
            onDragEnd: function () {
                if (window.innerWidth < 768) {
                    if (!checkReturnToDrawer(this.target, true)) trySnap(this.target);
                    return;
                }

                checkFusion();

                if (checkReturnToDrawer(this.target, true)) {
                    return;
                }

                Object.keys(fusionPairs).forEach(pairKey => {
                    const pair = fusionPairs[pairKey];
                    if (pair.fused) return;

                    const class1 = pair.items[0].split('--')[1];
                    const class2 = pair.items[1].split('--')[1];

                    const allElems1 = document.querySelectorAll(
                        pair.items[0] + ':not(.create-skin__draggable--fused), .create-skin__mobile-dragged.create-skin__draggable--' + class1 + ':not(.create-skin__draggable--fused)'
                    );
                    const allElems2 = document.querySelectorAll(
                        pair.items[1] + ':not(.create-skin__draggable--fused), .create-skin__mobile-dragged.create-skin__draggable--' + class2 + ':not(.create-skin__draggable--fused)'
                    );

                    allElems1.forEach(elem1 => {
                        allElems2.forEach(elem2 => {
                            if (elem1 !== elem2 && !elem1.classList.contains('create-skin__draggable--fused') && !elem2.classList.contains('create-skin__draggable--fused') && isOverlapping(elem1, elem2)) {
                                createFusedElement(pairKey, elem1, elem2);
                            }
                        });
                    });
                });
            }
        });

        preview.classList.add('create-skin__preview--used');
    };

    // Initialize mobile drawer
    const initMobileDrawer = () => {
        if (window.innerWidth < 768 && drawer && drawerContent) {
            drawerContent.innerHTML = '';

            const mobileShapes = [
                { className: 'suit', previewSize: '4rem', fullSize: '11.5rem', image: WalterSuitDressUpImg, info: 'Walter suit - Tailored suit fused with a papilla shield. Perfect protection, perfect blend, half office, half battlefield. For the one that never sleeps.', infoMobile: 'Tailored suit fused with a shield. Half office, half battlefield.' },
                { className: 'mask', previewSize: '3.5rem', fullSize: '5rem', image: WalterMaskDressUpImg, info: 'Walter mask - Voodoo spirit stitched to a fetish hood. Sacred and obscene at once, looks like you are hiding your darkest secrets under it.', infoMobile: 'Sacred and obscene. Hiding your darkest secrets under it.' },
                { className: 'wrong-mask', previewSize: '3rem', fullSize: '4rem', image: WrongMaskDressUpImg, info: 'Striped Walter mask - Voodoo spirit stitched to a fetish hood. Made from Voodoo and Bdsm. Good for your disguise but are you sure that color fits you?', infoMobile: 'Made from voodoo and bdsm. Good disguise but are you sure that color fits you?' },
                { className: 'bow', previewSize: '2.5rem', fullSize: '2rem', image: BowDressUpImg, info: "Neck bow - A soft ribbon tied too perfectly to be innocent. It's decoration now, one that would make people suspect nothing.", infoMobile: 'Tied too perfectly to be innocent. Makes people suspect nothing.' },
                { className: 'hat', previewSize: '3rem', fullSize: '5rem', image: HatDressUpImg, info: 'Walter hat - A hand‑made Walter hat that turns the head into a cartoon thought bubble. Optional armor for when you want the joke to sit on top.', infoMobile: 'Turns the head into a cartoon. Optional armor for when you want the joke on top.' },
                { className: 'stick', previewSize: '1.5rem', fullSize: '3.5rem', image: CorrectStickDressUpImg, info: "Right handed cane - A gentleman's cane with a dangling chain leash. Authority meets restraint, the perfect prop to tame the beast your collar is struggling to contain.", infoMobile: 'Authority meets restraint. The perfect prop to tame the beast.' },
                { className: 'wrong-cane', previewSize: '1rem', fullSize: '2.5rem', image: WrongCaneDressUpImg, info: "Left handed cane - A gentleman's cane with a dangling chain leash. Authority meets restraint. Close enough to confuse you but maybe try the right hand.", infoMobile: 'Close enough to confuse you but maybe try the right hand.' },
                { className: 'lock', previewSize: '2.5rem', fullSize: '2.5rem', image: LockDressUpImg, info: 'Lock - A sleek metal collar that keeps the beast on a leash. A reminder that the thing is still trapped underneath.', infoMobile: 'Keeps the beast on a leash. The thing is still trapped underneath.' },
                { className: 'pants', previewSize: '3rem', fullSize: '8rem', image: PantsDressUpImg, info: "Walter pants - Runway trousers cut with Walter's exaggerated proportions. They already bend the body into a new silhouette, but they need the right top half to feel complete.", infoMobile: 'Bend the body into a new silhouette. Need the right top to feel complete.' }
            ];

            mobileShapes.forEach((shape, index) => {
                const preview = document.createElement('div');
                preview.className = 'create-skin__preview ' + shape.className;
                preview.setAttribute('data-info', shape.info);
                preview.setAttribute('data-info-mobile', shape.infoMobile);
                preview.setAttribute('data-shape-class', shape.className);
                preview.setAttribute('data-shape-index', index);
                preview.setAttribute('data-full-size', shape.fullSize);
                if (shape.image) {
                    preview.setAttribute('data-image', shape.image);
                }

                preview.style.width = shape.previewSize;

                if (shape.image) {
                    const img = document.createElement('img');
                    img.src = shape.image;
                    img.style.width = '100%';
                    img.style.height = 'auto';
                    img.style.objectFit = 'contain';
                    img.style.pointerEvents = 'none';
                    preview.appendChild(img);
                }

                drawerContent.appendChild(preview);

                preview.addEventListener('touchstart', handlePreviewDrag);
                preview.addEventListener('mousedown', handlePreviewDrag);
            });
        }
    };

    // Toggle drawer
    if (drawerHandle) {
        drawerHandle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const scrollY = window.scrollY;
            drawer.classList.toggle('create-skin__drawer--open');

            window.scrollTo({ top: scrollY, behavior: 'instant' });
            requestAnimationFrame(() => {
                window.scrollTo({ top: scrollY, behavior: 'instant' });
            });
        });
    }

    // Initialize
    initDesktopDraggables();
    initMobileDrawer();
    window.addEventListener('resize', () => {
        initMobileDrawer();
        initDesktopDraggables();
    });
};

// Initialize when DOM is ready
const initAll = () => {
    const pukpukReveal = initPukpukReveal();
    ArtifactsCarousel(pukpukReveal, initArtifactCelebration());
    CreateSkinInteraction();
    initTextScrollAnimations();
    initImageAnimations();

    // Text-splitting effects need the final font metrics
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    fontsReady.then(() => {
        initNoMoreHiding();
        initNewYou();
        initFinale();
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}
