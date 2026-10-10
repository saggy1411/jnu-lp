/* =========================================================
   JNU FASHION DESIGN LANDING PAGE — INTERACTIVE SCRIPTS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. SAFE AUTOPLAY FOR ALL BACKGROUND VIDEOS
       Ensures muted autoplay complies with modern browser policies
    ====================================================== */
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
        video.muted = true;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {
                // Autoplay policy prevented playback; will play upon interaction
            });
        }
    });

    /* =====================================================
       2. ADMISSION FORM HANDLING & VALIDATION
    ====================================================== */
    const admissionForm = document.getElementById("admissionForm");

    if (admissionForm) {
        admissionForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // Native constraint validation
            if (!admissionForm.checkValidity()) {
                admissionForm.reportValidity();
                return;
            }

            // Explicit validation for consent checkbox
            const consentCheckbox = admissionForm.querySelector("#consent");
            if (consentCheckbox && !consentCheckbox.checked) {
                consentCheckbox.reportValidity();
                consentCheckbox.focus();
                return;
            }

            // Submit button feedback
            const submitButton = admissionForm.querySelector(".form-submit");
            if (!submitButton) return;

            const originalHTML = submitButton.innerHTML;
            submitButton.innerHTML = "Application Submitted ✓";
            submitButton.disabled = true;
            submitButton.classList.add("form-submitted");

            // Reset form fields
            admissionForm.reset();

            // Restore submit button after 4 seconds
            setTimeout(() => {
                submitButton.innerHTML = originalHTML;
                submitButton.disabled = false;
                submitButton.classList.remove("form-submitted");
            }, 4000);
        });
    }

    /* =====================================================
       3. SMOOTH SCROLLING FOR ALL CTA LINKS
       Scrolls smoothly to #apply and focuses full name field
    ====================================================== */
    const applyLinks = document.querySelectorAll('a[href="#apply"]');

    applyLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const formSection = document.getElementById("apply");
            if (!formSection) return;

            const formTop = formSection.getBoundingClientRect().top + window.pageYOffset - 25;

            window.scrollTo({
                top: formTop,
                behavior: "smooth"
            });

            // Focus first input field after scrolling
            setTimeout(() => {
                const firstInput = formSection.querySelector("#fullName");
                if (firstInput) {
                    firstInput.focus();
                }
            }, 500);
        });
    });

    /* =====================================================
       4. PREVENT EMPTY HASH JUMPS
    ====================================================== */
    document.querySelectorAll('a[href="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
        });
    });

    /* =====================================================
       5. ACTIVE CTA BUTTON FEEDBACK
    ====================================================== */
    const actionButtons = document.querySelectorAll('a[href="#apply"], .form-submit');
    actionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            button.classList.add("cta-clicked");
            setTimeout(() => {
                button.classList.remove("cta-clicked");
            }, 400);
        });
    });

    /* =====================================================
       6. EDITORIAL TEXT REFLECTION ANIMATION
    ====================================================== */
    const editorialText = document.querySelectorAll("h1 em, h2 em, h3 em");
    editorialText.forEach((text) => {
        text.classList.add("editorial-reflection");
    });

    /* =====================================================
       7. REDUCED MOTION SUPPORT
    ====================================================== */
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
        editorialText.forEach((text) => {
            text.classList.add("reduced-motion");
        });
        videos.forEach((video) => {
            video.pause();
        });
    }

    console.log("JNU Fashion Design landing page initialized.");
});

/* =========================================================
   COURSES — TRUE OVERLAP / STACK SCROLL
   Supports all course cards, including Course 03
========================================================= */

