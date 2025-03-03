document.addEventListener("DOMContentLoaded", function() {
    const timelineItems = document.querySelectorAll(".timeline-item");
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add("visible");
        }, index * 300);
    });
});