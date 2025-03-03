document.addEventListener("DOMContentLoaded", function() {
    const timelineItems = document.querySelectorAll(".timeline-item");
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor = "#00DAC6"; // Highlight color
    const backgroundColor = rootStyles.getPropertyValue('--body-bg').trim();
    const textColor = rootStyles.getPropertyValue('--body-color').trim();
    const dateColor = "#c2c1c1"; // Lighter color for the years
    
    timelineItems.forEach(item => {
        item.style.borderLeft = `3px solid ${primaryColor}`;
        item.style.backgroundColor = backgroundColor;
        item.style.color = textColor;
        if (item.querySelector(".timeline-date")) {
            item.querySelector(".timeline-date").style.color = dateColor;
        }
    });
    
});
