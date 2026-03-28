document.addEventListener("DOMContentLoaded", function() {
    const rootStyles = getComputedStyle(document.documentElement);
    const bg   = rootStyles.getPropertyValue('--body-bg').trim();
    const text = rootStyles.getPropertyValue('--body-color').trim();

    document.querySelectorAll(".timeline-item, .project-card").forEach(el => {
        el.style.backgroundColor = bg;
        el.style.color = text;
    });
});
