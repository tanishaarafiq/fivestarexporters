export const recordProductView = (product) => {
    if (!product || !product.partCode) return;

    try {
        const STORAGE_KEY = 'fivestar_recent_views';
        const rawViews = localStorage.getItem(STORAGE_KEY);
        let views = rawViews ? JSON.parse(rawViews) : [];

        // Remove if already exists (to move it to the front)
        views = views.filter(v => v.partCode !== product.partCode);

        // Add to the beginning
        views.unshift({
            name: product.name,
            partCode: product.partCode,
            category: product.category,
            price: product.price,
            viewedAt: new Date().toISOString()
        });

        // Keep only top 10
        const limitedViews = views.slice(0, 10);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedViews));
    } catch (error) {
        console.error('Failed to record product view:', error);
    }
};

export const getRecentViews = () => {
    try {
        const STORAGE_KEY = 'fivestar_recent_views';
        const rawViews = localStorage.getItem(STORAGE_KEY);
        return rawViews ? JSON.parse(rawViews) : [];
    } catch (error) {
        console.error('Failed to get recent views:', error);
        return [];
    }
};

export const clearRecentViews = () => {
    localStorage.removeItem('fivestar_recent_views');
};
