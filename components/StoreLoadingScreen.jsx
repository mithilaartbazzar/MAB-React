import React from 'react';

const PEACOCK_IMAGE_URL = 'https://res.cloudinary.com/djmbuuz28/image/upload/v1790577836/Madhubani_Peacock_and_Floral_Vine_mbespr.png';
const LOGO_IMAGE_URL = 'https://res.cloudinary.com/djmbuuz28/image/upload/v1790219754/LOGO_only_Zoomed_for_search_results_ynpjvm.png';

export function StoreLoadingScreen({ isExiting = false }) {
    return (
        <div
            className={`store-loader${isExiting ? ' store-loader--exiting' : ''}`}
            role="status"
            aria-label="Loading Mithila Chitrakala Store"
        >
            <div className="store-loader__border store-loader__border--top" aria-hidden="true" />
            <div className="store-loader__border store-loader__border--bottom" aria-hidden="true" />

            <div className="store-loader__peacock store-loader__peacock--left" aria-hidden="true">
                <img src={PEACOCK_IMAGE_URL} alt="" fetchPriority="high" />
            </div>
            <div className="store-loader__peacock store-loader__peacock--right" aria-hidden="true">
                <img src={PEACOCK_IMAGE_URL} alt="" fetchPriority="high" />
            </div>

            <div className="store-loader__center">
                <div className="store-loader__logo-spin">
                    <img
                        className="store-loader__logo"
                        src={LOGO_IMAGE_URL}
                        alt="Mithila Chitrakala Store"
                        fetchPriority="high"
                    />
                </div>
                <p className="store-loader__store-name">Mithila Chitrakala Store</p>
                <div className="store-loader__progress" aria-hidden="true">
                    <span />
                </div>
                <p className="store-loader__tagline">Bringing Mithila Art to Your Home</p>
            </div>
        </div>
    );
}