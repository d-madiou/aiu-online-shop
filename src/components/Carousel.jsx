import { useState } from "react";

const Carousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = [
        "https://i.pinimg.com/736x/d6/d5/a9/d6d5a95b1dffb53617a901ab365edf58.jpg",
        "https://i.pinimg.com/236x/0c/6c/c0/0c6cc020d076ea3f418a060cda180095.jpg",
        "https://flowbite.com/docs/images/carousel/carousel-3.svg"
    ];

    const goToSlide = (index) => {
        setActiveIndex(index);
    };

    const nextSlide = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div id="default-carousel" className="relative" data-carousel="static">
                {/* Carousel wrapper */}
                <div className="overflow-hidden relative h-56 rounded-lg sm:h-64 xl:h-80 2xl:h-96">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className={`absolute w-full transition-opacity duration-700 ease-in-out ${
                                index === activeIndex ? "opacity-100" : "opacity-0"
                            }`}
                            data-carousel-item
                        >
                            <img
                                src={src}
                                className="block absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2"
                                alt={`Slide ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
                {/* Slider indicators */}
                <div className="flex absolute bottom-5 left-1/2 z-30 space-x-3 -translate-x-1/2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`w-3 h-3 rounded-full ${index === activeIndex ? "bg-blue-600" : "bg-gray-400"}`}
                            aria-current={index === activeIndex}
                            aria-label={`Slide ${index + 1}`}
                            onClick={() => goToSlide(index)}
                            data-carousel-slide-to={index}
                        ></button>
                    ))}
                </div>
                {/* Slider controls */}
                <button
                    type="button"
                    className="flex absolute top-0 left-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
                    onClick={prevSlide}
                    data-carousel-prev
                >
                    <span className="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        <span className="hidden">Previous</span>
                    </span>
                </button>
                <button
                    type="button"
                    className="flex absolute top-0 right-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
                    onClick={nextSlide}
                    data-carousel-next
                >
                    <span className="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        <span className="hidden">Next</span>
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Carousel;