(() => {
    const courseSection = document.querySelector(".courses-showcase");
    const courseStack = document.querySelector(".courses-stack");

    if (!courseSection || !courseStack) return;

    const courseCards = Array.from(
        courseStack.querySelectorAll(".course-showcase-card")
    );

    if (courseCards.length < 2) return;

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function updateCourseStack() {
        const stickyTop =
            window.innerWidth <= 600 ? 45 :
                window.innerWidth <= 900 ? 55 : 90;

        courseCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();

            const animationDistance = Math.max(
                rect.height * 0.55,
                280
            );

            const progress = clamp(
                (
                    stickyTop +
                    animationDistance -
                    rect.top
                ) / animationDistance,
                0,
                1
            );

            // Each card gradually settles beneath the next card.
            const scale = 1 - progress * 0.035;
            const moveY = progress * -12;
            const brightness = 1 - progress * 0.06;

            card.style.transform =
                `translateY(${moveY}px) scale(${scale})`;

            card.style.filter =
                `brightness(${brightness})`;

            card.style.zIndex = String(index + 1);

            if (index < courseCards.length - 1) {
                card.style.opacity = String(1 - progress * 0.08);
            } else {
                card.style.opacity = "1";
            }
        });
    }

    let ticking = false;

    function requestCourseUpdate() {
        if (ticking) return;

        ticking = true;

        window.requestAnimationFrame(() => {
            updateCourseStack();
            ticking = false;
        });
    }

    window.addEventListener(
        "scroll",
        requestCourseUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestCourseUpdate
    );

    updateCourseStack();
})();


/* =========================================================
   PLACEMENT — SCROLL IMAGE JOURNEY
========================================================= */

(() => {

    const placement = document.querySelector(".placement-section");

    if (!placement) return;

    const slides = placement.querySelectorAll(".placement-slide");
    const steps = placement.querySelectorAll(".placement-step");
    const number = placement.querySelector(".placement-image-number");
    const caption = placement.querySelector(".placement-image-caption");

    if (!slides.length || !steps.length) return;


    const captions = [
        "Creativity into opportunity",
        "Build your creative foundation",
        "Develop your professional skills",
        "Gain real-world experience",
        "Connect with the professional world",
        "Take your next step"
    ];


    function updatePlacement() {

        const rect = placement.getBoundingClientRect();

        const sectionHeight = placement.offsetHeight;
        const viewportHeight = window.innerHeight;

        /*
         * Progress through the Placement section.
         */
        const start = viewportHeight * 0.65;

        const progress = Math.min(
            Math.max(
                (start - rect.top) /
                (sectionHeight - viewportHeight * 0.45),
                0
            ),
            0.999
        );


        /*
         * Convert scroll progress
         * into one of the six images.
         */
        const index = Math.min(
            Math.floor(progress * slides.length),
            slides.length - 1
        );


        /*
         * Change image.
         */
        slides.forEach((slide, i) => {

            slide.classList.toggle(
                "active",
                i === index
            );

        });


        /*
         * Update small visual number.
         */
        if (number) {

            number.textContent =
                String(index + 1).padStart(2, "0") +
                " / CAREER JOURNEY";

        }


        /*
         * Update image caption.
         */
        if (caption) {

            caption.textContent =
                captions[index];

        }


        /*
         * Highlight current journey step.
         */
        steps.forEach((step, i) => {

            step.classList.toggle(
                "placement-step-active",
                i === Math.min(
                    Math.floor(progress * steps.length),
                    steps.length - 1
                )
            );

        });

    }


    let ticking = false;


    function requestPlacementUpdate() {

        if (!ticking) {

            window.requestAnimationFrame(() => {

                updatePlacement();

                ticking = false;

            });

            ticking = true;

        }

    }


    window.addEventListener(
        "scroll",
        requestPlacementUpdate,
        { passive: true }
    );


    window.addEventListener(
        "resize",
        requestPlacementUpdate
    );


    updatePlacement();

})();

/* =========================================================
   USP — NUMBER COUNTER
========================================================= */

