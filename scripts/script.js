document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    initParticles(reduceMotion);
    initScrollProgress();
    initReveal(reduceMotion);
    initSectionNav();
});

function initScrollProgress() {
    const progress = document.getElementById("progress");
    if (!progress) {
        return;
    }

    const updateProgress = () => {
        const scrollTop = window.scrollY || window.pageYOffset;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
        progress.style.width = `${ratio * 100}%`;
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
}

function initReveal(reduceMotion) {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    if (!elements.length) {
        return;
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, activeObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                activeObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -8% 0px",
        }
    );

    elements.forEach((element) => observer.observe(element));
}

function initSectionNav() {
    const links = Array.from(document.querySelectorAll("[data-nav-link]"));
    const sections = Array.from(document.querySelectorAll("[data-section]"));

    if (!links.length || !sections.length) {
        return;
    }

    const header = document.querySelector(".site-header");
    let currentActiveSection = "";

    const getHeaderOffset = () => {
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        return headerHeight + 24;
    };

    const setActiveLink = (sectionId) => {
        currentActiveSection = sectionId;
        links.forEach((link) => {
            const isActive = link.dataset.navLink === sectionId;
            link.classList.toggle("is-active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.dataset.navLink;
            const target = targetId ? document.getElementById(targetId) : null;

            if (!target) {
                return;
            }

            event.preventDefault();
            const targetTop = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

            window.scrollTo({
                top: Math.max(targetTop, 0),
                behavior: "smooth",
            });

            history.replaceState(null, "", `#${targetId}`);
            setActiveLink(targetId);
        });
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (!visibleEntries.length) {
                    return;
                }

                const activeSection = visibleEntries[0].target.dataset.section;
                if (activeSection && activeSection !== currentActiveSection) {
                    setActiveLink(activeSection);
                    history.replaceState(null, "", `#${activeSection}`);
                }
            },
            {
                rootMargin: "-22% 0px -52% 0px",
                threshold: [0.15, 0.3, 0.5, 0.75],
            }
        );

        sections.forEach((section) => observer.observe(section));
    } else {
        const onScroll = () => {
            let activeId = sections[0].dataset.section;
            const offset = getHeaderOffset();

            sections.forEach((section) => {
                if (window.scrollY >= section.offsetTop - offset - 12) {
                    activeId = section.dataset.section;
                }
            });

            if (activeId) {
                setActiveLink(activeId);
            }
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    const initialHash = window.location.hash.replace("#", "");
    const initialTarget = initialHash ? document.getElementById(initialHash) : null;

    if (initialTarget) {
        window.requestAnimationFrame(() => {
            const targetTop = initialTarget.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
            window.scrollTo(0, Math.max(targetTop, 0));
        });
        setActiveLink(initialHash);
    } else {
        setActiveLink(sections[0].dataset.section || "");
    }
}

function initParticles(reduceMotion) {
    const canvas = document.getElementById("particles");
    if (!canvas || reduceMotion) {
        return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
        return;
    }

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrame = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        particles = Array.from({ length: Math.max(32, Math.min(48, Math.round(width / 34))) }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.38,
            vy: (Math.random() - 0.5) * 0.38,
            radius: Math.random() * 1.6 + 0.5,
            color: Math.random() > 0.5 ? "0,255,204" : "255,0,170",
        }));
    }

    function draw() {
        context.clearRect(0, 0, width, height);

        particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > width) {
                particle.vx *= -1;
            }

            if (particle.y < 0 || particle.y > height) {
                particle.vy *= -1;
            }

            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            context.fillStyle = `rgba(${particle.color}, 0.6)`;
            context.fill();
        });

        for (let i = 0; i < particles.length; i += 1) {
            for (let j = i + 1; j < particles.length; j += 1) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.hypot(dx, dy);

                if (distance < 120) {
                    context.beginPath();
                    context.moveTo(particles[i].x, particles[i].y);
                    context.lineTo(particles[j].x, particles[j].y);
                    context.strokeStyle = `rgba(0,255,204,${0.12 * (1 - distance / 120)})`;
                    context.lineWidth = 0.5;
                    context.stroke();
                }
            }
        }

        animationFrame = window.requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    window.addEventListener(
        "beforeunload",
        () => {
            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
            }
        },
        { once: true }
    );

    resize();
    draw();
}
