document.addEventListener("DOMContentLoaded", function() {
    const timelineItems = document.querySelectorAll(".timeline-item");
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor = "#00DAC6"; // Highlight color
    const backgroundColor = rootStyles.getPropertyValue('--body-bg').trim();
    const textColor = rootStyles.getPropertyValue('--body-color').trim();
    const dateColor = "#c2c1c1"; // Lighter color for the years
    
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add("visible");
            item.style.borderLeft = `3px solid ${primaryColor}`;
            item.style.backgroundColor = backgroundColor;
            item.style.color = textColor;
            item.querySelector(".timeline-date").style.color = dateColor; // Set lighter color for dates
        }, index * 300);
    });
    
});