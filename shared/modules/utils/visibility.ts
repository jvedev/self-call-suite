export function onVisibilityChange(element: HTMLElement, callback: (visible: boolean) => void): () => void {
    let isVisible = false;

    // Helper to check if element is actually visible via CSS
    const isDisplayVisible = (): boolean => {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               parseFloat(style.opacity) > 0;
    };

    // Create Intersection Observer to detect when element scrolls into view
    const intersectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const currentlyVisible = entry.isIntersecting && isDisplayVisible();

                // Only fire callback if visibility state changed
                if (currentlyVisible !== isVisible) {
                    isVisible = currentlyVisible;
                    callback(isVisible);
                }
            });
        },
        {
            threshold: 0.1, // Trigger when at least 10% is visible
            rootMargin: '0px'
        }
    );

    // Start observing
    intersectionObserver.observe(element);

    // Also listen for style changes that might affect visibility
    const mutationObserver = new MutationObserver(() => {
        const currentlyVisible = isDisplayVisible();
        if (currentlyVisible !== isVisible) {
            isVisible = currentlyVisible;
            callback(isVisible);
        }
    });

    mutationObserver.observe(element, {
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // Return cleanup function
    return () => {
        intersectionObserver.disconnect();
        mutationObserver.disconnect();
    };
}