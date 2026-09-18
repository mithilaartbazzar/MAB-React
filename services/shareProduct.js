export const buildProductShareUrl = (productId, baseUrl = typeof window !== 'undefined' ? window.location.origin : '') => {
    if (!productId) {
        throw new Error('A product id is required to build the share URL.');
    }

    const origin = (baseUrl || (typeof window !== 'undefined' ? window.location.origin : '') || '').replace(/\/+$/, '');
    return `${origin}/product/${encodeURIComponent(productId)}`;
};

export const handleShareProduct = async ({
    product,
    baseUrl,
    onCopy,
    onError,
} = {}) => {
    if (!product?.name) {
        const message = 'A product id is required before sharing.';
        onError?.(message);
        throw new Error(message);
    }

    const shareUrl = buildProductShareUrl((product.name).toLowerCase().replaceAll(" ", "-"), baseUrl);
    const shareData = {
        title: product.name || 'Mithila Chitrakala Store',
        text: product.description || `View ${product.name || 'this product'} at Mithila Chitrakala Store.`,
        url: shareUrl,
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            return shareUrl;
        }

        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(shareUrl);
            onCopy?.();
            return shareUrl;
        }

        window.open(shareUrl, '_blank', 'noopener,noreferrer');
        return shareUrl;
    } catch (error) {
        if (error?.name !== 'AbortError') {
            console.error('Error sharing product:', error);
            onError?.(error.message || 'Unable to share this product right now.');
        }
        return shareUrl;
    }
};
