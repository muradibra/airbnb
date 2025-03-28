import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      <div className="md:hidden">
        <Swiper
          modules={[Pagination]}
          pagination={{ dynamicBullets: true, clickable: true }}
          className="rounded-xl overflow-hidden"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative pb-[75%]"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image}
                  alt={`Listing ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="hidden md:grid md:grid-cols-4 gap-2 rounded-3xl overflow-hidden">
        <div
          className="md:col-span-2 md:row-span-2 cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <img
            src={images[0]}
            alt="Main Listing"
            className="w-full h-full object-cover hover:brightness-90 transition"
          />
        </div>
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => openLightbox(index + 1)}
          >
            <img
              src={image}
              alt={`Listing ${index + 2}`}
              className="w-full h-full object-cover hover:brightness-90 transition"
            />
          </div>
        ))}
      </div>

      {/* Lightbox with Thumbnails */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={images.map((src) => ({ src }))}
        plugins={[Thumbnails]}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80,
          border: 2,
          borderRadius: 4,
          padding: 4,
          gap: 16,
        }}
      />
    </>
  );
};

export default ImageGallery;