(() => {

    const counters = document.querySelectorAll(
        ".usp-stat strong[data-count]"
    );

    if (!counters.length) return;


    function animateCounter(counter) {

        const target = Number(counter.dataset.count);

        if (!Number.isFinite(target)) return;

        const duration = 1800;
        const startTime = performance.now();


        function updateCounter(currentTime) {

            const elapsed = currentTime - startTime;

            const progress = Math.min(
                elapsed / duration,
                1
            );

            // Smooth ease-out animation
            const easedProgress =
                1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(
                target * easedProgress
            );

            counter.textContent =
                currentValue.toLocaleString("en-IN") + "+";


            if (progress < 1) {

                requestAnimationFrame(updateCounter);

            } else {

                counter.textContent =
                    target.toLocaleString("en-IN") + "+";

            }

        }


        requestAnimationFrame(updateCounter);
    }


    const observer = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    animateCounter(entry.target);

                    // Run only once
                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.4
        }
    );


    counters.forEach(counter => {

        observer.observe(counter);

    });

})();
/* =========================================================
   GALLERY — 10 CARD OVERLAPPING CAROUSEL
========================================================= */

(function () {

    const gallery =
        document.querySelector(".fashion-gallery-carousel");

    if (!gallery) return;

    const cards =
        gallery.querySelectorAll(".fashion-gallery-card");

    const previous =
        gallery.querySelector(".gallery-prev");

    const next =
        gallery.querySelector(".gallery-next");

    const dotsContainer =
        gallery.querySelector(".fashion-gallery-dots");

    if (!cards.length) return;


    let current = 0;


    /* =========================
       CREATE DOTS
    ========================= */

    cards.forEach((card, index) => {

        const dot =
            document.createElement("button");

        dot.type = "button";
        dot.className = "fashion-gallery-dot";

        dot.setAttribute(
            "aria-label",
            "Go to gallery image " + (index + 1)
        );

        dot.addEventListener(
            "click",
            function () {
                goTo(index);
            }
        );

        dotsContainer.appendChild(dot);

    });


    const dots =
        dotsContainer.querySelectorAll(
            ".fashion-gallery-dot"
        );


    /* =========================
       UPDATE CARDS
    ========================= */

    function update() {

        const total = cards.length;

        cards.forEach((card, index) => {

            card.classList.remove(
                "is-active",
                "is-left",
                "is-right",
                "is-far-left",
                "is-far-right"
            );


            let distance =
                index - current;


            /*
             * Infinite circular positioning
             */

            if (distance > total / 2) {
                distance -= total;
            }

            if (distance < -total / 2) {
                distance += total;
            }


            if (distance === 0) {

                card.classList.add(
                    "is-active"
                );

            }

            else if (distance === -1) {

                card.classList.add(
                    "is-left"
                );

            }

            else if (distance === 1) {

                card.classList.add(
                    "is-right"
                );

            }

            else if (distance < 0) {

                card.classList.add(
                    "is-far-left"
                );

            }

            else {

                card.classList.add(
                    "is-far-right"
                );

            }

        });


        dots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === current
            );

        });

    }


    /* =========================
       NAVIGATION
    ========================= */

    function goTo(index) {

        current =
            (index + cards.length) %
            cards.length;

        update();

    }


    previous.addEventListener(
        "click",
        function () {
            goTo(current - 1);
        }
    );


    next.addEventListener(
        "click",
        function () {
            goTo(current + 1);
        }
    );


    /* =========================
       KEYBOARD
    ========================= */

    gallery.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "ArrowLeft") {
                goTo(current - 1);
            }

            if (event.key === "ArrowRight") {
                goTo(current + 1);
            }

        }
    );


    /* =========================
       TOUCH SWIPE
    ========================= */

    let startX = 0;


    gallery.addEventListener(
        "touchstart",
        function (event) {

            startX =
                event.changedTouches[0].screenX;

        },
        { passive: true }
    );


    gallery.addEventListener(
        "touchend",
        function (event) {

            const endX =
                event.changedTouches[0].screenX;

            const distance =
                endX - startX;


            if (Math.abs(distance) < 45) {
                return;
            }


            if (distance < 0) {
                goTo(current + 1);
            } else {
                goTo(current - 1);
            }

        },
        { passive: true }
    );


    /* Initial state */
    update();

})();