import React from "react";

const ImageGallery = () => {
    const images = [
        {
            id: 1,
            url: "/images/us-polo.webp",
            description: "Trending Footwear",
            boldDescription: "Shop Now!", // New bold description
            brandLogo: "images/us-polo-logo.jpg",
        },
        {
            id: 2,
            url: "/images/levis.avif",
            description: "Bestselling casuals",
            boldDescription: "Seasonal Sale", // New bold description
            brandLogo: "/images/levis-logo.png",
        },
        {
            id: 3,
            url: "/images/chanel-bag.webp",
            description: "International Picks",
            boldDescription: "Limited Edition", // New bold description
            brandLogo: "/images/chanel-logo.png",
        },

        {
            id: 4,
            url: "/images/ray-ban-sunglasses.webp",
            description: "Stylish Sunglasses",
            boldDescription: "Best Seller", // New bold description
            brandLogo: "/images/ray-ban.png",
        },
        {
            id: 5,
            url: "/images/fossil.jpg",
            description: "Latest Watches",
            boldDescription: "New Arrivals", // New bold description
            brandLogo: "/images/fossil-logo.png",
        },
        {
            id: 6,
            url: "/images/blazer.jpg",
            description: "Work-Ready Style",
            boldDescription: "Exclusive Offer", // New bold description
            brandLogo: "/images/allen-solly-logo.png",
        },

    ];

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-3xl font-semibold text-white mb-4 text-center">Global Brands</h2>

            {/* Image Row */}
            <div className="grid grid-cols-6 w-full">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="relative border border-gray-200 flex"
                        style={{ height: "250px" }}
                    >
                        <img
                            src={image.url}
                            alt={`${image.id}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Brand Logos Row */}
            <div className="grid grid-cols-6 w-full mt-2">
                {images.map((image) => (
                    <div key={image.id} className="flex justify-center items-center h-12">
                        <img
                            src={image.brandLogo}
                            alt={`Brand ${image.id}`}
                            className="h-10 object-contain"
                        />
                    </div>
                ))}
            </div>

            {/* Description Row */}
            <div className="grid grid-cols-6 w-full">
                {images.map((image) => (
                    <div key={image.id} className="text-center p-2 text-gray-700 text-sm">
                        {image.description}
                    </div>
                ))}
            </div>

            {/* Bold Description Row */}
            <div className="grid grid-cols-6 w-full mt-2">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="text-center p-2 text-gray-800 font-bold text-lg"
                    >
                        {image.boldDescription}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
