import React from 'react';
import Slider from 'react-slick';

const CarouselBanner = () => {
  const images = [
    { src: '/images/shoes.jpg', alt: 'Black Leather Shoes', caption: 'Stylish Shoes Collection' },
    { src: '/images/clothes.jpg', alt: 'Summer Collection', caption: 'Summer Collection' },
    { src: '/images/watch.jpg', alt: 'Latest Mobiles ', caption: 'Latest Watches' },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img 
              src={image.src} 
              alt={image.alt} 
              className="w-full h-96 object-cover" // Adjust height as needed (e.g., h-64, h-96)
            />
            <div className="absolute bottom-5 left-0 right-0 text-center text-white bg-black bg-opacity-50 p-2">
              <p className="text-lg font-bold">{image.caption}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarouselBanner;
