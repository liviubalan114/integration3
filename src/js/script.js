// ================================================
// ARTIFACTS CAROUSEL
// ================================================

/*
const ArtifactsCarousel = () => {
    const carousel = document.querySelector('[data-carousel]');
    if (!carousel) return;

    const track = carousel.querySelector('[data-track]');
    const slides = Array.from(track.querySelectorAll('[data-slide]'));
    const prevBtn = carousel.querySelector('[data-nav="prev"]');
    const nextBtn = carousel.querySelector('[data-nav="next"]');
    const dots = Array.from(document.querySelectorAll('[data-dot]'));
    const designerNameEl = document.querySelector('[data-designer-name]');

    // Designer names matching each slide
    const designerNames = ['WALTER', 'ANN', 'DRIES', 'DIRK', 'MARINA', 'DIRK B'];

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let currentTranslate = 0;

    // Initialize: show first slide
    const updateSlide = (index) => {
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));

        // Add active class to current slide
        slides[index].classList.add('active');

        // Update dots
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('artifacts__dot--active');
            } else {
                dot.classList.remove('artifacts__dot--active');
            }
        });

        // Update background designer name
        if (designerNameEl) {
            designerNameEl.textContent = designerNames[index];
        }

        currentIndex = index;
    };

    // Navigate to next slide
    const nextSlide = () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        updateSlide(nextIndex);
    };

    // Navigate to previous slide
    const prevSlide = () => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlide(prevIndex);
    };

    // Navigate to specific slide
    const goToSlide = (index) => {
        updateSlide(index);
    };

    // Touch/drag handlers
    const handleDragStart = (e) => {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        track.style.cursor = 'grabbing';
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        currentTranslate = currentX - startX;
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';

        // Determine if swipe was significant enough
        const threshold = 50; // minimum pixels to trigger slide change

        if (currentTranslate < -threshold) {
            // Swiped left - go to next
            nextSlide();
        } else if (currentTranslate > threshold) {
            // Swiped right - go to previous
            prevSlide();
        }

        currentTranslate = 0;
    };

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Touch events for mobile
    track.addEventListener('touchstart', handleDragStart, { passive: true });
    track.addEventListener('touchmove', handleDragMove, { passive: false });
    track.addEventListener('touchend', handleDragEnd, { passive: true });

    // Mouse events for desktop
    track.addEventListener('mousedown', handleDragStart);
    track.addEventListener('mousemove', handleDragMove);
    track.addEventListener('mouseup', handleDragEnd);
    track.addEventListener('mouseleave', () => {
        if (isDragging) handleDragEnd();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!carousel.matches(':hover')) return;
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Initialize first slide
    updateSlide(0);
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ArtifactsCarousel);
} else {
    ArtifactsCarousel();
}
*/
