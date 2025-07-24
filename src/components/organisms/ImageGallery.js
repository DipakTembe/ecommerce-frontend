import React from "react";

const ImageGallery = () => {
    const images = [
        {
            id: 1,
            url: "/images/us-polo.webp",
            description: "Trending Footwear",
            boldDescription: "Shop Now!",
            brandLogo: "/images/us-polo-logo.jpg",
            brandName: "US Polo"
        },
        {
            id: 2,
            url: "/images/levis.avif",
            description: "Bestselling Casuals",
            boldDescription: "Seasonal Sale",
            brandLogo: "/images/levis-logo.png",
            brandName: "Levis"
        },
        {
            id: 3,
            url: "/images/chanel-bag.webp",
            description: "International Picks",
            boldDescription: "Limited Edition",
            brandLogo: "/images/chanel-logo.png",
            brandName: "Chanel"
        },
        {
            id: 4,
            url: "/images/ray-ban-sunglasses.webp",
            description: "Stylish Sunglasses",
            boldDescription: "Best Seller",
            brandLogo: "/images/ray-ban.png",
            brandName: "Ray-Ban"
        },
        {
            id: 5,
            url: "/images/fossil.jpg",
            description: "Latest Watches",
            boldDescription: "New Arrivals",
            brandLogo: "/images/fossil-logo.png",
            brandName: "Fossil"
        },
        {
            id: 6,
            url: "/images/blazer.jpg",
            description: "Work-Ready Style",
            boldDescription: "Exclusive Offer",
            brandLogo: "/images/allen-solly-logo.png",
            brandName: "Allen Solly"
        }
    ];

    return (
        <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 bg-[#0f172a]">
            <h2 className="text-4xl font-bold text-white mb-10 text-center">
                Global Brands
            </h2>

            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 w-full">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="relative group rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 border border-gray-700"
                        style={{ height: "200px" }}
                    >
                        <img
                            src={image.url}
                            alt={image.brandName}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100">
                            {image.boldDescription}
                        </div>
                    </div>
                ))}
            </div>

            {/* Brand Logos */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 w-full mt-10">
                {images.map((image) => (
                    <div key={image.id} className="flex justify-center items-center h-14 bg-white rounded-md shadow">
                        <img
                            src={image.brandLogo}
                            alt={`${image.brandName}`}
                            className="h-10 object-contain"
                        />
                    </div>
                ))}
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full mt-8">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="text-center p-2 text-sm text-gray-200 tracking-wide"
                    >
                        {image.description}
                    </div>
                ))}
            </div>

            {/* Bold Descriptions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full mt-2">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="text-center p-2 text-white font-bold text-base"
                    >
                        {image.boldDescription}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
