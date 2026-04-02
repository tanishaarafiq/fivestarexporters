export const toggleWishlist = (product) => {
    if (!product || !product.partCode) return false;

    try {
        const STORAGE_KEY = 'fivestar_wishlist';
        const rawItems = localStorage.getItem(STORAGE_KEY);
        let items = rawItems ? JSON.parse(rawItems) : [];

        const index = items.findIndex(v => v.partCode === product.partCode);
        let added = false;

        if (index > -1) {
            // Remove if it exists
            items.splice(index, 1);
            added = false;
        } else {
            // Add new item
            items.push({
                name: product.name,
                partCode: product.partCode,
                category: product.category,
                price: product.price,
                addedAt: new Date().toISOString()
            });
            added = true;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        // Dispatch custom event to notify other components (like Header)
        window.dispatchEvent(new Event('wishlistUpdated'));
        return added;
    } catch (error) {
        console.error('Failed to toggle wishlist:', error);
        return false;
    }
};

export const isInWishlist = (partCode) => {
    if (!partCode) return false;
    try {
        const STORAGE_KEY = 'fivestar_wishlist';
        const rawItems = localStorage.getItem(STORAGE_KEY);
        const items = rawItems ? JSON.parse(rawItems) : [];
        return items.some(v => v.partCode === partCode);
    } catch (error) {
        return false;
    }
};

export const getWishlistItems = () => {
    try {
        const STORAGE_KEY = 'fivestar_wishlist';
        const rawItems = localStorage.getItem(STORAGE_KEY);
        return rawItems ? JSON.parse(rawItems) : [];
    } catch (error) {
        return [];
    }
};

export const getWishlistCount = () => {
    return getWishlistItems().length;
};
