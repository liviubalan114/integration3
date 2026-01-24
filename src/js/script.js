// ================================================
// ARTIFACTS CAROUSEL
// ================================================

import gsap from 'gsap';
import { Draggable } from 'gsap/draggable';
import {
    entranceAnimation,
    transitionAnimation,
    showWalterSuccess,
    initContinuousAnimations,
    dragFeedback,
    dragSnapBack,
    initBrushEffect
} from './gsap.js';

// Register GSAP plugins
gsap.registerPlugin(Draggable);

// Initialize brush effect only on desktop (1024px and above)
if (window.innerWidth >= 1024) {
    initBrushEffect();
}

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
    const DEFAULT_INFO = 'Hover over shapes to learn more...';

    // Helper function to add info hover handlers
    const addInfoHoverHandlers = (element) => {
        element.addEventListener('mouseenter', function () {
            const info = this.getAttribute('data-info');
            if (info && infoText) infoText.innerHTML = info;
        });
        element.addEventListener('mouseleave', function () {
            if (infoText) infoText.textContent = DEFAULT_INFO;
        });
    };

    // Fusion pairs configuration
    const fusionPairs = {
        suit: {
            items: ['.create-skin__draggable--normal-suit', '.create-skin__draggable--shield'],
            fused: false,
            fusedElement: null,
            fusedImage: 'src/assets/WalterSuitDressUp.png',
            fusedName: 'Walter Suit'
        },
        mask: {
            items: ['.create-skin__draggable--voodoo', '.create-skin__draggable--bdsm'],
            fused: false,
            fusedElement: null,
            fusedImage: 'src/assets/WalterMaskDressUp.png',
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
            ? 'Walter suit - Tailored suit fused with a papilla shield. Perfect protection, perfect blend, half office, half battlefield. For the one that never sleeps'
            : 'Walter mask - Voodoo spirit stitched to a fetish hood. Sacred and obscene at once, looks like you are hiding your darkest secrets under it..';

        fusedDiv.setAttribute('data-info', fusedInfoText);
        addInfoHoverHandlers(fusedDiv);

        Draggable.create(fusedDiv, {
            bounds: dragArea,
            inertia: true,
            onDrag: function () {
                if (window.innerWidth < 768) {
                    checkReturnToDrawer(this.target);
                }
            },
            onDragEnd: function () {
                if (window.innerWidth < 768) {
                    const returned = checkReturnToDrawer(this.target, true);
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
            }
        });

        elem1.classList.add('create-skin__draggable--fused');
        elem2.classList.add('create-skin__draggable--fused');

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
                onDrag: function () {
                    checkFusion();
                },
                onDragEnd: function () {
                    checkFusion();

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

        const isOverDrawer = (
            elementRect.bottom > drawerRect.top &&
            elementRect.top < drawerRect.bottom &&
            elementRect.right > drawerRect.left &&
            elementRect.left < drawerRect.right
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

        fullSize.addEventListener('mousedown', bringToFront);
        fullSize.addEventListener('touchstart', bringToFront);

        function bringToFront() {
            document.querySelectorAll('.create-skin__drag-area .create-skin__draggable').forEach(item => {
                item.style.zIndex = '1';
            });
            fullSize.style.zIndex = '999';
        }

        if (window.innerWidth < 768) {
            const info = fullSize.getAttribute('data-info');
            if (info && infoText) {
                infoText.innerHTML = info;
            }
        }

        addInfoHoverHandlers(fullSize);

        Draggable.create(fullSize, {
            bounds: dragArea,
            inertia: true,
            onDrag: function () {
                if (window.innerWidth >= 768) {
                    checkFusion();
                } else {
                    checkReturnToDrawer(this.target);
                }
            },
            onDragEnd: function () {
                if (window.innerWidth < 768) {
                    checkReturnToDrawer(this.target, true);
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
                { className: 'suit', previewSize: '4rem', fullSize: '11.5rem', image: 'src/assets/WalterSuitDressUp.png', info: 'Walter suit - Tailored suit fused with a papilla shield. Perfect protection, perfect blend, half office, half battlefield. For the one that never sleeps' },
                { className: 'mask', previewSize: '3.5rem', fullSize: '5rem', image: 'src/assets/WalterMaskDressUp.png', info: 'Walter mask - Voodoo spirit stitched to a fetish hood. Sacred and obscene at once, looks like you are hiding your darkest secrets under it..' },
                { className: 'wrong-mask', previewSize: '3rem', fullSize: '4rem', image: 'src/assets/WrongMaskDressUp.png', info: 'Striped Walter mask - Voodoo spirit stitched to a fetish hood. Made from Voodoo and Bdsm. Good for your disguise but are you sure that color fits you?' },
                { className: 'bow', previewSize: '2.5rem', fullSize: '2rem', image: 'src/assets/BowDressUp.png', info: "Neck bow - A soft ribbon tied too perfectly to be innocent. It's decoration now, one that would make people suspect nothing." },
                { className: 'hat', previewSize: '3rem', fullSize: '5rem', image: 'src/assets/HatDressUp.png', info: 'Walter hat - A hand‑made Walter hat that turns the head into a cartoon thought bubble. Optional armor for when you want the joke to sit on top.' },
                { className: 'stick', previewSize: '1.5rem', fullSize: '3.5rem', image: 'src/assets/CorrectStickDressUp.png', info: "Right handed cane - A gentleman's cane with a dangling chain leash. Authority meets restrain, the perfect prop to tame the beast your collar is struggling to contain." },
                { className: 'wrong-cane', previewSize: '1rem', fullSize: '2.5rem', image: 'src/assets/WrongCaneDressUp.png', info: "Left handed cane - A gentleman's cane with a dangling chain leash. Authority meets restraint. Close enough to confuse you but maybe try the right hand." },
                { className: 'lock', previewSize: '2.5rem', fullSize: '2.5rem', image: 'src/assets/LockDressUp.png', info: 'Lock - A sleek metal collar that keeps the beast on a leash. A reminder that the thing is still trapped underneath.' },
                { className: 'pants', previewSize: '3rem', fullSize: '8rem', image: 'src/assets/PantsDressUp.png', info: "Walter pants - Runway trousers cut with Walter's exaggerated proportions. They already bend the body into a new silhouette, but they need the right top half to feel complete." }
            ];

            mobileShapes.forEach((shape, index) => {
                const preview = document.createElement('div');
                preview.className = 'create-skin__preview ' + shape.className;
                preview.setAttribute('data-info', shape.info);
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ArtifactsCarousel();
        CreateSkinInteraction();
    });
} else {
    ArtifactsCarousel();
    CreateSkinInteraction();
}
