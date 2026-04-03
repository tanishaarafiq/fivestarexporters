import { engagementAPI } from '../api';

const getStorageKey = () => {
    const user = localStorage.getItem('fivestar_user');
    if (user) {
        try {
            const { id } = JSON.parse(user);
            return `fivestar_wishlist_${id}`;
        } catch (e) {
            return 'fivestar_wishlist_guest';
        }
    }
    return 'fivestar_wishlist_guest';
};

export const toggleWishlist = (product) => {
    if (!product || !product.partCode) return false;

    try {
        const STORAGE_KEY = getStorageKey();
        const rawItems = localStorage.getItem(STORAGE_KEY);
        let items = rawItems ? JSON.parse(rawItems) : [];

        const index = items.findIndex(v => v.partCode === product.partCode);
        let added = false;

        if (index > -1) {
            items.splice(index, 1);
            added = false;
        } else {
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
        window.dispatchEvent(new Event('wishlistUpdated'));

        if (localStorage.getItem('fivestar_token')) {
            engagementAPI.record(product.name, product.partCode, added ? 'liked' : 'unliked').catch(() => {});
        }

        return added;
    } catch (error) {
        console.error('Failed to toggle wishlist:', error);
        return false;
    }
};

export const isInWishlist = (partCode) => {
    if (!partCode) return false;
    try {
        const STORAGE_KEY = getStorageKey();
        const rawItems = localStorage.getItem(STORAGE_KEY);
        const items = rawItems ? JSON.parse(rawItems) : [];
        return items.some(v => v.partCode === partCode);
    } catch (error) {
        return false;
    }
};

export const getWishlistItems = () => {
    try {
        const STORAGE_KEY = getStorageKey();
        const rawItems = localStorage.getItem(STORAGE_KEY);
        return rawItems ? JSON.parse(rawItems) : [];
    } catch (error) {
        return [];
    }
};

export const getWishlistCount = () => {
    return getWishlistItems().length;
};

