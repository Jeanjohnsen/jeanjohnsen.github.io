document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealElements = [...document.querySelectorAll("[data-reveal]")];
    const activateTimelineItem = (timeline, item) => {
        if (!timeline || !item || timeline.activeItem === item) {
            return;
        }

        timeline.activeItem = item;

        timeline.items.forEach((card) => {
            const isActive = card === item;
            card.classList.toggle("is-active", isActive);
            if (isActive) {
                card.setAttribute("aria-current", "step");
            } else {
                card.removeAttribute("aria-current");
            }
        });

        if (timeline.activeDate) {
            timeline.activeDate.textContent = item.dataset.date || "";
        }

        if (timeline.activeTitle) {
            timeline.activeTitle.textContent = item.dataset.title || "";
        }

        if (timeline.activeMeta) {
            timeline.activeMeta.textContent = item.dataset.meta || "";
        }

        if (timeline.activeSummary) {
            timeline.activeSummary.textContent = item.dataset.summary || "";
        }
    };

    revealElements.forEach((element, index) => {
        if (!reduceMotion) {
            element.classList.add("reveal-hidden");
        }

        element.style.transitionDelay = `${Math.min(index % 6, 5) * 24}ms`;
        if (reduceMotion) {
            element.classList.add("is-visible");
        }
    });

    if (!reduceMotion && "IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.16,
                rootMargin: "0px 0px -8% 0px",
            }
        );

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    }

    const timelines = [...document.querySelectorAll("[data-timeline]")]
        .map((section) => {
            const items = [...section.querySelectorAll("[data-timeline-item]")];
            const track = section.querySelector("[data-timeline-track]");

            if (!items.length || !track) {
                return null;
            }

            const timeline = {
                section,
                items,
                track,
                activeDate: section.querySelector("[data-active-date]"),
                activeTitle: section.querySelector("[data-active-title]"),
                activeMeta: section.querySelector("[data-active-meta]"),
                activeSummary: section.querySelector("[data-active-summary]"),
                activeItem: null,
            };

            items.forEach((item, index) => {
                item._timeline = timeline;
                item.tabIndex = 0;

                item.addEventListener("mouseenter", () => activateTimelineItem(timeline, item));
                item.addEventListener("focus", () => activateTimelineItem(timeline, item));
                item.addEventListener("keydown", (event) => {
                    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
                        return;
                    }

                    event.preventDefault();
                    const direction = event.key === "ArrowDown" ? 1 : -1;
                    const sibling = items[index + direction];

                    if (!sibling) {
                        return;
                    }

                    sibling.focus({ preventScroll: reduceMotion });
                    sibling.scrollIntoView({
                        block: "center",
                        behavior: reduceMotion ? "auto" : "smooth",
                    });
                });
            });

            activateTimelineItem(
                timeline,
                items.find((item) => item.classList.contains("is-active")) || items[0]
            );

            return timeline;
        })
        .filter(Boolean);

    if (!reduceMotion && "IntersectionObserver" in window) {
        const activeObserver = new IntersectionObserver(
            (entries) => {
                const candidates = new Map();

                entries.forEach((entry) => {
                    if (!entry.isIntersecting || !entry.target._timeline) {
                        return;
                    }

                    const timeline = entry.target._timeline;
                    const current = candidates.get(timeline);

                    if (!current || current.intersectionRatio < entry.intersectionRatio) {
                        candidates.set(timeline, entry);
                    }
                });

                candidates.forEach((entry, timeline) => activateTimelineItem(timeline, entry.target));
            },
            {
                threshold: [0.32, 0.5, 0.7],
                rootMargin: "-18% 0px -34% 0px",
            }
        );

        timelines.forEach((timeline) => timeline.items.forEach((item) => activeObserver.observe(item)));
    }

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const parallaxElements = reduceMotion ? [] : [...document.querySelectorAll("[data-depth]")];

    const updateScene = () => {
        const anchor = window.scrollY + window.innerHeight * 0.42;

        timelines.forEach((timeline) => {
            const centers = timeline.items.map((item) => {
                const rect = item.getBoundingClientRect();
                return window.scrollY + rect.top + rect.height / 2;
            });

            const first = centers[0] ?? anchor;
            const last = centers[centers.length - 1] ?? first + 1;
            const progress = clamp((anchor - first) / Math.max(last - first, 1), 0, 1);

            timeline.track.style.setProperty("--timeline-progress", progress.toFixed(4));

            const nearest = timeline.items.reduce(
                (closest, item, index) => {
                    const distance = Math.abs(anchor - centers[index]);
                    if (distance < closest.distance) {
                        return { item, distance };
                    }
                    return closest;
                },
                { item: timeline.items[0], distance: Number.POSITIVE_INFINITY }
            );

            activateTimelineItem(timeline, nearest.item);
        });

        parallaxElements.forEach((element) => {
            const depth = Number.parseFloat(element.dataset.depth || "0");
            const rect = element.getBoundingClientRect();
            const distanceFromCenter = rect.top + rect.height / 2 - window.innerHeight / 2;
            const shift = clamp(distanceFromCenter * depth * -0.03, -10, 10);
            element.style.setProperty("--parallax-shift", `${shift.toFixed(2)}px`);
        });
    };

    let frameRequested = false;
    const requestUpdate = () => {
        if (frameRequested) {
            return;
        }

        frameRequested = true;
        window.requestAnimationFrame(() => {
            updateScene();
            frameRequested = false;
        });
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    updateScene();
});
